---
tags: "Ruby_on_Rails, Rails, 設計, React, TypeScript, GraphQL, job, バッチ処理, Gem, Puma, Trilogy, SolidQueue, SolidCache, Kaminari, Faraday, Ueki, Jb, Nokogiri, Blazer, BIツール, ActiveHash, Flipper, Lograge, 50452, MaintenanceTasks, ReciteCSV, UserAgent, AnnotateRb, Prosopite, Traceroute, RuboCop, CiLogger, Committee, SuperDiff, Authentication Generator, Ridgepole, ActiveStorage, ヘルスチェック"
---

# Ruby on Rails 設計

- [Only My Rails Way](https://zenn.dev/yukito0616/articles/d3b7032e9f1e90)
  - Railsの設計が幅広くまとめられていて参考になりそう
- [翻訳: WebAPI 設計のベストプラクティス - Qiita](https://qiita.com/mserizawa/items/b833e407d89abd21ee72)
- https://12factor.net/ja/
  - 開発全般
- [rails api + react + typescript + graphqlでの認証](https://zenn.dev/naok_1207/books/ba7243f1460b9e)
- エラーの処理について [Railsアプリケーションにおけるエラー処理（例外設計）の考え方 - Qiita](https://qiita.com/jnchito/items/3ef95ea144ed15df3637)
  - 業務エラー(相手の入力が悪い時)
    - 保存メソッドの戻り値のifで分岐
    - >業務エラーの有無はモデルのバリデーションで検証し、エラー内容はモデルのerrorsに格納する。
  - システムエラー(内側のエラー)
    - エラー画面を出す
- ロジックどこに書く?
  - [Railsでロジックを書く場所を意識する - Qiita](https://qiita.com/kanekomasanori@github/items/daf93f95c77c629d070f)
  - モデルに。モデルとフォームに大きく差異があるときは、フォーム用のクラスを作る
  - >フォームクラスはActiveModelをIncludeして実装することで、DB側に無いテーブルやテーブルの項目などの扱いが簡単になります。
  - フォームクラスのnewやsaveをつかって、コントローラーをいいかんじにかく
- 複数モデルを1アクションで扱うときの良い書き方
  - [Railsで1つのフォームで複数のモデルを登録・更新させる - Qiita](https://qiita.com/tmzkysk/items/6349d8d860c5982771ff)
- スタイルガイド [satour/rails-style-guide-jp: 有志による Ruby on Rails 4 のスタイル・ガイドです。](https://github.com/satour/rails-style-guide-jp)
- `thread_mattr_accessor`
  - 禍々しいやつ
  - スレッド内で変数を共有したいときに使う
    - グローバル変数的
  - ロギングモジュール用の値を設定しておくときとかに
  - `begin -> 値を代入 -> 実処理 -> ensureでnilを代入`のような使い方？
- コントローラーでjsonを返すとき、そのまま`to_hash`や`to_json`は良くないので、Presenterを挟むという設計がある
  - そのPresenterが`to_hash`を実装して、`render json:`に渡す
- 代数的データ型のResult型のようなことをやりたくなったときは、Errorをクラスとして作ってそれをraiseするのがRuby的には自然
  - 「例外は本当に例外的なときにのみ投げる」という考えに固執しないようにしよう
**calee.rb**

```
class Error < StandardError; end
class FormatError < StandardError; end

def f
  ...
rescue URIError
  raise FormatError unless valid
end

```

- テーブル名を考えるときは名前空間を意識するといいかも
- 1. 機能のprefixを決める
  - 例:  `PointHistory`
- 2. テーブル毎に、そのprefixを付けた後に、テーブルの命名をする
  - 例:  `point_history_user_logs`, `point_history_point_types` など
- エラー文言をどこで作るか比較
  - Model (のバリデーション)
    - Railsのレールに乗った場合はココ
    - ModelがViewと密結合してしまう
  - Controller・サービス層
    - エラーの文言はAPIごとに変えたい場合があるので、コントローラーはわりと良い場所
- 重い or 頻繁に呼ばれる更新系APIに、リアルタイム性が必要なくて別軸の機能を付け足す場合、job化するという選択肢がある
  - 「API頻度＝job数」になることが許容かどうかの確認は必要
- jobのエラーハンドリング
  - バッチ処理も
  - 観点
    - 何回リトライするか
      - sidekiqデフォルトだと何回も(20回?)リトライしてしまう
    - エラーを流すかどうか
    - エラーをどこに流すか
      - slack? rollbar? 両方?
- [Rails: Evil Martiansが使って選び抜いた夢のgem -- 2024年度版（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=126782)
  - 各用途ごとにオススメのgemが書いてある
- [ClinPeer Railsプロジェクトの技術選定（2025年版） - メドピア開発者ブログ](https://tech.medpeer.co.jp/entry/2025/02/25/115000)
  - 技術選定
    - Ruby
    - Ruby on Rails
    - Puma
    - ActionPack::CloudfrontViewerAddress
    - Trilogy
    - SolidQueue
    - SolidCache
    - Kaminari
    - Async::HTTP::Faraday
    - Ueki
    - Jb
    - Nokogiri
    - Blazer
      - 簡易BIツール用gem
    - ActiveHash
    - Flipper
    - Lograge
      - > Rails本体で構造化ログに関して動きがありそう
        - [Add structured logging next to developer logging · Issue  · rails/rails](https://github.com/rails/rails/issues/50452)
    - MaintenanceTasks
    - ReciteCSV
    - UserAgent
    - AnnotateRb
    - RBS系各種
    - Prosopite
      - > BulletはActiveRecordにモンキーパッチを当ててN+1を検知するアプローチなのに対して、ProsopiteはActiveRecordが発行したSQLを監視するというアプローチを採用しています。
    - Traceroute
    - RuboCop
    - CiLogger
    - Committee / Committee::Rails
      - > APIのI/F定義をOpenAPIなYAMLファイルで管理しています。
      - > I/F定義通りにAPIが実装されていることを担保するために、RequestSpecでCommitteeを活用し「テスト時のリクエスト内容」と「レスポンス」の妥当性を検証しています。
    - RSpec::Snapshot
    - SuperDiff
  - その他
    - 認証系Gem
      - > https://github.com/heartcombo/devise や https://github.com/Sorcery/sorcery など著名なGemも検討しましたが、重厚なGemは将来の負債になると考え Rails公式提供のAuthentication Generator をベースに必要最低限の機能を自前実装する方針としました。
    - Ridgepole
    - 設定値管理（Rails.application.config_for）
    - ファイル管理（ActiveStorage）
    - HTMLテンプレートエンジン（ERB）
    - ヘルスチェック（Rails標準Health）
