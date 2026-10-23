---
tags: "AWS, Application Load Balancer, ALB, Network Load Balancer, NLB"
---

# AWS ALB

- AWS Application Load Balancer
  - 一気に大量のアクセスを流すと詰まるので、暖気運転する必要がある。
    - キャパシティユニットを予約する。
    - NLBの場合は不要。
      - [NLBはなぜ暖機運転が不要なのか 〜NLBの裏で動くサービスの解説〜 - NRIネットコムBlog](https://tech.nri-net.com/entry/why_does_nlb_not_require_warm_up)
