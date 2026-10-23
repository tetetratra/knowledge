---
tags: "本, Rails, Ruby on Rails, CoC, DRY, CSRF, minitest, dotenv, figaro, Early Hints, HTTP, サーバープッシュ, CSP, nonce, Webpacker, webpack, yarn, Sass, Sprockets, nginx, Active Job, Sidekiq, Resque, Delayed Job, Shoryuken, AWS SQS, Active Storage, AWS S3, Action Mailer, SMTP, SendGrid, Action Mailbox, DNS, MXレコード, Trix, Action Cable, WebSocket, OAuth, GitHub, OmniAuth, ActiveSupport::TimeWithZone, SJR, RSpec, image_processing, ImageMagick, Active Storage Validations, kaminari, Searchkick, Elasticsearch, exception_notification, Github Actions, GitHub Dependabot, rubocop, rubocop-performance, rubocop-rails, Brakeman, SimpleCov, Skylight, New Relic, rack-mini-profiler, Chef, Itamae, Ansible, Docker, Rollbar, Sentry, Airbrake, unicorn, 値オブジェクト, サービスオブジェクト, ユースケース, アプリケーションサービス, Interactor, Decorator, デコレーター"
---

# 10章 コンテナを利用したRailsアプリケーションの運用

- [パーフェクトRuby on Rails【増補改訂版】：書籍案内｜技術評論社](https://gihyo.jp/book/2020/978-4-297-11462-6)

- **10章 コンテナを利用したRailsアプリケーションの運用**
- **10-1 Railsアプリケーションのインフラ概要**
  - Chef, Itamae, Ansible の時代
    - 冪等に書かねばならない難しさが合った
  - コンテナ(Docker)の時代
    - Disposable(破棄可能)なインフラ
- **10-2 基本的なDockerイメージの構築**
  - Dockerfile のノウハウ
    - できるだけキャッシュを利用したい
      - NodeやRailsのインストールは初回のみにしたい
      - Gemfileに変更が無ければすでにインストールしたものを使いたい
      - Gemfileに変更があっても、差分のgemのみインストールされるようにしたい
    - appのみインストールするために (gemは再インストールしないために)
      - Dockerfileのキャッシュが利用**できなくなる**のは、`COPY`コマンドでコピーするファイルの中身が変化したとき
      - ギリギリまでCOPYしないように努める
      - COPYする際は最低限のファイルのみをCOPYする
      - 変更が**少ない**ファイルからCOPYしていく
        - `./app/`よりも`./Gemfile`を先にCOPYする
    - 差分のgemのみインストールするために
      - buildkitのマウントキャッシュという機能を使うらしい(省略)
        - docker-compose.yml でvenderディレクトリをVolume扱いにするのと同じ?
- **10-3 開発環境におけるDockerの活用**
  - (既知だったので省略)
- **10-4 環境によって可変する設定値や秘匿情報の管理**
  - `credentials.yml.enc` を復号化するためのキーを環境変数経由で渡す
  - 本番環境では、AWS Key Management Service などを使う
- **10-5 ログ出力**
  - Dockerの logging driver 機能
    - ログの出力先をコントロールできる
    - Railsプロセスの STDOUT, STDERR を syslog, fluentd などに流す
      - config/environments/production.rb では `config.logger = ActiveSupport::Logger.new($stdout)` と設定する
  - エラートラッキング
    - Rollbar, Sentry, Airbrake, [errbit](OSS) などがある
    - Slackに通知したり、自動でGithubのissueを立てたりできる
- **10-6 HTTPサーバとの通信**
  - nginx→unicorn→Rails
    - unicorn(プロセス数 数個)が、来たリクエストを次々に処理できるようにするために、バッファ機能があるnginx(プロセス数 数千個)を前段に挟む
