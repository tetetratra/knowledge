---
tags: "AWS, IAM, IAMユーザー, IAMグループ, IAMロール, IAMポリシー, **許可・禁止を設定するのはココ**, Assume Role"
---

# AWS IAM

- Identity and Access Management
  - IAMユーザー
    - IAMユーザーに対して権限を付与するのはよくない。IAMロールに対して付与しよう。
  - IAMグループ
  - IAMロール
    - ユーザー側が作れるものと、AWS側で提供しているものがある
      - 提供例：`AWSS3ReadOnlyAccess`
    - 「ECS 実行ロール」など
  - IAMポリシー
    - ユーザー側が作れるものと、AWS側で提供しているものがある
      - 提供例：`AmazonS3ReadOnlyAccess`
    - **許可・禁止を設定するのはココ**
    - IAMユーザー、IAMグループ、IAMロールにアタッチして使う
    - アクセス**する側**の権限設定
    - リソース側の権限設定というのもある
      - IAMポリシーとは別
      - S3バケットポリシーなど
      - こっちはアクセス**される側**の権限設定
    - 何を書くか
      - Effect：許可/禁止
      - Action：操作
      - Resource：対象
      - Condition：適用する条件など
**それぞれの関係.mermaid**

```
graph LR
user[IAM User]
group[IAM Group]
role[IAM Role]
policy[IAM Policy]
group ---|1..*| user
group ---|1..*| policy
user ---|1..*| policy
role ---|1..*| policy

```

- どんなresourceやactionがあるのか?
  - https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access.html の一番下にあるリンク集から辿れそう
    - S3：[Writing IAM Policies: How to Grant Access to an Amazon S3 Bucket \| AWS Security Blog](https://aws.amazon.com/jp/blogs/security/writing-iam-policies-how-to-grant-access-to-an-amazon-s3-bucket/)
    - RDS：[A Primer on RDS Resource-Level Permissions \| AWS Security Blog](https://aws.amazon.com/jp/blogs/security/a-primer-on-rds-resource-level-permissions/)
    - EC2：[Demystifying EC2 Resource-Level Permissions \| AWS Security Blog](https://aws.amazon.com/jp/blogs/security/demystifying-ec2-resource-level-permissions/)
- Assume Role
  - 他のロールの権限を引き受けた状態にする機能
- [GitHub ActionsからECSとECRへのCI/CDを最小権限で実行したい | DevelopersIO](https://dev.classmethod.jp/articles/github-actions-ecs-ecr-minimum-iam-policy/)
  - 最小限の権限を探るときの雰囲気をつかめる
