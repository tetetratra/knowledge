---
tags: "MySQL, max_allowed_packet, SQL, IN句"
---

# max_allowed_packetはデフォルトで4MB、最大で16MB

- `max_allowed_packet`
  - クエリ文字数（バイト数）の最大長。
  - `show variables like 'max_allowed_packet';`で調べられる。
  - idカラムが1個あたり7バイトだとすると、16MBの環境では一度に約200万件もの数のidを`IN`句に直書きできる。
    - 4MBだと50万件。
    - とはいえギリギリは危ないので、安全に倒して少なめにしておくか、ロジック自体を直した方がよい。
