---
tags: "Ruby_on_Rails, Rack, Puma, Grape, HTTP, ストリーミング, エラー処理"
---

# Pumaはレスポンスbodyの要素ごとにソケットへ書き込む

- Puma は（4.3 のソースで確認）、レスポンスの body を`each`で回し、要素を受け取るたびにすぐソケットへ書き込む
  - 要素をまとめて書く仕組みはない。空の要素は書かない
  - `Content-Length`のないレスポンスはチャンク形式になり、1要素につき「長さ（16進数）」「改行」「中身」「改行」の4回、書き込む
**puma 4.3 の lib/puma/server.rb**

```ruby
res_body.each do |part|
  next if part.bytesize.zero?
  if chunked
    fast_write client, part.bytesize.to_s(16)
    fast_write client, line_ending
    fast_write client, part
    fast_write client, line_ending
  # ...（チャンク形式でない場合の書き込みは省略）
end
```

- [puma の lib/puma/server.rb](https://github.com/puma/puma/blob/v4.3.12/lib/puma/server.rb)
- そのため、CSV を1行1要素で返すと、書き込みの回数とチャンクの見出しのバイトが、行数に比例して増える
  - 数十〜数百行を1つの文字列にまとめて1要素にすると、書き込みの回数を減らせる
  - ただし、まとめる単位を大きくするほど、書き込み（I/O）のあいだが空き、そのあいだ GVL を手放さない
- `Rack::Deflater`も要素ごとに gzip へ書き込み、既定（`sync: true`）では要素ごとに flush する
  - [rack 2.2 の lib/rack/deflater.rb](https://github.com/rack/rack/blob/v2.2.23/lib/rack/deflater.rb)
- Grape（1.8）の`stream`に String を渡すと、ファイルのパスとして扱われる
  - `each`に応答するもの（Enumerator、Array など）は、そのまま body になる
  - [grape の lib/grape/dsl/inside_route.rb](https://github.com/ruby-grape/grape/blob/v1.8.0/lib/grape/dsl/inside_route.rb)
- Grape の`stream`は`Cache-Control: no-cache`を付けるが、Rack 2.2 の`Rack::ETag`は`Cache-Control`を見ないので、body を溜め込まれる
- 見出しと本文の列は`[header].chain(rows)`でつなげると、遅延評価のまま body に渡せる
- body を書いている途中で例外が起きても、ステータスとヘッダーは送信済みなので変えられない
  - Puma 4.3 は`process_client`で例外を拾い、`client.write_error(500)`で 500 の固定の応答文字列をソケットにそのまま書いてから、接続を閉じる（[puma の lib/puma/client.rb](https://github.com/puma/puma/blob/v4.3.12/lib/puma/client.rb)）
  - クライアントからは、チャンク形式の途中に読めないデータが来て、接続が切れたように見える
  - アプリのエラー処理（Grape の`rescue_from`など）は、エンドポイントの処理が終わっているので働かない
