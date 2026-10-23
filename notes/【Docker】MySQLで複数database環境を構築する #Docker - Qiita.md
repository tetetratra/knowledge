---
tags: "Docker, MySQL"
---

# 【Docker】MySQLで複数database環境を構築する #Docker - Qiita

- [【Docker】MySQLで複数database環境を構築する  - Qiita](https://qiita.com/piggydev/items/2096258dc45a6bbe2a19)
- `/docker-entrypoint-initdb.d` というディレクトリにSQLを置くと、dockerイメージ起動時に実行してくれるので、ここで(2個目以降の)databaseを作る
