---
tags: "Ruby_on_Rails, Ruby_on_Rails_model, DB, データベース, ORM, SQL, ログ, activerecord-import, bulk_insert"
---

# Active Record

- ActiveRecordの更新系操作をするときは、モデルにhookがついていないかを注意する
- テスト中にSQLのログを見たいとき
  - `ActiveRecord::Base.logger = Logger.new(STDOUT)`
  - `less +F log/test.log` にも残っているからこっちを見たほうが楽かも
- `User`に`default_scope`がついていて(論理削除とか)、`belongs_to :user`なモデル`m`があったときの罠、
  - DB上では`m`は`user_id`を持っている
  - `m.user #=> nil` になってしまう罠がある
  - `m.update(...)`したときに、Userが無い旨のエラーが出てしまう
    - `m.update(..., user: user)`のようにわざわざ入れてあげれば抑制できる
    - `belongs_to :user, optional: true`のようにして、`presence`バリデーションで`user_id`をチェックする方法もある
    - `belongs_to :user, -> { User.unscoped }` のように、どのように紐付けるかを指定する方法もある
      - これが一番綺麗そう
- [週刊Railsウォッチ:（20220510前編）Active RecordにPromiseと非同期集計メソッドがマージ、climate_control gemほか｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=117612)
  - >Rails API: `load_async` — `ActiveRecord::Relation`
  - `async_count`や`async_average`のようなメソッドが使える
- [Active Recordともっと仲良くなって自然に優しいコードを書くぞ - SmartHR Tech Blog](https://tech.smarthr.jp/entry/2021/11/11/151444)
- `in_batches`
  - 時前で`each_slice`せずに`find_each`のバッチ版の処理を書ける
  - [Railsでin_batches使うととても遅い｜zochang](https://note.zochang.com/n/nf77b9e37ef46) 遅いらしい？
  - [in_batches では order できない！？ - インゲージ開発者ブログ](https://blog.ingage.jp/entry/2023/03/30/093000) ソートを指定できないらしい
  - 実装
    - https://github.com/rails/rails/blob/v7.0.4.3/activerecord/lib/active_record/relation/batches.rb#L204
- `in_batches`で実行されるクエリについて
  - [週刊Railsウォッチ: Active Modelのパターンマッチングがいったん取り消し、Ruby技術者認定試験が10月3日から3.xに対応ほか（20220719）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=119870)
  - 2022年ごろまでは`IN`句にidを渡すやり方だった
    - クエリが長くなってしまう問題があった
  - 今はidの大なり小なりを使う方式に変わっている
```rb
User.in_batches(of: 3) do |relation|
  puts relation.to_sql; nil
end; nil
```

```sql
-- 初回ループ
SELECT "users".* FROM "users" WHERE "users"."id" < 4 ORDER BY "users"."id" ASC LIMIT 3

-- 2週目
SELECT "users".* FROM "users" WHERE "users"."id" >= 4 AND "users"."id" < 7 ORDER BY "users"."id" ASC LIMIT 3

SELECT "users".* FROM "users" WHERE "users"."id" >= 7 AND "users"."id" < 10 ORDER BY "users"."id" ASC LIMIT 3

SELECT "users".* FROM "users" WHERE "users"."id" >= 10 AND "users"."id" < 13 ORDER BY "users"."id" ASC LIMIT 3

SELECT "users".* FROM "users" WHERE "users"."id" >= 13 ORDER BY "users"."id" ASC LIMIT 3

```

- activerecord-import でupdateするには
  - `on_duplicate_key_update: キーの配列` という引数を渡す
- **時間経過で次々に増えていくレコードをin_batchやfind_eachしないように注意！**
  - 実行すると無限に終わらなくなってしまう
  - STGとかでは(リアルタイムに新規レコードの追加は起きなくて)気付けないから本当に注意
- `where(created_at: Date.today)`のように、date型をdatetime型に渡してはいけない！
  - 型変換により`where created_at = '2020/01/01 00:00'`になってしまい、**0分0秒のレコードのみが対象になってしまう**
