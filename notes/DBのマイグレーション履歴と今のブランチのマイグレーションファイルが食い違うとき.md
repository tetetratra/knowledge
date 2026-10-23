---
tags: "Ruby_on_Rails_マイグレーション, マイグレーション, migration, Ruby_on_Rails, Active_Record"
---

# DBのマイグレーション履歴と今のブランチのマイグレーションファイルが食い違うとき

- `rails db:migrate:status`で食い違いが確認できる
  - `*** NO FILE ***`が無くなる箇所までrollbackして、そこからmigrateし直せば一致するはず
- [【Rails】マイグレーションファイルやschemaファイルの仕組み、rails db:migrate、rails db:rollbackとかを纏めてみた - Qiita](https://qiita.com/ryota21/items/309f748561d025d5b2c4#%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%81%AB%E5%8F%8D%E6%98%A0%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%83%9E%E3%82%A4%E3%82%B0%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B)
- 検索すると、空マイグレーションを作れって出てくるけれど絶対違うと思う
- [What is the best way to resolve Rails orphaned migrations? - Stack Overflow](https://stackoverflow.com/questions/16041790/what-is-the-best-way-to-resolve-rails-orphaned-migrations)
  - この方法が良さそう
  - `git log --all --reverse --stat | grep 000000000000000 -C 100 | head -n 101`でマイグレーションファイルが作成(更新)されたコミットを探す
  - そこにcheckout
  - `rake db:migrate:down VERSION=000000000000000` でそのマイグレーションのみを消す
- `db:migrate:up`, `db:migrate:redo`などがある
- それでも`git diff`でschema.rbが出てくるとき
  - diffが出る行について、rails consoleから直接マイグレーションを発行するとよい
  - https://stackoverflow.com/questions/7287250/run-migrations-from-rails-console
    - `ActiveRecord::Migration.remove_column :table_name, :column_name`
