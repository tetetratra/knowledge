---
tags: "Ruby, CSV, パフォーマンス"
---

# RubyのCSV.generate_lineは呼ぶたびにCSVインスタンスを作る

- `CSV.generate_line(row)`は、呼ぶたびに CSV のインスタンスを作り、1行を書いて文字列を返す
  - `Array#to_csv`も、中で`CSV.generate_line`を呼んでいるだけ
**csv 3.3 の lib/csv.rb と lib/csv/core_ext/array.rb**

```ruby
def generate_line(row, **options)
  # ...
  (new(str, **options) << row).string
end

class Array
  def to_csv(**options)
    CSV.generate_line(self, **options)
  end
end
```

- 複数行をまとめて文字列にするなら、インスタンスを1つにして書く
  - `CSV.generate_lines(rows)`は、中で`CSV.generate`を1回だけ呼ぶ
  - `CSV#<<`は self を返すので、`rows.reduce(CSV.new(+'')) { |csv, row| csv << row }.string`とも書ける
- csv gem は C 拡張を持たず、書き出しはどれも Ruby で書かれた`CSV::Writer`を通る（csv 3.3.5 で確認）
- 行の値を作る処理が重い場合、インスタンスを作り直す負担は全体のごく一部にとどまる。書き方を複雑にする前に割合を測る
