---
tags: "本, Rails, Ruby on Rails, CoC, DRY, CSRF, minitest, dotenv, figaro, Early Hints, HTTP, サーバープッシュ, CSP, nonce, Webpacker, webpack, yarn, Sass, Sprockets, nginx, Active Job, Sidekiq, Resque, Delayed Job, Shoryuken, AWS SQS, Active Storage, AWS S3, Action Mailer, SMTP, SendGrid, Action Mailbox, DNS, MXレコード, Trix, Action Cable, WebSocket, OAuth, GitHub, OmniAuth, ActiveSupport::TimeWithZone, SJR, RSpec, image_processing, ImageMagick, Active Storage Validations, kaminari, Searchkick, Elasticsearch, exception_notification, Github Actions, GitHub Dependabot, rubocop, rubocop-performance, rubocop-rails, Brakeman, SimpleCov, Skylight, New Relic, rack-mini-profiler, Chef, Itamae, Ansible, Docker, Rollbar, Sentry, Airbrake, unicorn, 値オブジェクト, サービスオブジェクト, ユースケース, アプリケーションサービス, Interactor, Decorator, デコレーター"
---

# 8章 Railsアプリケーション拡張

- [パーフェクトRuby on Rails【増補改訂版】：書籍案内｜技術評論社](https://gihyo.jp/book/2020/978-4-297-11462-6)

- **8章 Railsアプリケーション拡張**
- **8-1 ファイルアップロード機能を作る**
  - `bin/rails active_storage:install`
  - `has_one_attached :image`
  - サムネイル生成
    - image_processing gem
      - ImageMagick, GraphicsMagick, libvips のラッパー
      - Rails 6.0のデフォルトはImageMagick
      - `config.active_storage.variant_processor = :vips`
    - `image.variant(resize_to_fit: [200, 200])`のようにすることで、アクセス時にサムネイルが生成されて、保存までされる
  - バリデーション
    - Active Storage Validations gemを使う
    - `validates :image, content_type: [:png, :jpg, :jpeg]`
      - ファイルタイプのバリデーション
      - 拡張子以外にファイルの中身まで見てくれる
    - `validates :image, size: { less_than_or_equal_to: 10.megabytes }`
      - サイズのバリデーション
    - `validates :image, dimension: { width: { max: 2000 } , height: { max: 2000 } }`
      - 大きさのバリデーション
  - アップロードされたかどうかの判定は `image.blob&.persisted?`
  - Active Storageにダイレクトアップロード機能はあるけれど、バリデーションが難しい
- **8-2 gemで機能拡張をする**
  - kaminariでページネーション
    - `bin/rails g kaminari:views bootstrap4`で、kaminariデフォルトのビューを上書きできる
  - Searchkick
    - Elasticsearchとデータベースを連携させるためのgem
    - Elasticsearchとは
      - 全文検索エンジン
      - >Elasticsearch は Elastic 社が中心となって開発を進めています。
      - >ElasticsearchをRubyで扱うためのgemであるelasticsearch gemは、Elastic社のリポジトリで管理されており、Elasticsearch の開発が続く限りメンテナンスが滞る心配はなさそうです。
      - Railsとは別プロセスで動く
      - `brew tap elastic/tap && brew install elastic/tap/elasticsearch-full`
      - `elasticsearch-plugin install analysis-kuromoji`
        - 形態素解析ライブラリ
    - モデルクラスにて
      - `searchkick language: "japanese"`
      - `def search_data`
        - elasticsearchのインデックスに追加する情報を登録する
    - `bin/rails r Event.reindex`コマンドでインデックスを登録
    - RailsのVIEWを使う場合、フォームオブジェクトを使うとよい
**app/forms/event_search_form.rb**

```
include ActiveModel::Model
include ActiveModel::Attributes
attribute :keyword, :string
attribute :page, :integer
def search
  Event.search(
    (keyword.presence || "*"),
    where: { start_at: {gt: start_at} },
    page: page
    per_page: 10
  )
end
```

**app/controllers/welcome_controller.rb**

```
def index
  @event_search_form = EventSearchForm.new(
    params.fetch(:event_search_form, {}).permit(:keyword, :start_at).merge(page: params[:page])
  )
  @events = @event_search_form.search
end

```

- **8-3 落穂ひろい**
  - エラーハンドリング
    - `rescue_from`
      - 複数書いたときは下から判定されるので、`rescue_from Exception`を一番**最初**に書くべし
      - `with:`オプションでハンドリングメソッドを指定するとき、メソッド内で、リクエストがなんであれHTMLで返すようにするのもあり
        - `def render404(e); render "error404", status: 404, formats: [:html]; end`
      - `routes.rb`に無いパスは、RackMiddlewareの段階でエラーが起こる
        - なので、404はルーティングに明示的に書いてハンドリングする
        - `match "*path" => "application#error404", via: :all`
  - Rack Middlewareを利用したエラーハンドリング
    - こっちは `rescue_from` を使わない方法
    - `ActionDispatch::ShowExceptions`Rackミドルウェア
      - `Rails.application.config.exceptions_app`で設定したRackアプリがエラーを処理する
        - デフォルト値は`ActionDispatch::PublicExceptions`
          - 例外クラスを見て `public/{404,404,500}.html` を出し分けてくれる
          - 知らない例外クラスに対しては505
      - `config.action_dispatch.rescue_responses.merge!("YourNewException" => :not_found)`で、例外クラスと挙動を紐付けられる
    - `config.consider_all_requests_local = false`
      - 開発環境で本番環境用のエラーページを表示させる
  - エラーの通知
    - exception_notification gemや、Sentry, Rollbar等の外部サービスを利用
  - gem探しのTips
    - Awesome Ruby
    - The Ruby Toolbox
    - Githubのスター
    - コミット頻度
    - Issue, Pull Requestの滞り
