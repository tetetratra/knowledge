---
tags: "Heroku, デプロイ, 運用"
---

# heroku

- 環境変数の操作
  - [heroku 環境変数の操作 - Qiita](https://qiita.com/colorrabbit/items/18db3c97734f32ebdfde)
  - `heroku config:set ENV_VAR_NAME="value"`
- `heroku console`で`rails c`が見れる
  - [database - It's possible to delete a row in heroku postgresql? - Stack Overflow](https://stackoverflow.com/questions/15526776/its-possible-to-delete-a-row-in-heroku-postgresql)
- `heroku run コマンド`でコマンドが打てる
  - `heroku run printenv`とか
- アドオンを追加するには、webコンソールから追加するか、コマンドで`heroku addons:create heroku-postgresql`のように追加する
- Heroku Scheduler
  - cronのように定期実行ができる
  - 処理はrakeタスクとして書くと良さそう
  - `heroku logs`でログ
- DBに繋げるには
  - `heroku pg:psql -a app_name`
- [Herokuの代替サービス30選、使ってみた参考記事リンク付き - Qiita](https://qiita.com/rana_kualu/items/f7fc4916b7dc9797839e)
- w
