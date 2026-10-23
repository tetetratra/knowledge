---
tags: "AWS, Athena, S3, SQL, AWS Glue Data Catalog, パーティション"
---

# AWS Athena

- 「アテナ」
  - S3に対してSQLで検索できる。
  - S3はNoSQLというかオブジェクトデータベースなので、それをRDBに変換する必要がある。
    - Athena DDL (data definition lanuage)という言語で変換する。
      - この言語周りはAWS Glue Data Catalogで管理する。
  - Athenaで、変換したRDSに対してSQLを発行する。
  - 0.005 USD/GB = 0.7円/GB
  - 料金
    - 触ったデータ量はパーティションによって変わる。
      - パーティション化されているカラムで絞り込んだときのみ料金が安くなる。
