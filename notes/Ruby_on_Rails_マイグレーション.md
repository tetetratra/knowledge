---
tags: "Ruby_on_Rails, マイグレーション, migration, Ruby_on_Rails_model, データベース, DB, Active_Job, ActiveRecord::Migration, DBのマイグレーション履歴と今のブランチのマイグレーションファイルが食い違うとき, 外部キー制約, strong_migrations, インフラ設計, レプリケーション"
---

# Ruby_on_Rails_マイグレーション

- ActiveRecord::Migration
  - [【Ruby on Rails】マイグレーションに関する主なコマンド一覧 - TKGBlog](https://wild-outdoorlife.com/ruby-on-rails/db-migrate/)
    - `db:create`
    - `db:setup`
    - `db:drop`
    - `db:reset`
    - `db:migrate:reset`
    - `db:reset`
    - `db:migrate:reset`
    - `db:migrate`
    - `db:rollback`
    - `db:migrate:redo`
    - `db:version`
    - `db:migrate:status`
  - Refactoring Databases
    - データベースのリファクタリングについて体系的にまとめている書籍
  - マイグレーション時、外部キーのidと、紐付け先の親のidの型が違うとエラーになる
    - rails5.0まではintegerだけど、5.1からはbigintだから
    - 普通にカラムを追加して解決するのがよさそう
    - https://qiita.com/Jwataru/items/7b840be38d4279224245
    - https://qiita.com/umeneri/items/b46c537661f612f7318b
  - `NOT NULL`をしたいor外したいだけのとき
    - [change_column_null (ActiveRecord::ConnectionAdapters::SchemaStatements) - APIdock](https://apidock.com/rails/ActiveRecord/ConnectionAdapters/SchemaStatements/change_column_null)
  - DBのマイグレーション履歴と今のブランチのマイグレーションファイルが食い違うとき
  - DB操作のrakeタスクメモ
    - `db:reset` DBを消してSchema通りに初期化?
    - `db:drop` 消す
    - `db:create` 作るだけ
  - indexの名前が長いとき
    - `add_index`に`name: "index名"`を渡す
    - `t.references`の場合は、`index: { name: "index名" }`のようにする
  - 既に値が入っているテーブルに、**後から外部キーを追加**したいとき
    - `Cannot add or update a child row: a foreign key constraint fails`
  - [サービスを停止せずにデータベースリファクタリングする - Pepabo Tech Portal](https://tech.pepabo.com/2022/07/21/online-database-refactoring/)
    - 事例1: あるテーブルに外部キー制約を持つ新たなカラムを追加し、古いカラムの利用をやめる
    - 事例2: あるテーブルのカラムの名前は変えずに型を文字列から整数に変更する
  - 使わなくなったカラムを物理的に消す以外に、論理的にrailsで使われなくする方法
    - モデルで `ignored_columns=` メソッドを使う
    - [ActiveRecord::ModelSchema::ClassMethods](https://api.rubyonrails.org/classes/ActiveRecord/ModelSchema/ClassMethods.html#method-i-ignored_columns-3D)
  - 複数カラムへのマイグレーションの際は`bulk: true`を指定する
    - `change_table`のオプション
  - [外部キー制約が一切ないと何に困るのか？](https://zenn.dev/praha/articles/2667cbb1ab7233)
    - >外部キー制約がなくてもそれほど困らない理由
    - 外部キー制約のオプション
      - `on delete cascade` -> Parentを削除すると紐づくChildも一緒に削除する
        - >「これは怖すぎる。採用するケースほぼないよね」
      - `on delete set null` -> Parentを削除するとChildのparent_idをNULLにして関連を破棄する
        - >「外部キーが設定されていないのとほぼ同じ状況じゃね？」
      - `on delete no action` -> Parentを削除しようとした時、そのParentを参照しているChildがあれば、削除に失敗する
        - >「どのみちDBの削除に関する知見はアプリケーションが知っておく必要が生じるよね」
    - 外部キー制約
      - あり
        - →不整合が起きなくなる
      - なし
        - →野良のレコードを非同期に消すことができる
        - →開発難度が上がってしまう場合
    - 機能が提供されているからといって、それを全て使うのがベストとは限らない
  - 関連付けと外部キー制約
    - `add_reference`は「関連付け」
      - rails上で関連付けを設定
      - これはしたほうがいい
      - https://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/SchemaStatements.html#method-i-add_reference
    - `add_foreign_key`は「外部キー制約」
      - DB上の制約を設定
      - こっちは、外部キー制約は枷になることも多いから、本当に必要かどうかは要判断
      - `add_reference`するときの`foreign_key:`オプションで設定することもできる
        - デフォルトは`foreign_key: false`
  - `remove_index`の後に`add_index`を書くと、`remove_index`完了後から`add_index`完了前までの間、インデックスが貼られていない期間が発生し、スロークエリになってしまうことがある
    - `bulk: true`をすればaddとremove同時にできて解決する.... かもしれない
      - rubocopにはそういうルールがある
        - https://www.rubydoc.info/gems/rubocop/0.61.1/RuboCop/Cop/Rails/BulkChangeTable
  - DBのCPUがヤバくなったときは、再起動する前に、プロセスを確認してどのクエリで重くなっているかを確認する
  - `change`でうまく動かないため`up, down`を書く必要があるときは、逆順に逆の操作を書けばうまくいく
    - `change`でうまく動かない例：カラムとインデックスを同時に操作しようとしたとき
      - 「インデックス削除→カラム削除」したら「カラム追加→インデックス追加」の順で元に戻す必要がある
```rb
up
A: add_index
B: remove_index
C: remove_column

down
C: add_column
B: add_index
A: remove_index

```

- strong_migrationsというgemで危険なマイグレーションを検知できる
  - [ankane/strong_migrations: Catch unsafe migrations in development](https://github.com/ankane/strong_migrations)
- (一般的に) マイグレーションが入ったPRがどのように各環境のDBに反映されるか
  - GitHub ActionsとかのCIで、AWSコマンドなどを叩いて、マイグレーションのクエリを発行する用のコンテナ(タスク)を1個立ち上げて、そのコンテナ内で`rails db:migrate`のようなコマンドを叩いている
  - QA環境ごとにDBを作る場合は、DB名を`db名_(qa環境名)`のようにし、QA環境全部で1個のDBで済むようにする
  - リードレプリカに関して
    - レプリカのプライマリーからの複製(レプリケーション)はDB側の仕組みで行われているため、特にどのDB宛かは来にせずにマイグレーションのクエリを叩いてOK
- カラム削除のマイグレーションの前に `ignored_columns` のリリースをすべし
  - [ActiveRecordモデルのカラムを消すときにignored_columnsが必要な理由 - Progate Tech Blog](https://tech.prog-8.com/entry/2020/12/08/093310)
    - アプリケーション側でそのカラムを今使っていないからテーブルからも消してOK .... ではない！
    - 暗黙的にそのカラムが使われている箇所が存在しうる
      - railsがSELECT句を作るとき、`SELECT *`ではなく`SELECT カラム1, カラム2, ...`のように列挙してクエリを発行する場合がある
      - このとき、カラム名情報はメモリ内のキャッシュから取っている
      - 「マイグレーション完了 → アプリケーションのコンテナ入れ替え完了」の順でデプロイされる場合(一般的な順序)、「新DB & 旧アプリ」の組み合わせでバグる (というかエラーを吐く)
        - `Mysql2::Error: Unknown column 'books.author_name' in 'field list'`みたいなエラー
    - なので、その前に使われなくなったカラムを`ignored_columns`する必要がある！
      - まず、`ignored_columns`を指定するリリースを行う
      - 次に、カラムを消すマイグレーションを入れたリリースを行う
