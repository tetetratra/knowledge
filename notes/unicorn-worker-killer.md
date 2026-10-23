---
tags: "unicorn, gem, プロセス"
---

# unicorn-worker-killer

- [unicorn-worker-killerが便利だった件 · zephiransasのチラシの裏](https://zephiransas.github.io/blog/2015/07/29/unicorn-worker-killer/)
  - > unicornのワーカプロセスは、通常では起動したままユーザからのリクエストを処理し、再起動されることはありません。
  - >その関係で、長時間運用していると、そのワーカプロセスがメモリをあるだけ食いつぶすような挙動になります。
  - >unicorn-worker-killerを使うことで、ワーカプロセスが以下の条件の場合に、自動的に再起動してくれます。
  - リクエストの回数基準・メモリの使用量を基準 などがある
- unicorn-worker-killerによるワーカー再起動は正常な挙動
- 3000~4000リクエスト程度で再起動させがちらしい
  - 1workerあたり3000~4000リクエストであって、サーバーあたり3000~4000リクエストではない
