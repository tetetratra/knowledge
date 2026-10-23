---
tags: "エラー処理, エラー, 例外, 例外処理, ログ"
---

# rollbar

- エラーメッセージに`id`などの、ユーザーごとに異なる値を入れると、それぞれ別のエラーになってslack通知が爆発する懸念がある
  - 独自例外クラスに`rollbar_context`というフィールドを作り、そこに値を入れることで
    - エラータイトルは一緒になるから1種類のエラーにまとまる
    - rollbar上からもその値を見れる
      - https://docs.rollbar.com/docs/ruby#error-contexts
```ruby
class ExampleClass
  def any_method(params)
    // do work…
  rescue ArgumentError => e
    // Let the uncaught exception handler or other application code
    // report this later with the context set here.
    e.rollbar_context = { foo: ‘bar’ }
    raise
  end
end
```

- gemを使っていれば`StandardError`に自動で属性を追加してくれているので、↑ のようにするだけでOK
  - [Allow rollbar_context to be added to StandardError  rollbar/rollbar-gem](https://github.com/rollbar/rollbar-gem/issues/917)
