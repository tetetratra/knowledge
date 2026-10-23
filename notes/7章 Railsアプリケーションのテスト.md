---
tags: "本, Rails, Ruby on Rails, CoC, DRY, CSRF, minitest, dotenv, figaro, Early Hints, HTTP, サーバープッシュ, CSP, nonce, Webpacker, webpack, yarn, Sass, Sprockets, nginx, Active Job, Sidekiq, Resque, Delayed Job, Shoryuken, AWS SQS, Active Storage, AWS S3, Action Mailer, SMTP, SendGrid, Action Mailbox, DNS, MXレコード, Trix, Action Cable, WebSocket, OAuth, GitHub, OmniAuth, ActiveSupport::TimeWithZone, SJR, RSpec, image_processing, ImageMagick, Active Storage Validations, kaminari, Searchkick, Elasticsearch, exception_notification, Github Actions, GitHub Dependabot, rubocop, rubocop-performance, rubocop-rails, Brakeman, SimpleCov, Skylight, New Relic, rack-mini-profiler, Chef, Itamae, Ansible, Docker, Rollbar, Sentry, Airbrake, unicorn, 値オブジェクト, サービスオブジェクト, ユースケース, アプリケーションサービス, Interactor, Decorator, デコレーター"
---

# 7章 Railsアプリケーションのテスト

- [パーフェクトRuby on Rails【増補改訂版】：書籍案内｜技術評論社](https://gihyo.jp/book/2020/978-4-297-11462-6)

- **7章 Railsアプリケーションのテスト**
- **7-1 テストコードをどう書いていくか**
- **7-2 minitestとRSpec**
  - minitest
    - xUnit風な書き方とRSpec風な書き方の2 通りをサポート
    - Rails標準
    - `bin/rails generate test_unit:scaffold ticket [--api]`で、scaffold後に後からテストを追加できる
  - RSPec
    - テストを構造化しやすい
    - メジャー
- **7-3 テストデータを作成する**
  - `bin/rails g factory_bot:model user`
  - `factory`メソッドには`alias:`キーワード引数がある
- **7-4 システムテスト**
- **7-5 コントローラに対する機能テスト**
  - コントローラに対する機能テストはビューもrack middlewareも実行する
**test/sign_in_helper.rb**

```
module SignInHelper
  def sign_in_as(user)
    OmniAuth.config.test_mode = true
    OmniAuth.config.add_mock(
      user.provider,
      uid: user.uid,
      info: { nickname: user.name,
      image: user.image_url }
    )
    case
    when respond_to?(:visit) # システムテストと機能テストの場合で処理を分岐
      visit root_url
      click_on "GitHubでログイン"
    when respond_to?(:get)
      get "/auth/github/callback"
    else
      raise NotImplementedError.new
    end
  @current_user = user
end

```

- **7-6 モデルに対するテスト**
  - ダブル
    - オブジェクトの代 わりをするオブジェクト
  - スタブ
    - ダブルの一種
    - `require 'minitest/mock'`
    - `user.stub(:id, event.owner_id)`
    - 未定義のメソッドに大してスタブはできないので注意
      - オブジェクトに定義済みのメソッドを差し替えることしかできない
  - モック
    - ダブルの一種
    - メソッドの戻り値を変えられる
    - `require 'minitest/mock'`
    - `user = MiniTest::Mock.new.expect(:id, event.owner_id)`
      - `user.verify`で呼ばれたことを検証
  - バリデーションなど、Railsの機能をテストしているようなことになりかねないときは、そのテストは書かないのもあり
