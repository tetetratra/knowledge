---
tags: "継続的インテグレーション, continuous_integration, CI改善"
---

# CI

- CIでできること
  - コミットされたらテストを回す
    - 回した結果を使ってgithubと連携したり
  - 特定のブランチ(masterとか)に更新があったら(マージされたら)デプロイをする
    - コードが内包されているDockerイメージを作って、それをpushして、escのコマンドとかを叩く
- [2分台で1500examples完走！爆速CIを支える環境構築術 - Kaigi on Rails 2025 - Speaker Deck](https://speakerdeck.com/falcon8823/2fen-tai-de1500exampleswan-zou-bao-su-ciwozhi-eruhuan-jing-gou-zhu-shu-kaigi-on-rails-2025?slide=29)
  - まとめ
    - RSpecを並列に実行すること
    - 均等に並列実行すること（大事）
    - tmpfsを使うこと
    - 物理マシンを使うこと（一番大事）
