---
tags: "Ruby on Rails, パフォーマンス, スケーリング, Puma, GVL, アムダールの法則, リトルの法則"
---

# Rails Active Recordのコネクションプール設定

- [Railsスケーリング（4）: Active Recordコネクションプールの適切な設定を理解する（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=151486)
  - Active Recordにおけるコネクションプールの実装
    - スレッドでコネクションが必要になると、スレッドはプールからコネクションをチェックアウト（=借り出し）し、データベース操作を実行したら、コネクションをプールに返却する
    - Reaperという機能があり、定期的にプール内のコネクションをチェックして、デッドコネクションや、長時間チェックアウトされたままのアイドリングコネクションを削除している
      - <https://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/ConnectionPool/Reaper.html>
        - DBコネクションにおけるGCのようなもの
  - 最大コネクション数の設定
    - Pumaの場合
      - それぞれのプロセスがそれぞれのコネクションプールを持つ
      - 最大で、スレッドの個数(`max_threads`)と同じ数だけのコネクションが必要
    - Sidekiqの場合
      - 最大で、スレッドの個数(`concurrency`)と同じ数だけのコネクションが必要
    - Rails全体
      - Webコネクション数 = Webのdyno数 ✕ Pumaプロセス数 ✕ max_thread値
      - バックグラウンドコネクション数 = ワーカーのdyno数 ✕ Sidekiqプロセス数 ✕ プロセスあたりのスレッド数
      - 最大コネクション数 = Webコネクション数 + バックグラウンドコネクション数
      - DBは↑の最大コネクション数に耐えるように設定する必要がある
        - デプロイ戦略によってはさらに2倍必要
