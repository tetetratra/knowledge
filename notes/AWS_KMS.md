---
tags: "AWS, KMS"
---

# AWS KMS

- 用語整理
  - KMS
    - AWS Key Management Service
    - マネージドサービス
    - 鍵に関する用語ではなくて、その管理サービスの用語
  - CMK
    - 鍵の種類を表す用語
    - Customer Managed Key
    - ユーザーが自分で作成・管理するキー
    - Terraformのaws_kms_keyで作成するのはこれ
  - AWS マネージドキー
    - 鍵の種類を表す用語
    - aws/s3, aws/rds のような名前で始まる
    - ユーザーのアカウント内に作成されるが、AWSによって管理される鍵
- たとえばログの暗号化の鍵としてAWS KMSを使ったりなど、用途は様々
