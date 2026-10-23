---
tags: "DB, マイグレーション, MySQL, gh-ost, pt-online-schema-change, pt-osc, Aurora, binlog"
---

# gh-ost

- MySQL用
- https://github.com/github/gh-ost
  - 対抗：pt-online-schema-change
    - pt-oscと書かれることも
    - https://docs.percona.com/percona-toolkit/pt-online-schema-change.html
  - [AWS Aurora MySQL v3 アップグレード時のgh-ostの活躍について - BASEプロダクトチームブログ](https://devblog.thebase.in/entry/2024/10/25/141315)
  - [29億行のMySQL 8.4 テーブルのDBマイグレーション。gh-ostでサービスを止めずにPK型更新を実現した話 - WILLGATE TECH BLOG](https://tech.willgate.co.jp/entry/2026/04/30/120000)
    - gh-ostの基本的な挙動・メリット
    - > 以下の手順でテーブルのマイグレーションが行われます。
      - > 元テーブルのゴーストテーブルを作成
      - > 元テーブルのデータを少しずつゴーストテーブルへ INSERT
      - > 移行中に元テーブルで発生した更新（INSERT/UPDATE/DELETE）をbinlogから読み取り、リアルタイムにゴーストテーブルへ反映
      - > データの同期が完了したタイミングで、RENAME TABLEにより元テーブルとゴーストテーブルを瞬時にスイッチ
    - >約29億行のデータ移行を「約17.5時間」で無事に完了させることができました！🎉
  - ざっくり内部動作
    - Go 言語のシングルバイナリ
    - 自分自身をレプリカとして MySQL に接続して、バイナリログイベントを読み続ける
    - マイグレーション中は gh-ost プロセスが常駐する
