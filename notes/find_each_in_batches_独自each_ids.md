---
tags: "ActiveRecord, データベース, SQL, Ruby_on_Rails, find_each, in_batches, each_ids, pluck, クエリキャッシュ, MySQL, 遅延評価"
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
- find_eachやin_batchは、主キーの順でしか区切れない
  - `WHERE id > 前回の最後のid ORDER BY id LIMIT 1000` を繰り返し、relationに付けた`order`は無視される
  - 選べるのは主キーの昇順か降順（`order: :desc`）だけ（[Rails API: ActiveRecord::Batches#find_each](https://api.rubyonrails.org/classes/ActiveRecord/Batches.html#method-i-find_each)）
- Rails 8.0以降は、`cursor:`で主キー以外の列でも区切れる
  - 例：`find_each(cursor: [:created_at, :id], order: :desc)`
  - cursorには一意な列を含める必要があり、含まないと`ArgumentError`になる。日時のように値が重なりうる列には主キーを足す
  - [rails v8.0.0のactiverecord/lib/active_record/relation/batches.rb](https://github.com/rails/rails/blob/v8.0.0/activerecord/lib/active_record/relation/batches.rb)
- Rails 7.2以前で任意の順に区切るなら、キーセットで区切るメソッドを自前で書く
  - 条件：`created_at < :created_at OR (created_at = :created_at AND id < :id)`、並び順：`ORDER BY created_at DESC, id DESC`
  - 取得件数が`LIMIT`に満たなければ、それが最後のバッチ
  - `Enumerator.produce`で前のバッチから次のバッチを作り、最後に`raise StopIteration`すると、ループと再代入なしで書ける
    - `.lazy.flat_map(&:itself)`で1件ずつの列にすると、読まれた分だけSQLを発行する
- 主キーで区切るバッチは、ほかの列で絞ると、主キーを逆向きにたどる実行計画になることがある
  - 例：`WHERE tenant_id = ? AND created_at >= ? AND id < ? ORDER BY id DESC LIMIT 1000` で、EXPLAINが`key: PRIMARY`、`Backward index scan`になる
  - ほかのテナントの行も主キーの順に読んで捨てるので、該当行の少ないテナントほど読む行が増える
  - 避け方：既存の複合インデックスの並びに沿うように区切る
    - `(tenant_id, created_at)`のインデックスなら、`(created_at, id)`で区切る。InnoDBの副インデックスは末尾に主キーを持つので、`(tenant_id, created_at, id)`の並びとして働く（[MySQL 8.0 Reference Manual: Use of Index Extensions](https://dev.mysql.com/doc/refman/8.0/en/index-extensions.html)）
  - データの少ない環境のEXPLAINは、MySQLが別の計画を選ぶので、本番の計画の参考にならない
- 独自each_idsだとクエリキャッシュ有効化だとメモリ超絶消費するので注意
  - find_each や in_batchesはクエリキャッシュが無効化されている
**まとめ**

| 方式 | 要素のサイズ | 作られるクエリ | クエリキャッシュ |
| --- | --- | --- | --- |
| find_each | ActiveRecord1個分 | index効かないクエリが1000件ごとに1回 | 無効になっている |
| in_batch (& pluck) | pure Ruby分 | index効かないクエリが1000件ごとに1回 | 無効になっている |
| 独自each_ids (& pluck) | pure Ruby分 | index効かないクエリが1万件ごとに1回 + 効くクエリが1000件ごとに1回 | そのままだと有効 |
