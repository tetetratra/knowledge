---
tags: "Ruby_on_Rails, Ruby_on_Rails_model, find_each や in_batchesはクエリキャッシュが無効化されている, リードレプリカ, find_each, preload, N+1"
---

# ActiveRecord

- ActiveRecordインスタンスのサイズは数KB
  - ActiveRecord自体のサイズは、基本的にどんなテーブルであっても224byte
    - `ObjectSpace.memsize_of(record) => 224`
  - ただ、カラムの量によって違うので、辿れるものまで辿って計測する必要がある
    - [カラム追加で増えるActiveRecordのメモリサイズ イメージできますか? - Speaker Deck](https://speakerdeck.com/asayamakk/karamuzhui-jia-dezeng-eruactiverecordnomemorisaizu-imezidekimasuka?slide=10)
    - [だいありー](https://www.atdot.net/~ko1/diary/201212.html#d8)
    - 上記サンプルコードで試すと、`bigint, integer, date` なカラムを持つレコード1件で、約2KBだった
      - 各レコードのインスタンスが共通して参照している分を除くと約1KB
- find_each や in_batchesはクエリキャッシュが無効化されているので注意
- リードレプリカを使ってかつキャッシュも無効化する場合は、「リードレプリカに接続 →  キャッシュ無効化」の順で行う必要がある
  - キャッシュ無効化はプライマリー・リードレプリカごとに設定されるものなので、逆順だとプライマリーのキャッシュが無効化されてしまう
**例.rb**

```
ApplicationRecord.connected_to(role: リードレプリカ) do # まずリードレプリカに接続
    User.uncached do # 次にキャッシュ無効化
      # ここに処理を書く
    end
  end

```

- クエリがリードレプリカに接続されているか調べる方法 → クエリログに接続先を加えてあげる
  - [ruby on rails - Include the role of Active Record queries in logs - Stack Overflow](https://stackoverflow.com/questions/68539123/include-the-role-of-active-record-queries-in-logs)
```rb
# lib/extent_dblog.rb
ActiveRecord::ConnectionAdapters::AbstractAdapter.class_eval do
  alias_method(:origin_log, :log)
  def log(sql, name = 'SQL', binds = [], 
          type_casted_binds = [], statement_name = nil, &block)
    # prepend the current role before the log
    name = "[role: #{ActiveRecord::Base.current_role}] #{name}"
    origin_log(sql, name, binds, type_casted_binds, statement_name, &block)
  end
end


```

- (Railsでは)リクエストが終了するときに Rack middleware によってコネクションがpoolに戻されるので、たとえ一瞬で終わるクエリであってもリクエスト自体が長引くと、その間ずっとコネクションプールを占有してしまう
  - [trilogy を調査したら Active Record が抱える問題にまで辿り着いた - Money Forward Developers Blog](https://moneyforward-dev.jp/entry/2024/01/04/102733)
  - > 現状の Active Record は request 内で connection を獲得した場合、その request が終了するまで DB Connection を占有します。 これは
  - > with_connectionといった block を明示的に使わなくてもModel.findなどを呼び出せば自動的に connection を獲得してくれる
  - > Rack middleware によって connection が pool に戻されるので、ユーザーは connection 管理を意識する必要がない
  - > というメリットがある一方、DB Connection を占有する時間が長くなるというデメリットがあります。 つまり、query の所要時間が 1ms であっても、request の所要時間が 1s であれば、DB Connection は 1s 間占有されてしまいます。
- [ActiveRecordでの大量データとの付き合い方 / How to handle a lot of records with ActiveRecord - Speaker Deck](https://speakerdeck.com/yuji_developer/how-to-handle-a-lot-of-records-with-activerecord)
- find_eachとpreloadを組み合わせた場合でも、find_each内部で1000件ごとにpreloadしてくれるからN+1は起きない
  - find_eachというよりもpreloadの機能
  - preloadを付けると、そのクエリを取得するときに紐づいたテーブルのレコードも取得するようになるので、1000件取得時に一緒に取ってくれる
