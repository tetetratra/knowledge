---
tags: "Ruby, Grape, HTTP, エラー処理"
---

# Grapeはエラー応答の形式もenvのapi.formatで決める

- Grape（1.8 のソースで確認）は、レスポンスの本文を変換する formatter を、形式名から引く
  - 組み込みは`json`、`jsonapi`、`serializable_hash`、`txt`、`xml`の5つ
  - 見つからない形式名には、受け取ったものをそのまま返す formatter（`->(obj, _env) { obj }`）が使われる
  - [grape の lib/grape/formatter.rb](https://github.com/ruby-grape/grape/blob/v1.8.0/lib/grape/formatter.rb)
- API 全体を`format :json`にしたまま CSV などを返すエンドポイントでは、`env['api.format'] = :binary`とする
  - `binary`の formatter はないので、本文は変換されずにそのまま返る
  - Content-Type は別に`content_type 'text/csv'`で指定する
- `rescue_from`が作るエラー応答も、そのときの`env['api.format']`を見て本文の形式を決める
  - [grape の lib/grape/middleware/error.rb](https://github.com/ruby-grape/grape/blob/v1.8.0/lib/grape/middleware/error.rb)の`format_message`
  - `:binary`にしたあとで例外が起きると、エラー応答の Content-Type は`text/html`になり、JSON の本文は HTML エスケープされた（1.8 で試して確認）
  - 失敗しうる処理を`:binary`にする前に置くか、例外を拾って`env['api.format'] = :json`に戻してから投げ直すと、ほかの API と同じ JSON のエラーで返る
