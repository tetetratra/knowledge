---
tags: "データベース, マイグレーション, デプロイ, ORM, python, ActiveRecord"
---

# ORMが列名を並べてSELECTするとカラム追加のデプロイ順が縛られる

- SQLAlchemy は、テーブル定義（`Table`）を `select()` に渡すと、`SELECT *` ではなく、定義にあるカラムを1つずつ名前で並べた SELECT を作る（[SQLAlchemy 2.1 Documentation](https://docs.sqlalchemy.org/en/21/tutorial/data_select.html)）
  - そのため、コードのテーブル定義にカラムを足してから DB のマイグレーションが終わるまでの間は、DB にないカラムを SELECT することになり、そのテーブルの読み込みがすべて失敗する
  - 失敗するのは新しいカラムを使う機能だけではない。そのテーブルを読む処理すべてが巻き込まれる
- Rails の ActiveRecord は `SELECT "テーブル名".*` で読む（[Active Record Query Interface](https://guides.rubyonrails.org/active_record_querying.html)）
  - DB に先にカラムが増えても、読み込みは失敗しない
  - 逆に、カラムを消すときは、そのカラムを使わないコードを先に出す必要がある（`ignored_columns`）
- 列名を並べる作りのアプリケーションにカラムを足すときは、マイグレーションを終えてからアプリケーションを出す順序を、仕組みか手順で守る必要がある
