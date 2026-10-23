---
tags: "データベース, DB, SQL, DEFINER, SQL SECURITY"
---

# MySQL

- [MySQL道普請便り 記事一覧 \| gihyo.jp](https://gihyo.jp/list/group/MySQL%E9%81%93%E6%99%AE%E8%AB%8B%E4%BE%BF%E3%82%8A#rt:/dev/serial/01/mysql-road-construction-news/0030)
  - DEFINER属性とSQL SECURITY属性
    - [第201回　MySQLのDEFINERについて | gihyo.jp](https://gihyo.jp/article/2023/07/mysql-rcn0201)
      - TRIGGERやVIEWなどのストアドオブジェクトが持つ属性
      - DEFINER
        - オブジェクトを作成したアカウントを示すための設定値
        - 設定できる値は「アカウント」(例: `admin_user@localhost`)
        - デフォルト値では`CURRENT_USER`
      - SQL SECURITY
        - 誰の権限を使うかの設定値
        - 設定できる値は`DEFINER`か`INVOKER`
          - `DEFINER`：DEFINER に指定されたユーザーの権限で実行される
          - `INVOKER`：実行したユーザーの権限で実行される
        - デフォルト値では`DEFINER`
    - 例
      - mariadbには mariadb.sysユーザーという内部的なユーザーがある
      - mysql.user ビューは、mysql.global_priv テーブルを参照しているビュー
      - mariadb(やmysql)のビューには、DEFINERという属性があり (値にはアカウント名が入る) 、「このviewが実行可否を判断するときにどのアカウントの権限を参照するか」が書いてある
      - mysql.user ビューの DEFINER 属性値には mariadb.sys ユーザーが指定されているので、mysql.user ビューを見るときは mariadb.sys ユーザーの権限で mysql.global_priv テーブルが参照される
      - → なので、たとえば何かが壊れてmariadb.sys ユーザーがmysql.global_priv テーブルに対するSELECT 権限を持っていないと、見れない
