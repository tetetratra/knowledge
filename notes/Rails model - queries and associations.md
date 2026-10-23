---
tags: "Ruby_on_Rails, マイグレーション, Ruby_on_Rails_マイグレーション, scope, bulk_insert, bulk, JSON型, SQL, Ruby_on_Rails_test"
---

# Rails model: クエリと関連付けの使い分け

- selectの使い所
- selectを使わないと、`SELECT *`になる

- 引数なしの`find_each`は`Enumerator`が返る
- https://api.rubyonrails.org/classes/ActiveRecord/Batches.html#method-i-find_each
  - > If you do not provide a block to find_each, it will return an Enumerator for chaining with other methods:


- [ActiveRecordを単体で使ってる場合のタイムゾーンの設定 - tyn-iMarketの技術メモ](https://tyn-imarket.hatenadiary.org/entry/20131027/1382897686)

- [RailsでArel、早見表 - Qiita](https://qiita.com/k-fujino/items/09f8baf790abd49308f4)

- `sanitize_sql_array`
- SQLインジェクション対策用のクエリを文字列として作れる
- `ActiveRecord::Base.sanitize_sql_array(['where id = ?', 1])`
- [ActiveRecordのSanitization　初心者→中級者へのSTEP19/25 - Qiita](https://qiita.com/kamohicokamo/items/6933e90237935c011efb)
  ```ruby
  .joins(sanitize_sql_array([<<~EOS, var]))
  JOIN table_name
  ON table_name.col = ?
  EOS
  ```

- `reload`でモデルの再取得ができる
- `lock`でロックできる

- `references`でLEFT OUTER JOIN
- [似ているようで全然違う!?Activerecordにおけるincludesとjoinsの振る舞いまとめ - Qiita](https://qiita.com/south37/items/b2c81932756d2cd84d7d)

- テーブル`a`から`c`を、`a.b_id = c.b_id`でつなぐ
- [ActiveRecord::Associations::ClassMethods](https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-has_one)
- [Active Record の関連付け - Railsガイド](https://railsguides.jp/association_basics.html#belongs-to%E3%81%AE%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3-foreign-key)
- `a`のモデル定義の`has_one`に、`foreign_key: :b_id`と`primary_key: :b_id`を指定する
- `foreign_key`
  - >Specify the foreign key used for the association. By default this is guessed to be the name of this class in lower-case and “_id” suffixed. So a Person class that makes a `has_one` association will use “person_id” as the default `:foreign_key`.
  - > If you are going to modify the association (rather than just read from it), then it is a good idea to set the `:inverse_of` option.

  - >Railsの慣例では、相手のモデルを指す外部キーを保持しているjoinテーブル上のカラム名については、そのモデル名にサフィックス`_id`を追加した関連付け名が使われることを前提とします。`:foreign_key`オプションを使えば、外部キーの名前を直接指定できます。
  - `c.b_id`の部分の指定
- `primary_key`
  - >Specify the method that returns the primary key used for the association. By default this is `id`.

  - >Railsの慣例では、`id`カラムはそのテーブルの主キーとして使われます。`:primary_key`オプションを指定すると、指定された別のカラムを主キーとして設定できます
  - `a.b_id`の部分の指定
