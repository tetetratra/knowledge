---
tags: "DB, SQL, sqlap, スロークエリ, 複合インデックス, SELECT文の評価順序, ronsakucasual, 集計関数, リレーショナル代数, IDEF1X, 楽々ERDレッスン, SQL実践入門, 絵で見てわかるSQL Serverの仕組み, 達人が教えるWebパフォーマンスチューニング 〜ISUCONから学ぶ高速化の実践, SQLパフォーマンス詳解, NLJ, Nested Look Join, 複合主キー, タプル比較, Local Write Forwarding, LWF, ダークローンチ, LayerXテックアドカレ, MDL, SHOW PROCESSLIST"
---

# MySQLのSQL操作とクエリ改善メモ

- auto_incrementを1にする
  - `alter table table_name auto_increment = 1`
- コマンドからsql発行
  - `mysql uroot db_name e'select * from tablename'`
- レコードを曜日順に並べるSQL
  - `SELECT * FROM table ORDER BY FIELD(day, ‘月’, ‘火’, ‘水’, ‘木’, ‘金’, ‘土’, ‘日’)`
- クエリの実行結果に改めてIDを付与する
  - `set @num=0; SELECT @num:=@num+1 as id, name FROM table GROUP BY name`
- テーブルの全カラムを見るSQL
  - `SHOW COLUMNS FROM table_name;`
- mysql見やすい表示コマンド
  - `pager less n i S`
  - n 行数計算をせずに高速化。
  - i 検索時に大文字・小文字の区別をしない。
  - S 折り返ししない。
- selectしたものに1からid振る
  - `SET @new_id = 0;SELECT (@new_id := @new_id + 1) AS new_id from hoge;`
- レコードをランダムに取得
  - `ORDER BY rand() LIMIT 20`
- partitionとは
  - レコードの保存場所をメモリの場所的にいい感じに分けることで削除とかが早くなる仕組み？
- `gruop by hoge with rollup`で合計列も出せる
- [3分で読めるSQLアンチパターンまとめ  - 等身大から1割増し](https://alek3.hatenablog.com/entry/2017/10/28/230220)
- alter文とかを大きなテーブルに流すときは、纏めて書いたほうが良い
**union_alter.sql**

```
ALTER TABLE `table` ADD COLUMN `column1` decimal(11,2) NOT NULL DEFAULT `0`,ADD COLUMN `column2` varchar(255) NOT NULL DEFAULT 'neko';
```

- all columnするときは、どのカラムの後に入れるか書いたほうが良い
**locate_alter.sql**

```
ALTER TABLE テーブル名 ADD 新規カラム名 型情報 AFTER 既存カラム名;
```

- 検証用のレコードを移したい時、sshでsqldumpして圧縮してローカルにおく、みたいなのがある
- 小数を扱うときは、`DECIMAL型`
- ユーザーごとに、どのホストからログインできるか制限をかけれる
  - [ユーザーを作成する(CREATE USER文) | MySQLの使い方](https://www.dbonline.jp/mysql/user/index1.html)
- `~/.my.cnf`や、`/usr/local/etc/my.cnf`に、mysqlの設定を書ける
  - クエリキャッシュや、フルテキストサーチとかの設定はここに書く
- mysqlのバージョン確認には `SELECT VERSION();`
  - mariaDBの場合は、`10.4.12-MariaDB-log`みたく表示される
- `SELECT @@GLOBAL.sql_mode;`で、sql_modeを確認できる
  - sql_modeとは、、mysqlの動作を指定するもの
  - my.cnfで変更できる
- 大きなテーブルをバッチ処理するとき
  - 一括で更新すると重い
  - なので、limitとwhereを使う
  - 全く同じSQLを回すだけでバッチ処理ができる
- sequelproで、ローカルPC => 処理サーバー => DBサーバー とアクセスする
  - 処理サーバーにはローカルからsshで入れる
  - 処理サーバーからDBサーバーには入れる
  - 設定項目
**main.txt**

```
MySQLhost: DBサーバーのプライベートIPアドレス
UserName: 決められているのを入れる
PassWord: 決められているのを入れる
DBname:  決められているのを入れる
Port:   デフォルト3306
SSHhost:  処理サーバーのグローバルIPアドレス
SSHuser:  処理サーバーのログイン用ユーザー名
SSHkey:  処理サーバーのssh用`秘密`鍵(公開鍵が処理サーバーに登録されている)
SSHport:  22か、独自のポートか。
```

- countやgroup_byの高速化のために、予め計算結果を格納しておく手法はアリ
  - 集計テーブルという
  - [テーブルを設計する上で考えておくと助かること - Qiita](https://qiita.com/Syn256/items/365438b1c25b09869383)
  - [DB論理設計のノウハウ - Qiita](https://qiita.com/kiyodori/items/5083ad8bbfc232d01827)
- カーディナリティとは
  - テーブルのあるカラムに何種類の値が入っているか。多いとindexが効きやすい
- 遅いときは
  - [MySQL スロークエリ改善 初心者向け - Qiita](https://qiita.com/SuguruOoki/items/5c4c04a120d9fa5b4267)
  - スロークエリのログを見る
    - 設定でONにしないとログ残らないので注意
    - 場所は、`SHOW GLOBAL VARIABLES like "%slow_query_log%";`で検索
    - その前にwebサーバーへのアクセスログを見るといいかも
      - nginxなら`less /var/log/nginx/access.log`とか
  - `show processlist`でプロセスを見る
  - `explain クエリー`でクエリを分析
    - indexや複合インデックス見たり。
    - クエリキャッシュでたまたま2回目以降早くなって混乱する、みたいなミスに注意
- EXPLAIN
  - extra列に改善のヒントが書かれている
    - [MySQL :: MySQL 5.6 リファレンスマニュアル :: 8.8.2 EXPLAIN 出力フォーマット](https://dev.mysql.com/doc/refman/5.6/ja/explain-output.html#explain-extra-information)
- `GROUP BY`と`ORDER BY`の両方にインデックスを付けたいけれど、指定するカラムが違うとき
  - → 複合インデックス をつかう?
- 使われるインデックスは1テーブルにつき1つ!
- クエリ改善
  - [ヤフー社内でやってるMySQLチューニングセミナー大公開](https://www.slideshare.net/techblogyahoo/mysql-58540246)
- SELECT文の評価順序
  - [SELECT文の評価順序の話 - Qiita](https://qiita.com/suzukito/items/edcd00e680186f2930a8)
    - 他にも色々知りたかったことが書かれていた
  - この順. (複合インデックス貼るときはこの順に!)
    - FROM
    - ON
    - JOIN
    - WHERE
    - GROUP BY
    - HAVING
    - SELECT
    - DISTINCT
    - ORDER BY
    - TOP（LIMIT）
- order by, group byは全部テーブル見る必要がありそうだけど、、index貼ってあれば全部テーブルみないでも大丈夫になる
  - [ORDER BYとGROUP BYがSQLのパフォーマンスに与える影響](https://use-the-index-luke.com/ja/sql/sorting-grouping)
  - [GROUP BYに対するインデックス](https://use-the-index-luke.com/ja/sql/sorting-grouping/indexed-group-by)
  - パイプライン処理ができる(できたものから次にわたすような処理)
- JOINした結果でWHEREをしたいけれども、取るレコードは結合前のテーブルがほしい時 => EXISTS句
  - `WHERE EXISTS (サブクエリ) `のように書ける
- DBの論理削除について
  - [ DBの論理削除についてひたすら共有する 論理削除 Casual Talks  にいってきたまとめ - もぐめぽろぐ](https://blog.mogmet.com/ronsakucasual-1/)
- `show processlist`は、ログインしたユーザーで流したクエリしか見れないことに注意
  - rootでログインすれば全部見れる
- `coalesce`関数
  - 最初に見つかったNULLじゃない値を返す
- JOIN => GROUP BY でまとめられた子レコードの値を結合する集計関数`group_concat`
- JOINしてGROUP BYしたものをUPDATE
  - [yoko_net　Blog : 結合したSELECT結果でUPDATEするTips（for MySQL）](http://blog.livedoor.jp/yoko_net/archives/51815648.html)
  - まずUPDATE句の後に、「更新したいテーブル」と「更新に使う,GROUP BYとかしたサブクエリテーブル」を指定する
  - SET句でセット
    - `SET 更新したいテーブル.カラム名 = サブクエリテーブル.カラム名`
  - 最後WHEREで、2つのテーブルを紐付け
- GROUP BYして紐付けた子のうち、特定条件のもののみを集計関数にかける
  - `SUM(CASE WHEN created_at BETWEEN '2020-10-10' AND '2020-11-10' THEN price ELSE 0 END)`
- JOINの順序を制御するには、`STRAIGHT_JOIN`
  - 普通のJOINだと、テーブルが外側になるか内側になるかはオプティマイザ任せ。`STRAIGHT_JOIN`だと書いた順になる。
  - [MySQLでSTRAIGHT_JOINを使用する場合|Codeflow](https://qa.codeflow.site/questions/512294/when-to-use-straight-join-with-mysql)
- フルテキスト検索
  - mysqlのconfigを変える必要あり
  - `add fulltext(text_ngram);`
- [mysqlのクライアントmycliが便利だった。 - Qiita](https://qiita.com/connvoi_tyou/items/9f734a738f09522b455e)
