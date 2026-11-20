---
tags: "AWS, Application Load Balancer, ALB, Network Load Balancer, NLB, TLS, HTTPS, セキュリティ"
---

# AWS_ALB

- AWS Application Load Balancer
  - 一気に大量のアクセスを流すと詰まるので、暖気運転する必要がある。
    - キャパシティユニットを予約する。
    - NLBの場合は不要。
      - [NLBはなぜ暖機運転が不要なのか 〜NLBの裏で動くサービスの解説〜 - NRIネットコムBlog](https://tech.nri-net.com/entry/why_does_nlb_not_require_warm_up)
  - HTTPSリスナーのセキュリティポリシー（SSLポリシー）は、受け付けるTLSのバージョンと暗号スイートの組
    - AWSが用意したポリシーから選ぶ。効くのはクライアントとALBの間だけ
    - 指定を省くと、CLI・CloudFormation・CDKでは `ELBSecurityPolicy-2016-08` になり、TLS 1.0と1.1も受け付け、TLS 1.3には対応しない
    - [Security policies for your Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/describe-ssl-policies.html)
