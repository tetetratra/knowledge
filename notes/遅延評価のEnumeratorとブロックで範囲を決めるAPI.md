---
tags: "Ruby, ActiveRecord, 遅延評価, イテレーター, ストリーミング, 例外処理"
---

# 遅延評価のEnumeratorとブロックで範囲を決めるAPI

- `connected_to(role: :reading) { ... }` のように、ブロックの中だけ設定を切り替える API は、レスポンスの body に渡す`Enumerator`と組み合わせると効かない
  - `Enumerator.new { |y| ... }` の中身は、Web サーバーが body を`each`で読むときに実行される。そのとき外側のブロックはもう終わっている
  - トランザクションや`distribute_reads { ... }`（gem distribute_reads）も同じ
  - relation も、ブロックを抜けてから`to_a`や`each`をすると、切り替えの外で SQL が実行される

```ruby
# 効かない：Enumerator の中身はブロックを抜けた後で実行される
ActiveRecord::Base.connected_to(role: :reading) do
  Enumerator.new { |y| Model.find_each { |r| y << to_csv_line(r) } }
end

# 効く：切り替えを Enumerator の中身の内側に書く
Enumerator.new do |y|
  ActiveRecord::Base.connected_to(role: :reading) do
    Model.find_each { |r| y << to_csv_line(r) }
  end
end
```

- 例外も同じで、ストリーミングの途中で起きた例外は、コントローラの`rescue`でもエラー通知のミドルウェアでも拾えない
  - どちらも、Web サーバーが body を読む前に処理を終えている
  - 1件分を作るブロックの中で`rescue`しても足りない。次のバッチを読む SQL やソケットへの書き込みは、ブロックの外で起きる
- `each`の最中をまるごと囲むには、`yield`するメソッドを`to_enum`で Enumerator にし、メソッドの`rescue`で書く
  - `obj.to_enum(:meth, *args)`は、`each`されたときに`obj.meth(*args)`を呼び、`yield`した値を要素にする（[Object#to_enum（Ruby リファレンスマニュアル）](https://docs.ruby-lang.org/ja/latest/method/Object/i/to_enum.html)）

```ruby
def stream(rows)
  to_enum(:each_chunk, rows)
end

# Web サーバーが body を読むときに呼ばれる。ミドルウェアの外なので、ここで通知する
def each_chunk(rows, &block)
  ActiveRecord::Base.connected_to(role: :reading) do
    rows.each { |chunk| block.call(chunk) }
  end
rescue StandardError => e
  notify(e) unless defined?(Puma::ConnectionError) && e.is_a?(Puma::ConnectionError)
  raise
end
```

- クライアントの切断は、ソケットへの書き込みで起きる例外として、`block.call`から返ってくる
  - Puma では`Puma::ConnectionError`。Puma が読み込まれていない環境（テストやジョブ）もあるので、`defined?`で確かめてから比べる
  - 拾ったあとは`raise`し直して、Web サーバーに接続を閉じてもらう
