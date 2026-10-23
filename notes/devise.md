---
tags: "Gem, 認証, OmniAuth"
---

# devise

- [Devise入門 64のレシピ - 猫Rails](https://nekorails.hatenablog.com/entry/2021/03/18/110200)
  - これ読めだいたいのことがわかりそう
  - `#チートシート`のところだけでも参考になる
  - 第1章 Deviseをはじめよう
    - 001 Deviseを使ってみよう
      - `rails g devise:install`すると config/initializers/devise.rb と config/locales/devise.en.yml が作られる
    - 002 ヘルパーを使ってみよう
      - `authenticate_user!`
        - ユーザーがログイン済みの場合はアクセスを許可して、未ログインの場合はroot_pathにリダイレクトする
        - `current_user`, `user_signed_in?` が生える
  - 第2章 モジュールを使う
    - 003 モジュールとは？
      - 下記の10個ある
      - Registerable, Database Authenticatable, Rememberable, Recoverable, Validatable がデフォルトで有効になっている
      - 最初の2とかがコア機能じゃなくてモジュールだったことに驚き
      - 後からモジュールを追加するときは、devise_create_users.rb のマイグレーションでコメントアウトされているカラムを追加で加えればいい
      - `devise_for`するだけで、有効化されているモジュール用のルーティングが自動で定義される
    - 004 Registerableモジュール
      - サインアップ
    - 005 Database Authenticatableモジュール
      - Email/Password入力によるログイン
    - 006 Rememberableモジュール
      - Remember Me（ブラウザを閉じてもログインが継続する機能）
      - remember_created_at, remember_token カラムを使って実現している
        - ブラウザからCookieに保存した remember_token を送ってもらっているっぽい
    - 007 Recoverableモジュール
      - パスワードリセット
      - 下記2カラムを使う
        - reset_password_token: メアド変更認証メールのURLに付いて、ユーザーを判定するために使う
        - reset_password_sent_at: パスワードリセットメールの有効期限の判定
```rb
# パスワードリセットメール送信
user.send_reset_password_instructions

# パスワードリセット
# user.reset_password(new_password, new_password_confirmation)
user.reset_password('password123', 'password123')

# reset_password_tokenが有効期限内かどうかを、reset_password_sent_atを使い判定
user.reset_password_period_valid? #=> true

# tokenを使ってuserを取得
User.with_reset_password_token(token) #=> user
```

- `Devise::Mailer#reset_password_instructions`
  - パスワードリセットメールの設定?
- 008 Validatableモジュール
  - Email/Passwordのバリデーション
  - `config.password_length`で長さ指定(デフォルトで6~128)
- 009 Confirmableモジュール
  - サインアップ時に本登録用のメールを送信して、メールアドレスを確認する
  - カラム
    - confirmation_token: ランダムなトークン。送るメールに載っているリンクに付く
    - confirmed_at: いつconfirm(= メアド認証)されたかを保持。ここを見れば認証済みかどうかわかる
    - confirmation_sent_at: confirmation_token作成時刻
    - unconfirmed_email: まだconfirmされていないメールアドレスを持つ。メアド変更時の認証で使う
  - メソッド
    - `user.confirm`
    - `user.confirmed?`
    - `user.send_confirmation_instructions # 手動でConfirmメールを送信`
- 010 Trackableモジュール
  - ログイン時の情報（IPアドレスなど）をDBに保存する
- 011 Timeoutableモジュール
  - 一定期間アクセスがないと強制ログアウトさせる
- 012 Lockableモジュール
  - 指定回数ログイン失敗でアカウントをロックする
- 013 Omniauthableモジュール
  - Omniauthとの連携機能（Twitter・Googleアカウントなどでログインできる）
- 第3章 ビューをカスタマイズする
  - 014 ビューをカスタマイズする
    - アプリのdeviseがあればそっち、無ければdevise gemのビューが使われる
    - `rails g devise:views`
  - 015 レイアウトテンプレートをカスタマイズする
  - 016 バリデーションエラーの表示をカスタマイズする
    - `<%= render "devise/shared/error_messages", resource: resource %>`
    - カスタマイズするには`_error_messages.html.erb`
  - 017 ビューをHamlにする
  - 018 ビューをSlimにする
  - 019 Bootstrap4用のビューを利用する
- 第4章 コントローラーをカスタマイズする
  - 020 コントローラーをカスタマイズする
    - `rails g devise:controllers`
  - 021 Strong Parameterをカスタマイズする
    - >ログインフォームやサインアップフォームにテキストフィールドを追加したい場合があるよね。でもDeviseではStrong Parameterで許可される属性がデフォルトで決まっているため、ビューだけでなくStrong Parameterも変更する必要があるんだ。
```rb
# keysオプションを使うと、permitする属性を追加できる
# デフォルトでpermitされているpassword/password_confirmationに加えて、usernameもpermitする
devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
```

- 022 リダイレクト先を変更する
**メソッドをすればOK**

| メソッド名 | 概要 |
| --- | --- |
| after_sign_out_path_for | ログアウト時のリダイレクト先 |
| after_sign_in_path_for | サインイン時のリダイレクト先 |
| after_sign_up_path_for | サインアップ時のリダイレクト先 |
| after_inactive_sign_up_path_for | サインアップ時のリダイレクト先（Confirmableモジュール利用時） |
| after_update_path_for | ユーザー更新時のリダイレクト先 |
| after_confirmation_path_for | メール確認時のリダイレクト先 |
| after_resending_confirmation_instructions_path_for | 確認メール再送信時のリダイレクト先 |
| after_omniauth_failure_path_for | Omniauth失敗時のリダイレクト先 |
| after_sending_reset_password_instructions_path_for | パスワードリセット時のリダイレクト先 |

- 第5章 モデルをカスタマイズする
  - 023 複数モデルを利用する
    - `config.scoped_views = true`
  - 024 emailの代わりにusernameでログインさせる
    - usersテーブルにusernameカラムを追加する
      - uniqueインデックス付ける
    - `config.authentication_keys = [:username]`
    - Strong Parameterを設定
- 第6章 ルーティングをカスタマイズする
  - 025 deivse_forでルーティングを定義する
  - 026 devise_forをカスタマイズする
  - 027 名前空間を指定する
  - 028 独自のルーティングを定義する
  - 029 Deviseのルーティングを0から定義する
  - 030 ログイン後とログイン前でrootのルーティングを分ける
  - 031 ログイン後のみアクセスできるルーティングを定義する
  - 032 /users/sign_inを/users/loginに変更する
- 第7章 メーラーをカスタマイズする
  - 033 メール内容を変更する
  - 034 メールのfrom欄を変更する
  - 035 メーラーをカスタマイズする
  - 036 メール送信を非同期にする
- 第8章 I18nをカスタマイズする
  - 037 メッセージを変更する
  - 038 メッセージを日本語化する
  - 039 ビューを日本語化する
- 第9章 設定をカスタマイズする
  - 040 設定を変更する
- 第10章 その他のカスタマイズ（Wikiまとめ）
  - 041 パスワード変更時にログアウトさせない
  - 042 Deviseに独自の認証方法（Strategy）を追加する
  - 043 ゲストユーザー機能を実装する
  - 044 アカウント削除を論理削除にする
  - 045 管理者権限を用意する
  - 046 emailとusernameどちらでもログインできるようにする
  - 047 パスワード入力なしでアカウント情報を変更する
  - 048 パスワードをbcrypt以外の方法でハッシュ化する
  - 049 メールアドレス変更時にもConfirm指示メールを送信する
- 第11章 Tips
  - 050 userをserializeする
  - 051 モデルからcurrent_userにアクセスする
  - 052 テスト
- 第12章 Deviseのエコシステム
  - 053 AnyLogin - ログインユーザーを切り替える
  - 054 devise-i18n - ビューを日本語化する
  - 055 DeviseInvitable - 招待機能を追加する
  - 056 Devise Security - エンタープライズなセキュリティー機能を追加する
- 第13章 Devise内部を知る
  - 057 Warden
  - 058 Rails Engine
  - 059 Deviseコードリーディング
- 第14章 認証gemの比較
  - 060 Devise
  - 061 Sorcery
  - 062 Clearance
  - 063 Authlogic
  - 064 認証gemの比較まとめ
- 認証用であって、アカウント管理のgemというわけではない
- アカウント管理はRailsふつーに使えばOK
- [Rails Devise Wiki日本語もくじ1「ワークフローのカスタマイズ」（概要・用途付き）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=39243)
  - 他の記事にもやりたいことが載っているかも
  - 1. 「ワークフローのカスタマイズ」
    - この記事
  - 2. 「認証方法のカスタマイズ」「OmniAuth」
    - https://techracho.bpsinc.jp/hachi8833/2017_06_01/40856
  - 3. 「ビュー/コンテンツのカスタマイズ」「特権/認証」
    - https://techracho.bpsinc.jp/hachi8833/2017_06_08/41070
  - 4. 「テスト」「特殊な設定」
    - https://techracho.bpsinc.jp/hachi8833/2017_06_08/41083
  - 5. 「アプリでのその他の設定」「JavaScript」
    - https://techracho.bpsinc.jp/hachi8833/2017_06_14/41086
  - 6. 「他の認証プラグインからの移行」「アップグレード」
    - https://techracho.bpsinc.jp/hachi8833/2017_06_14/40707
- [Deviseのモヤモヤを解消して快適なRailsライフを送ろう！](https://zenn.dev/kitabatake/articles/start-to-like-the-devise#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E8%AA%8D%E8%A8%BC%E3%81%AE%E5%9F%BA%E6%9C%AC%E7%9A%84%E3%81%AA%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%81%AE%E4%BB%98%E4%B8%8E)
- [Rails: Deviseを徹底理解する（1）基礎編（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=133452)
  - > Deviseとは何か、Deviseを最初に使うべき理由、Deviseを使わない方がよい場合
  - > Deviseのインストール方法、およびプロジェクトでの利用方法
  - > プロジェクトに合わせてDeviseライブラリをカスタマイズする方法
- [Rails: Deviseを徹底理解する（2）応用編（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=133454)
  - >OmniAuth、およびAPI専用アプリケーションでのDeviseの使い方
  - > Deviseを認証ライブラリと統合する
