---
tags: "TypeScript, Graal, One VM to rule them all, haskell"
---

# Misreading Chat

- https://misreading.chat/
- >CS の論文読んで話をしよう
- [#26 – Mixed Messages: Measuring Conformance and Non-Interference in TypeScript – Misreading Chat](https://misreading.chat/2018/08/20/episode-26-mixed-messages-measuring-conformance-and-non-interference-in-typescript/)
  - >TypeScript の DefinitelyTyped から宣言間違いを探す論文について話します。
  - jsのライブラリを使うとき、.d.tsを書けばtsで使えるけれど、その.d.tsが間違えている場合がある
    - 手で書くことを definitely typed
  - .d.tsが間違えているときに、それを検出したい
    - 実装とインターフェースの一致を見たい
  - 型定義をランタイムに乗せる研究もある
  - ライブラリのテストコードを使う
    - importをwrapして入出力を監視する
    - ライブラリがアプリのコードを呼ぶときに、そのアプリのコードの型定義が一致しているか、をチェックできるようにする
    - アプリがライブラリを呼ぶときの型チェックは、
  - 40個(/120個)のライブラリで、なんらかの型定義間違いがあった
  - メタプロには弱い
- [#07 – One VM to Rule Them All – Misreading Chat](https://misreading.chat/2018/05/03/episode-07-one-vm-to-rule-them-all/)
  - >Graal VM のデザインを説明した論文 One VM to rule them all を紹介します。
  - 88 Haskellの歴史
