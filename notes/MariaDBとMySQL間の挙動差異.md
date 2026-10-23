---
tags: "MariaDB, MySQL, データベース, ONLY_FULL_GROUP_BY"
---

# MariaDBとMySQL間の挙動差異

- DB移行するときなどの参考に。
  - `ONLY_FULL_GROUP_BY=ON` の場合、DBエンジンによって許容されるクエリが異なる
    - `DISTINCT` + `ORDER BY`（SELECT句に含まれないカラム）
      - MariaDB: OK
        - `ORDER BY`のカラムが`SELECT`に含まれていなくても許容される
      - MySQL 8.0: エラー
        - `ORDER BY`のカラムが`SELECT`に含まれている必要がある
    - `GROUP BY 主キー` + `SELECT 他カラム`
      - MariaDB: エラー
        - 主キーによる関数従属を認識しないため、`SELECT`の全カラムが`GROUP BY`に含まれている必要がある
      - MySQL 8.0: OK
        - 主キーによる関数従属を認識するため、`GROUP BY id` で同テーブルの他カラムを`SELECT`可能
```sql
-- パターン1: DISTINCT + ORDER BY（SELECT句に含まれないカラム）
SELECT DISTINCT users.id, users.name
FROM users
JOIN orders ON orders.user_id = users.id
ORDER BY orders.created_at DESC;
-- MariaDB (ONLY_FULL_GROUP_BY=ON): OK
-- MySQL 8.0 (ONLY_FULL_GROUP_BY=ON): エラー

```

```sql
-- パターン2: GROUP BY 主キー + SELECT 他カラム
SELECT users.id, users.name, users.email, MAX(orders.created_at) AS last_order_at
FROM users
JOIN orders ON orders.user_id = users.id
GROUP BY users.id
ORDER BY last_order_at DESC;
-- MariaDB (ONLY_FULL_GROUP_BY=ON): エラー（name, emailがGROUP BYに含まれていない）
-- MySQL 8.0 (ONLY_FULL_GROUP_BY=ON): OK（主キーによる関数従属を認識） 
```

- ↑関連で過去あったエラー
 (元々mariadbで、ONLY_FULL_GROUP_BY=OFFだった)開発環境を、MySQ8L（ONLY_FULL_GROUP_BY=ON）に変えたとき、開発環境(CI)上でエラーになった
 ので、クエリを直し、通った。元環境(mariadb)でもCIは通ってた
 のでデプロイした。が、本番でエラーになった
 開発環境ではONLY_FULL_GROUP_BY=OFFだったが、本番DBはONLY_FULL_GROUP_BY=ONだったのが理由
 (MariaDBとMySQL間にONLY_FULL_GROUP_BYの挙動差異があるのが技術的には根本な原因)
 (開発(CI)環境と本番環境に差異があるのが表面的(開発チームとしての)原因)
