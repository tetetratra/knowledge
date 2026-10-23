---
tags: "非同期処理, sidekiq, gem, Ruby_on_Rails, ActiveRecord, ActiveJob, FOR UPDATE SKIP LOCKED"
---

# SolidQueue

- [SolidQueue解体新書 - メドピア開発者ブログ](https://tech.medpeer.co.jp/entry/solid_queue_kaitai_shinsho)
  - > データベースの比較的新しい機能である 「FOR UPDATE SKIP LOCKED」を活用することで高パフォーマンスを実現
  - 「FOR UPDATE SKIP LOCKED」 とは
    - > FOR UPDATEロック付きでSELECTをするが、すでにロックがかかっているレコードはスキップする（ロック待ちが発生しない）
