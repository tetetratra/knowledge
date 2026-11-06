---
tags: "python, プログラミング言語, 文字列, 標準ライブラリ"
---

# Pythonのstring.Formatter.parseで書式文字列のプレースホルダーを調べる

- `string.Formatter` は、`str.format` と同じ書式処理を自分で拡張するための標準ライブラリのクラス
  - `get_value` などを上書きすると、値の取り出し方を変えられる
  - [string --- 一般的な文字列操作（カスタムの文字列書式化）](https://docs.python.org/ja/3/library/string.html#custom-string-formatting)
- `parse(format_string)` は、`str.format` と同じ解析だけを単体で呼ぶメソッド
  - 文字列を `(地の文, フィールド名, 書式指定, 変換指定)` のタプルの並びに分解する
  - 置換フィールドを持たない部分では、フィールド名以降が `None` になる
  - [string.Formatter.parse](https://docs.python.org/ja/3/library/string.html#string.Formatter.parse)
- 使いどころ：テキストに `{name}` のようなプレースホルダーが含まれるかを、値を埋めずに判定できる
  - 例：埋め込みを含む文は毎回中身が変わるので、生成結果をキャッシュしない

```python
import string

def has_placeholder(text):
    return any(field is not None for _, field, _, _ in string.Formatter().parse(text))

has_placeholder("お名前は{name}さんですね")  # True
has_placeholder("{}さん")                    # True
has_placeholder("こんにちは")                # False
has_placeholder("{{name}}")                  # False（{{ はエスケープで、地の文の { になる）
```

- 気をつける点
  - フィールド名の真偽（`any(field for ...)`）で判定すると、`{}`（自動採番）を見落とす
    - `{}` はフィールド名が空文字列になるため（`list(string.Formatter().parse("a{}b"))` は `[('a', '', '', None), ('b', None, None, None)]`）
    - `{}` も拾うなら、`field is not None` で判定する
