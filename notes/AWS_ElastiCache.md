---
tags: "AWS, ElastiCache, Redis"
---

# AWS_ElastiCache

- [Amazon ElastiCache for Redisのメジャーアップグレード方法をまとめてみた \| DevelopersIO](https://dev.classmethod.jp/articles/perform-amazon-elasticache-redis-major-upgrade/)
- [Redis (クラスターモード無効) レプリケーショングループのリードレプリカのプライマリへの昇格 - Amazon ElastiCache for Redis](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/Replication.PromoteReplica.html)
- [タップルにおける約4年越しのキャッシュストア大幅アップデート \| CyberAgent Developers Blog](https://developers.cyberagent.co.jp/blog/archives/33371/)
- ElastiCacheのメトリクスの読み方
  - [Valkey と Redis OSS のメトリクス - Amazon ElastiCache](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/dg/CacheMetrics.Redis.html)
    - CPU: スロットリングしていないか
    - Memory: メモリ枯渇していないか/スワップ利用していないか
    - ReclaimedKeys/Evictions: キーの追い出しまたはキー削除が発生し、セッションキー削除によるログアウトが発生していないか
    - Connection: コネクション過多になっていないか
    - Replication: レプリカラグが増えていないか
    - Command Count: 変に増えていないか
