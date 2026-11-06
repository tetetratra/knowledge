---
tags: "ActiveRecord, MySQL, データベース, Ruby_on_Rails, mysql2, ストリーミング"
---

# mysql2のstreamオプションでSQLの結果を1行ずつ受け取る

- `Mysql2::Client#query`に`stream: true`を付けると、結果を全行まとめて受け取らず、`each`で回すたびにサーバーから行を受け取る
  - クライアントのメモリに乗り切らない大きな結果を扱うためのもの（[mysql2 README「Streaming」](https://github.com/brianmario/mysql2#streaming)）
  - 既定は MySQL の C API の`mysql_store_result`で全行を受け取ってから返すので、メモリが行数に比例して増える
  - `stream: true`は`mysql_use_result`を使う。処理し終えた行は GC で回収できるので、メモリはほぼ1行分で済む（mysql2 0.5 の`ext/mysql2/client.c`で確認）
- ActiveRecord の API にはないので、ドライバ（`Mysql2::Client`）を直接使う
  - 書き方：`raw_connection.query(sql, stream: true, as: :hash).each { |row| ... }`
  - クエリキャッシュ、ログ、レプリカへの振り分けなど、ActiveRecord の仕組みは通らない
  - `stream: true`のときは`cache_rows`の指定は無視される（README に記載）
- 全行を読み終えるまで、同じ接続で別の SQL を実行できない
  - 実行すると`Mysql2::Error: Commands out of sync`になる
  - ストリーミング中に別の SQL が必要なら、`pool.checkout`でストリーミング専用の接続を借りる
    - 自動では返らないので、`ensure`で`result.free`して読み残しを捨ててから`pool.checkin(conn)`する
    - `pool.with_connection`は、スレッドがすでに持つ接続を使うことがあるので、別の1本になるとは限らない
  - 1リクエストで接続を2本使うので、プールの上限（`database.yml`の`pool`）はスレッド数より多くする
    - 空きがないと`checkout_timeout`（既定5秒）待ったあと`ActiveRecord::ConnectionTimeoutError`になる（[Rails API: ConnectionPool](https://api.rubyonrails.org/v7.2/classes/ActiveRecord/ConnectionAdapters/ConnectionPool.html)）
