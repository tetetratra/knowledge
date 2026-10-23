---
tags: "Fargate, ECS, AWS RDS, AWS Aurora, AMI, EBS, EFS, VPC, セキュリティグループ, ALB, DynamoDB, RDB, 水平分散, 垂直分散, 分散システム, Aurora, API Gateway, NATゲートウェイ, CloudWatch Evidently, ポリシーシミュレータ"
---

# AWSのハンズオンと運用メモ

- AWS公式のハンズオンをまとめているサイト
  - https://aws-samples.github.io/jp-contents-hub/
    - >Amazon Web Services(AWS) の 日本語ハンズオンやワークショップを、カテゴリごとにまとめています。
    - > 右側の目次や、ヘッダー部分の検索ボックスから、各コンテンツにたどり着けます。
  - [AWS ワークショップを探してみました！ | DevelopersIO](https://dev.classmethod.jp/articles/aws-workshops-20190909/)
- [A/BテストツールとしてCloudWatch Evidentlyを導入してみた - メドピア開発者ブログ](https://tech.medpeer.co.jp/entry/202310-clowdwatch-evidently)
  - CloudWatch Evidently
  - >AWS上でA/Bテストやフィーチャーフラグの管理ができるサービスです。
- Route Table
  - VPC (Virtual Private Cloud)に対してRoute Tableを定義して、Route Tableは複数のRouteを持つ
  - VPC**外**とのの通信経路を定義する
  - Route Table：ipに対して、どのSubnet/Internet Gateway/NAT Gateway/VPC Peeringにつなげるかを定義するもの
- [【2023/3時点】AWSの通信料(コスト)を一枚にまとめてみた \| いくらは神の食べ物](https://www.ikura-oisii.com/1065/)
  - ポリシーシミュレータ
    - AWS ポリシーシミュレータというものがあり、どのポリシーでどんなアクションが許可されているのかを調べやすい
    - (ログインしていれば) https://policysim.aws.amazon.com/home/index.jsp から使える
      - IAMの画面からも行けるらしい
  - たとえばECSにシェルでログインする権限があるか確認する手順
    - (色々調べたとして) 自分が持っているロールに紐づくポリシーが `ReadOnlyAccess` ポリシーであることを知る
    - ECS関連のアクションが載っているページを見て、`ecs:ExecuteCommand` アクションが求められることを知る
      - [Amazon Elastic Container Service のアクション、リソース、および条件キー - サービス認可リファレンス](https://docs.aws.amazon.com/ja_jp/service-authorization/latest/reference/list_amazonelasticcontainerservice.html)
      - > ExecuteCommand
        - > Amazon ECS コンテナでリモートでコマンドを実行するアクセス許可を付与します
    - IAMポリシーシミュレーターで、 `ReadOnlyAccess` ポリシーに `ecs:ExecuteCommand` アクションが含まれていないことを調べて、ECSにシェルでログインする権限を持っていないことがわかる
  - [AWSのAZ間レイテンシを測定してみた(2023年東京/大阪)](https://zenn.dev/tsumita7/articles/aws-mesuring-latency-among-az-2023#4.-%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7%E6%B8%AC%E5%AE%9A%E7%B5%90%E6%9E%9C)
    - 東京と大阪で、400μs(マイクロ秒)(= 0.001ミリ秒)くらいのレイテンシの違いがある
    - なにかの拍子にAZが変わったとき、1リクエストあたり内側でたとえば10000回の通信が発生している場合、10ミリ秒の遅延がおきうる
