---
tags: "Ruby_on_Rails, ActiveSupport, バリデーション, with_options"
---

# Railsのwith_optionsでは中のifが外側のifを上書きする

- `with_options` は、ブロックの中のメソッド呼び出しに、共通のオプションを `deep_merge` で足すだけの部品
  - 検証専用の仕組みではなく、`if:` を特別扱いしない
  - そのため、中に `if:` を書くと、外側の `if:` は「両方満たすとき」にはならず、中の `if:` で置き換わる
  - 上書きされても、警告やエラーは出ない
- Rails の API ドキュメントにも、この例が注意書きとして載っている
  - [Rails API: Object#with_options](https://api.rubyonrails.org/classes/Object.html#method-i-with_options)
  - activesupport 7.2 の `active_support/core_ext/object/with_options.rb` のコメントで確認した

```ruby
class Post < ActiveRecord::Base
  with_options if: :persisted?, length: { minimum: 50 } do
    validates :content, if: -> { content.present? }
  end
end

# 次と同じ意味になり、外側の if: :persisted? は無視される
validates :content, length: { minimum: 50 }, if: -> { content.present? }
```

- 回避策
  - 条件を配列で並べる：`if:` と `unless:` には配列を渡せて、すべて満たしたときに検証が走る
    - 例：`validates :content, presence: true, if: [:published?, -> { !draft? }]`
  - 検証を1つのメソッドにまとめ、条件はそのメソッドの登録に1回だけ付ける
    - 例：`validate :validate_content, unless: :draft?`
    - 宣言的な `validates` が使えなくなり、`errors.add` を自分で書くことになる
  - `with_options` を使うなら、外側は `unless:`、中は `if:` のようにキーを分ける
    - 決まりを知らない人が中に `unless:` を書くと同じことが起きるので、根本的な対策ではない
