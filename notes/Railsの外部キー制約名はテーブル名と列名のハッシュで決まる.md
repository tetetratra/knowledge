---
tags: "Ruby_on_Rails, 外部キー制約, マイグレーション, DB"
---

# Railsの外部キー制約名はテーブル名と列名のハッシュで決まる

- `add_foreign_key` で名前を指定しないと、Rails は制約名を `fk_rails_` と10文字のハッシュで作る
  - ハッシュは、`"#{テーブル名}_#{列名}_fk"` の SHA-256 を16進で表した先頭10文字（1列の外部キーの場合）
- 名前はテーブル名と列名だけで決まるので、どの環境で作っても同じ名前になる
- 作った名前は制約として DB に保存されるので、mysqldump などで構造を書き出すとそのまま出てくる
- 一方 `schema.rb` は、`fk_rails_` と10文字の16進に一致する名前を書き出さない。読み込むときに同じ規則で作り直せるため
- 出典：[schema_statements.rb の foreign_key_name](https://github.com/rails/rails/blob/main/activerecord/lib/active_record/connection_adapters/abstract/schema_statements.rb)、[schema_dumper.rb の fk_ignore_pattern](https://github.com/rails/rails/blob/main/activerecord/lib/active_record/schema_dumper.rb)
