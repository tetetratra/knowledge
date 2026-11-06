---
tags: "正規表現, Ruby, JavaScript, Unicode, バリデーション"
---

# 正規表現の空白文字クラスが含む文字はRubyとJavaScriptで違う

- 同じ `\s` でも、Ruby と JavaScript ではマッチする空白の範囲が違う
  - 入力値の前後の空白を取り除く処理や、形式チェックの正規表現を、サーバーとフロントで書き分けると、すり抜ける文字が変わる
- Ruby（Onigmo）の `\s`
  - ASCII の空白（`[ \t\r\n\f\v]`）だけにマッチする
  - 全角空白（U+3000）やノーブレークスペース（U+00A0）にはマッチしない
  - Unicode の空白まで対象にするなら `[[:space:]]` や `\p{Space}` を使う
  - [Ruby リファレンスマニュアル「正規表現」](https://docs.ruby-lang.org/ja/latest/doc/spec=2fregexp.html)
  - `String#strip` が取り除くのも ASCII の空白とヌル文字だけ
- JavaScript の `\s`
  - Unicode の空白（全角空白、ノーブレークスペース、BOM の U+FEFF など）と改行文字にマッチする
  - [MDN「文字クラスエスケープ」](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Regular_expressions/Character_class_escape)
- ゼロ幅スペース（U+200B）はどちらの `\s` にもマッチしない
  - Unicode の分類では空白（White_Space）ではなく書式文字（Cf）のため
  - コピー＆ペーストで混ざりやすいので、除去したいなら文字を明示して取り除く
- 例：末尾に空白類が付いたメールアドレスを `/\A[^@\s]+@[^@\s]+\z/` で検証した場合
  - Ruby では、末尾の全角空白、ノーブレークスペース、ゼロ幅スペースがすべて通る
  - JavaScript の同等の正規表現では、全角空白とノーブレークスペースは弾けるが、ゼロ幅スペースは通る
