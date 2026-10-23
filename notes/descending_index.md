---
tags: "MySQL, 降順インデックス"
---

# descending index

- mysql8.0からは`a, b DECS`のようなインデックスを張ることができる
- [MySQL :: MySQL 8.0 リファレンスマニュアル :: 8.3.13 降順インデックス](https://dev.mysql.com/doc/refman/8.0/ja/descending-indexes.html)
- もともと、`a, b`の普通のインデックスで、`a, b DECS`を高速に検索することはできていたけれど、少しだけ遅かったらしい？
