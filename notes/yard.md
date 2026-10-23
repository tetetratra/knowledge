---
tags: "Ruby, 型"
---

# yard

- https://www.rubydoc.info/gems/yard/file/docs/Tags.md#option
  - ここを見れば大体の例が載っている
```rb
# @overload set(key, value)
#   Sets a value on key
#   @param key [Symbol] describe key param
#   @param value [Object] describe value param
# @overload set(value)
#   Sets a value on the default key +:foo+
#   @param value [Object] describe value param
def set(*args) end

# @param url [String] the URL of the page to download
# @param directory [String] the name of the directory to save to
def load_page(url, directory: 'pages') end

```

- 配列の中身の型の書き方
```rb
# <型> はリストっぽい配列用
# <(型)> はタプルっぽい配列用
# @param daily_steps [Array<Array<(Date, Integer)>>]

```

- Hashの中身の型の書き方
```rb
Hash<KeyType, ValueType>

Hash{KeyTypes=>ValueTypes}

```

- Integerかnilを返すようなとき
```rb
# @return [Integer, nil]

```

- ブロック引数系
  - `@yield`
    - 受け取るブロックに対して、そのブロックの引数の変数名
    - 例：`@yield [a, b, c] Gives 3 random numbers to the block`
  - `@yieldparam`
    - 受け取るブロックに対して、そのブロックの引数の型
      - `@yield`と併用することで、引数の意味と型の両方を記述できる
    - 例：`@yieldparam [String] name the name that is yielded`
  - `@yieldreturn`
    - 受け取るブロックに対して、その戻り値に期待する型
    - 例：`@yieldreturn [Fixnum] the number to add 5 to`
