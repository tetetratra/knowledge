---
tags: "Ruby, イテレーター, 遅延評価, 関数型プログラミング"
---

# RubyのEnumerator.produceは状態をそのまま要素にする

- `Enumerator.produce(initial) { |prev| ... }`は、前の要素をブロックに渡し、その返り値を次の要素にする無限の列を作る
  - `initial`を渡すと、それが最初の要素になる。渡さないと、最初の呼び出しに`nil`が渡り、その返り値が最初の要素になる
  - ブロックで`raise StopIteration`すると列が終わる
  - [Enumerator.produce（Ruby 3.4 のドキュメント）](https://docs.ruby-lang.org/en/3.4/Enumerator.html#method-c-produce)
- 初期値は引数なので、`produce`を呼んだ時点で評価される
  - `Enumerator.produce(relation.to_a) { ... }`と書くと、1つ目のバッチの SQL は列を読む前に走る
  - 読み出しを列が読まれるときまで遅らせたいなら、初期値を渡さず、`nil`を受け取った最初の呼び出しで読む
- Haskell の`unfoldr`は「出す値」と「次の状態」を別々に返すが、`produce`は`iterate`と同じく状態そのものが要素になる
  - そのため、バッチを状態にすると要素もバッチになり、1件ずつにするには後ろに`flat_map`が要る
  - `Enumerable`にも`Enumerator::Lazy`にも`flatten`はないので、遅延のまま平らにするには`flat_map`を使う
- 状態と出す値を分けたいなら、`Enumerator.new`の中で`loop`を回し、`yielder << 値`で出す
  - 「読む、1件ずつ出す、終わりか判定する、続きを読む」を上から順に書ける
  - `Enumerator.new`のブロックも、列を読み始めたときに初めて動く
