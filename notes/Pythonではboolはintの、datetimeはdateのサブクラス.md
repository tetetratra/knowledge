---
tags: "python, 型, attrs, バリデーション"
---

# Pythonではboolはintの、datetimeはdateのサブクラス

- Python の `bool` は `int` のサブクラスで、`datetime.datetime` は `datetime.date` のサブクラス
  - そのため `isinstance(True, int)` も `isinstance(datetime.now(), date)` も True になる
  - [Python 組み込み型「数値型」](https://docs.python.org/ja/3/library/stdtypes.html#numeric-types-int-float-complex)（bool は int のサブタイプ）
  - [datetime モジュール](https://docs.python.org/ja/3/library/datetime.html)（`class datetime(date)`）
- 起きること：整数だけ、日付だけを受け付けたい検証が、`bool` や `datetime` を通してしまう
  - attrs の `validators.instance_of(int)` も `isinstance` で判定するので、`True` が通る
  - [attrs の validators.instance_of](https://www.attrs.org/en/stable/api.html#attrs.validators.instance_of)
- 厳密に区別したいときは、型そのものを比べる
  - `type(value) is int`、`type(value) is date`
  - attrs なら、`instance_of` の代わりに自作の validator で `type(value) is ...` を確かめる
- 逆に `bool` を先に判定すれば、`isinstance` のままでも分けられる
  - `match` の型パターンも `isinstance` で判定するので、`case bool():` を `case int():` より前に書く
