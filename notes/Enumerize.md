---
tags: "Enumerize, Ruby on Rails, Gem, enum, NULL, NOT NULL制約"
---

# Enumerize

- Enumerizeで未定義のenum値がDBに入っていたとき、それを参照すると（エラーなどではなく）**nilが返ってくる**。
  - NOT NULL制約があるようなカラムであってもnilが返ってくる。
