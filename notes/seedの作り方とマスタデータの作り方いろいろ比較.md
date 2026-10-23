---
tags: "マスタデータ, Ruby on Rails Tips, seed_fu"
---

# seedの作り方とマスタデータの作り方いろいろ比較

- マスタデータ Ruby on Rails Tips seed_fu
  - 本番環境
    - Rails標準
      - `db/seeds.rb`
        - `rails db:seed RAILS_ENV=production`
    - 広く使われる方法
      - `db/seeds.rb` + CSVやYAMLでマスタを定義
        - db/seed_data/*.csv などから読み込むように seeds.rb に記述したり
  - テスト環境
    - Rails標準
      - test/fixtures/*.yml
        - Minitest用
    - 広く使われる方法
      - FactoryBotをRSpec等と併用
  - 開発環境
    - Rails標準
      - db/seeds.rb
        - 本番と共用可。RAILS_ENV=development での実行もできる
    - 広く使われる方法
      - db/seeds/development.rb などに分離
      - seed-fu
        - `rails db:seed_fu`
      - seedbank
        - Rails の db/seeds.rb を 複数のファイルに分割し、環境ごとに柔軟にシードデータを管理できるようにするGem
          - db/seeds/development/users.seeds.rb のような感じに管理できる
