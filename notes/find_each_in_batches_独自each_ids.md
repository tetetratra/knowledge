---
tags: "ActiveRecord, データベース, SQL, Ruby on Rails, find_each, in_batches, each_ids, pluck, クエリキャッシュ"
---

# find_each VS in_batches VS 独自each_ids

- **独自each_ids**とは
  - 対象レコードのidのみを1万件(= たくさん)ずつ取ってきて、中身(= ActiveRecordインスタンス)は1000件(= 程よい件数)ずつid指定(IN句)で回す方法
    - ActiveRecord1個分のサイズは1KB〜2KBくらい
- find_eachはどうしてもActiveRecordインスタンスが作られてしまうので、メモリ消費が激しい
  - in_batchや独自each_idsなら、pluckを使えるので、最低限のpure Rubyのデータ分の消費で済む
- find_eachやin_batchは、すべてのクエリに絞り込み条件が入ってくる
  - 「元の絞り込み条件」＋「ループ用のidの大小比較」
  - 「元の絞り込み条件」がインデックスが効かなくて重い場合、重いクエリが何度も発行されてしまう
  - 独自each_idsにすることで、重いクエリが発行される頻度を1/10とかに抑えることができる
- 独自each_idsだとクエリキャッシュ有効化だとメモリ超絶消費するので注意
  - find_each や in_batchesはクエリキャッシュが無効化されている
**まとめ**

| 方式 | 要素のサイズ | 作られるクエリ | クエリキャッシュ |
| --- | --- | --- | --- |
| find_each | ActiveRecord1個分 | index効かないクエリが1000件ごとに1回 | 無効になっている |
| in_batch (& pluck) | pure Ruby分 | index効かないクエリが1000件ごとに1回 | 無効になっている |
| 独自each_ids (& pluck) | pure Ruby分 | index効かないクエリが1万件ごとに1回 + 効くクエリが1000件ごとに1回 | そのままだと有効 |
