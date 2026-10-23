---
tags: "gem, OAuth, omniauth"
---

# doorkeeper

- **OAuth2による認証機能を追加するGem**
  - github: https://github.com/doorkeeper-gem/doorkeeper
  - ガイド: https://doorkeeper.gitbook.io/guides/
    - railsで使うときのガイド：https://doorkeeper.gitbook.io/guides/ruby-on-rails/getting-started
  - rubydoc: https://www.rubydoc.info/github/doorkeeper-gem/doorkeeper/index
  - https://github.com/doorkeeper-gem/doorkeeper-provider-app
    - 公式サンプルアプリ
    - >This app is an example of an OAuth 2 provider using Doorkeeper gem, Rails 7.x and Devise. Check out the app hosted on heroku for a live demo.
  - [authorization code grantに沿ったDoorkeeperのコードリーディング - kymmt](https://blog.kymmt.com/entry/reading-doorkeeper-authz-code-grant)
    - この方の記事を読むのがよさそう
      - [Doorkeeper の検索結果 - kymmt](https://blog.kymmt.com/search?q=Doorkeeper)
    - 承諾画面の表示 → `GET /oauth/authorize`
    - 承諾画面で承諾をサブミット → `POST /oauth/authorize`
  - [Using Resource Owner Password Credentials flow · doorkeeper-gem/doorkeeper Wiki](https://github.com/doorkeeper-gem/doorkeeper/wiki/Using-Resource-Owner-Password-Credentials-flow)
    - Password Credentials
    - >このフローでは、**リソース所有者**の資格情報（ユーザー名とパスワード）と引き換えにトークンが要求されます。
  - [Doorkeeper Gemについて - JQ Blog](https://jq-jo.github.io/blog/2017/09/21/doorkeeper/)
    - >`POST /oauth/authorize`で取得できるcodeを利用して`POST /oauth/token`でアクセストークンを取得。
  - omniauthとの違い
    - omniauth
      - OAuthに限らずに色々な認証を提供している
    - doorkeeper
      - (todo)
  - [Getting Started | doorkeeper](https://doorkeeper.gitbook.io/guides/ruby-on-rails/getting-started)
    - doorkeeper公式の、doorkeeperをrails(とdevice)で使うためのやり方解説
    - ざっくり手順解説
      - 初期準備 (gemのinstallやusersへのカラム追加やgenerateの実行など)
      - `resource_owner_authenticator do ~`を定義する
        - 中身には`current_user || warden.authenticate!(scope: :user)`と書く
        - このブロックでは下記を行う
          - ユーザーが現在認証されているかどうかを返す
          - ユーザーを認証ページにリダイレクトする
      - `ActionController::API`に`before_action :doorkeeper_authorize!`を設定する
        - `current_resource_owner`のようなメソッドを使えるようにするには、↓のようなメソッドを定義する
```rb
def current_resource_owner
  User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
end

```
