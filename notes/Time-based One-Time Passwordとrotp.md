---
tags: "Time-based One-Time Password, Ruby on Rails, rotp, devise, 二要素認証"
---

# Time-based One-Time Passwordとrotp

- Carely Tech Zine No.1（出典: https://dev.icare.jpn.com/dev_cat/carely-tech-zine-no-1/）
- Time-based One-Time Passwordの仕組みを提供するGem「rotp」の実装を追ってみた
  - > Ruby On Rails で認証機能を実装する場合、deviseというGemを用いるケースが多いと思いますが、deviseには、devise-two-factorという2要素認証を提供するGemも開発されています。このGemは、内部では「rotp」というGemに依存していて、2要素認証を行うAPIを提供しています。今回は、2要素認証をどのようにして実現しているのか、rotp Gemの内部実装を追って、仕組みの理解を試みたいと思います。
