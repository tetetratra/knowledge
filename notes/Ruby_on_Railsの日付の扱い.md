---
tags: "Ruby_on_Rails, Ruby_on_Rails_Tips, タイムゾーン, Docker, ActiveRecord, 日付, 時刻, ActiveSupport::TimeWithZone, パーフェクトRuby on Rails"
---

# Ruby on Railsの日付の扱い

- 新しくRailsアプリを作ったりDBに接続したりするときはタイムゾーンの対応を忘れずに
  - [Railsのタイムゾーン設定について](https://zenn.dev/ryouzi/articles/dda18594f2dbd3)
    - 処理ごとにどの設定を使うかが違う
      - 1. `Time.now `
      - 2. `Time.current`
      - 3. ActiveRecordの時刻の扱い
      - 4. 実際にDBに保存される時刻
    - 設定箇所は3箇所ある
      - OSのタイムゾーン設定
        - →Asia/Tokyo
          - Dockerファイルやdocker-compose.ymlの設定でAsia/Tokyoにする
      - Railsのタイムゾーン設定
        - → config/application.rb内で、`config.time_zone = 'Tokyo'`を設定する
      - ActiveRecordでレコードを読み書きする際のタイムゾーン設定
        - → config/application.rb内で、`config.active_record.default_timezone = :local`にする
- 「Modelインスタンスのattribute (Date型)」と「Railsの便利日付オブジェクト (ActiveSupport::TimeWithZone型)」を比較しないように注意！
  - Railsの仕様として、ActiveSupport::TimeWithZone型とDate型で値の比較が行われるとき、Date型の値はto_datetimeされたものが使われる
    - https://github.com/rails/rails/issues/30870#issuecomment-337897432
  - なので、「Date型のX日」と「ActiveSupport::TimeWithZone型のX日」を比較したとき、、、
    - Date型のX日は `X日 00:00 (UTC)` になる
    - ActiveSupport::TimeWithZone型のX日は、時刻情報はJSTで持っているので、UTCに変換されて、、、
      - `X日8時(JST)` → `X-1日23時(UST)`
        - **X日 のつもりが X-1日 の日付になってしまう**
      - `X日9時(JST)` → `X日0時(UST)`
      - `X日10時(JST)` → `X日1時(UST)`
  - パーフェクトRuby on RailsではActiveSupport::TimeWithZoneへの統一を推奨している
