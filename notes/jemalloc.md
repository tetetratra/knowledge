---
tags: "malloc, メモリ管理, メモリ"
---

# jemalloc

- malloc メモリ管理 メモリ
  - https://jasone.github.io/2025/06/12/jemalloc-postmortem/
    - jemallocの興衰
  - [Ruby × jemallocのすすめ - メドピア開発者ブログ](https://tech.medpeer.co.jp/entry/ruby-jemalloc)
    - デフォルトは`glibc malloc`
    - 環境変数経由でjemallocのsoファイルのパスを渡せば動いてくれる
