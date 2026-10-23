---
tags: "AWS, RDS, DB, データベース, Aurora, AWS_Aurora, スロークエリ, CloudWatch, MySQL, Blue/Green Deployments, レプリケーション, ca_srg, binlog, Performance insights"
---

# AWS RDS

- スロークエリは、(DB作成時に設定していれば)CloudWatchのロググループから見れる
- [RDSで接続数とメモリ消費量の調整事例 | 外道父の匠](https://blog.father.gedow.net/2020/11/24/database-connection-and-memory-on-rds/)
  - (QA環境用とかで) 1つのインスタンスにデータベースを作って消してを繰り返している場合、その都度MySQLがメモリを確保する
  - MySQLは使わなくなったメモリがあれば開放しているけれど、OS側ではずっとMySQLに割当っぱなしになっていて、インスタンスとしてはメモリ不足になることがあるらしい
- [Aurora MySQLのアップグレード後ロールバック方法を検討してみた - Timee Product Team Blog](https://tech.timee.co.jp/entry/2024/09/17/100000)
  - Blue/Green Deployments 自体のサポートはある
    - > 切替自体はワンクリックで可能でSwitchOverという命令を与えると、1分程度のダウンタイムは発生しますが特に難しいことはなくGreenクラスターに切り替えることができます。この際にアプリケーションサーバー等が参照しているエンドポイントも自動で切り替わります。
  - この記事では、もしもの際のロールバック手法を検討した結果を書いている
**検討したロールバック手法**

| 方式名 | ダウンタイム | 互換性 | 容易さ | 特徴 |
| --- | --- | --- | --- | --- |
| AWS Database Migration Service(DMS) | ◯ | ☓ | ◯ | データ互換性の担保が難しい |
| GreenのバックアップデータをBlueへリストア | ☓ | ◯ | △ | ダウンタイムはデータ量に比例 |
| GreenからBlueへの逆方向レプリケーション（没案） | △ | ◯ | △ | ロールバック時のダウンタイムに加えて、SwitchOver前にダウンタイムが必要 |

- 「ダウンタイム」「互換性」「容易さ」の観点で調べてる
- 「GreenからBlueへの逆方向レプリケーション」は↓の記事を紹介していた
  - [RDS B/G Deployments機能でAuroraクラスターバージョンアップした後の切り戻しを考える - CyberAgent SRG ](https://ca-srg.dev/00c421abf08d484298e27a84ab7ad9a3#block-19d096adb90a4aa380b7779d1a5a7e2e)
  - > Green, Blueクラスターは、それぞれ異なるbinlogファイル・ポジションを保持しているため、BlueクラスターにとってGreenクラスターのどのポジションから読み出しにいくべきか？、レプリケーション開始時点のポジションが必要になります。
  - > 上記のコマンド例のように、show master status; コマンドによりポジション取得を行うためには書き込みを一旦停止する必要があり、これがSwitchOver前にサービス・メンテナンスを行う理由となります。
  - > 結果的には、本案は没案となりました。そもそもロールバックは万が一の備えであるため、その備えのための事前作業でサービス停止が100%発生することは許容できなかったからです。
- [Implement a rollback strategy after an Amazon Aurora MySQL blue/green deployment switchover | AWS Database Blog](https://aws.amazon.com/jp/blogs/database/implement-a-rollback-strategy-after-an-amazon-aurora-mysql-blue-green-deployment-switchover/)
  - > AWSの方にも相談をしながら検討をしていたのですが、24’ 8/6に公開されたこのブログポストを紹介していただきました。先ほど没案となった逆レプリ方式を改善できる一手になる！という手応えを得て検証を開始しました。
  - SwitchOver時に静止断面を教えてくれる機能
- RDSのPerformance insights画面から、どんなクエリが発行されていてどの内部動作に時間がかかっているかなどがわかる
