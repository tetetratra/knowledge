---
tags: "devise, Gem, Ruby_on_Rails, 認証, テスト"
---

# Deviseのパスワード再設定画面はトークンを検証せずに開ける

- Devise のパスワード再設定画面（`PasswordsController#edit`）は、URL の `reset_password_token` を検証しない
  - 任意の値を付けた URL でも画面は開ける
  - トークンを検証するのは、パスワードを送信したとき（`update`）だけ。無効なら、そこでエラーになる
  - [devise/app/controllers/devise/passwords_controller.rb](https://github.com/heartcombo/devise/blob/main/app/controllers/devise/passwords_controller.rb)
- 画面を開いた時点でトークンの有効性によって表示を変えたいなら、自分で判定する
  - `User.with_reset_password_token(raw_token)` で、生のトークンからユーザーを引ける
  - `user.reset_password_period_valid?` で、有効期限（`config.reset_password_within`）内かを判定できる
  - [devise/lib/devise/models/recoverable.rb](https://github.com/heartcombo/devise/blob/main/lib/devise/models/recoverable.rb)
- トークンが無効になる3つの状態と、判定の分岐
  - 任意の値：ユーザーが見つからない
  - 使用済み：ユーザーが見つからない
    - パスワードの更新に成功すると、Devise がトークンを消すため（`clear_reset_password_token`）
  - 期限切れ：ユーザーは見つかるが、`reset_password_period_valid?` が偽になる
  - 再設定メールを依頼し直すと、トークンが新しい値に置き換わり、古い URL は任意の値と同じ扱いになる
  - 画面を開くだけでは、トークンは消費されない
