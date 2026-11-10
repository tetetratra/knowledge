---
tags: "MySQL, InnoDB, インデックス, 複合インデックス"
---

# InnoDBのセカンダリインデックスは末尾に主キーを持つ

- InnoDB は、セカンダリインデックスの末尾に主キーの列を自動で付け足して持つ
  - オプティマイザも、付け足された主キーの列を使って範囲を絞れる（index extensions）
  - [MySQL 8.0 リファレンス「Use of Index Extensions」](https://dev.mysql.com/doc/refman/8.0/en/index-extensions.html)
- そのため `(a, created_at)` のインデックスだけで、`a` が一致し、`(created_at, id)` が前のページの最後の行より古い行を、新しい順に読める
  - 前のページの最後の行を起点に次のページを読む方式（キーセットページネーション）で、`created_at` が同じ行も `id` で順序が決まり、取りこぼさない
- `EXPLAIN` の `key_len` は、インデックスのうち使った部分のバイト数を表す
  - 主キーの条件まで効いていると、`key_len` が主キーの列の分（`BIGINT` なら8バイト）だけ長くなる
  - `key_len` の増え方で、付け足された主キーまで使っているかを見分けられる
