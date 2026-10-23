---
tags: "MySQL, InnoDB, インデックス, VARCHAR"
---

# MySQLのインデックス長には3072バイトの制限がある

- https://dev.mysql.com/doc/refman/8.0/ja/innodb-limits.html
- [第32回 InnoDBインデックスの最大キー長について | gihyo.jp](https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0032#sec3)
  - 以前は767 byteだったので、VARCHAR(255)で4バイト文字を格納すると溢れるので注意。
