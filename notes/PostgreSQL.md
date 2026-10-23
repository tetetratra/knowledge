---
tags: "SQL, データベース, DB, DBMS"
---

# PostgreSQL

- [postgres - Official Image | Docker Hub](https://hub.docker.com/_/postgres)
  - `$ docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres`
  - >The default `postgres` user and database are created in the entrypoint with `initdb`.
    - `postgres`という名前で、(Linuxの)ユーザーと、(PostgreSQLの)ユーザーが、すでに作られている
    - そのままbashで入って`postgres`コマンドを打つと、`"root" execution of the PostgreSQL server is not permitted.`と出る
- 起動
  - `docker run --rm -e POSTGRES_PASSWORD=postgres -p 5432:5432 -i -t -d postgres`
    - デーモンを起動
      - `-i -t`オプションはいらなかったかも
  - `psql -h localhost -U postgres -d postgres`
    - psqlはPostgreSQLのフロントエンド
      - デフォルトで`5432`ポートを見に行く(ので、Dockerコマンドでは`-p 5432:5432`で繋げている)
    - `-U`は`postgres`
    - `-d`はDBの指定
- (PostgreSQLの)ユーザー作成
```sql
postgres=# postgres=# create user test_user with SUPERUSER PASSWORD 'test_user';
CREATE ROLE
postgres=# SELECT usename FROM pg_user;
  usename
-----------
 postgres
 test_user
(2 rows)
```

- パスワードを設定しないとログインできないかも？
- 上記で作ったユーザで、`psql -h localhost -U test_user -d postgres`でログインできる
- データベース作成
```sql
postgres=# create database test_db owner=test_user;
CREATE DATABASE
postgres=# \l -- データベースを一覧表示するコマンド
                                 List of databases
   Name    |   Owner   | Encoding |  Collate   |   Ctype    |   Access privileges
-----------+-----------+----------+------------+------------+-----------------------
 postgres  | postgres  | UTF8     | en_US.utf8 | en_US.utf8 |
 template0 | postgres  | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |           |          |            |            | postgres=CTc/postgres
 template1 | postgres  | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |           |          |            |            | postgres=CTc/postgres
 test_db   | test_user | UTF8     | en_US.utf8 | en_US.utf8 |
(4 rows)

```

- (Dockerにおける)データの永続化
  - [DockerでPostgreSQLを使う - Qiita](https://qiita.com/zaburo/items/7ab51a7a4d9e1b2d1ec4#%E5%BF%9C%E7%94%A8%EF%BC%91%E5%88%9D%E6%9C%9F%E3%83%87%E3%83%BC%E3%82%BF%E8%A8%AD%E5%AE%9A%E3%81%8A%E3%82%88%E3%81%B3%E6%B0%B8%E7%B6%9A%E5%8C%96)
  - https://hub.docker.com/_/postgres#:~:text=and%20POSTGRES_DB.-,Initialization%20scripts,-If%20you%20would
```sh
$ mkdir init
$ mkdir data
$ docker run --rm -e POSTGRES_PASSWORD=postgres -p 5432:5432 -i -t -d \
  -v $(pwd)/init:/docker-entrypoint-initdb.d \
  -v $(pwd)/data:/var/lib/postgresql/data \
  postgres
```

- `$(pwd)/init/init.sql`に、初期化時に実行したいSQLを書くみたいだけれども、
  - >Warning: scripts in `/docker-entrypoint-initdb.d` are only **run if** you start the container **with a data directory that is empty**;
  - とあるから、ログインしてテーブルを作るのであればinitの方のマウントは要らないかも
