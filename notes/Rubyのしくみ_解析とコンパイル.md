---
tags: "本, Ruby, MRI, Bison, LALR, YARV, $ \\sube"
---

# Rubyのしくみ：字句解析・構文解析とコンパイル

- Ruby under a microscope
  - https://github.com/ruby/ruby
  - 参考になりそうなweb記事
    - https://takatoshiono.hatenablog.com/entry/2015/12/10/200422
    - https://www.slideshare.net/yalab/ruby-61765227
    - [Rubyの定数探索の個人的な謎に迫る - Qiita](https://qiita.com/wakasa51/items/5f145380ab7bbf8fee15)
    - [YARV Maniacs 【第 11 回】 最近の YARV の事情](https://magazine.rubyist.net/articles/0041/0041-YarvManiacs.html)
      - ここのバックナンバーも
    - http://www.atdot.net/~ko1/diary/201212.html 「Ruby VM アドベントカレンダー」
    - [CRuby のおすすめソースコードリーディング方法 - Qiita](https://qiita.com/south37/items/0eb05ebf31ba6cbf53c4)
- Ruby2.0の実装を解説している
- **1章 字句解析と構文解析**
  - Bisonが、文法規則(parse.y)からパーサーコード(parse.c)を作る
  - パーサーコードが、Rubyコード(.rb)を字句解析&構文解析する
    - するとASTノードになって、それをコンパイルしてYARV命令列に変換している
  - 字句解析にLexは使っていない
  - キーワード一覧はここ https://github.com/ruby/ruby/blob/master/defs/keywords
  - Ripperというツールで字句解析結果が見れる
```ruby
require 'ripper'
pp Ripper.lex(code_str)
```

- LALR構文解析アルゴリズム
  - look ahead left to right, rightmost derivation
  - 左から右へパースしていく(L)
  - 右端導出。でボトムアップに還元していく。(R)
  - 先読みして何に還元するか判断するときもある(LA)
- rubyの`-y`オプションで、パーサーの状態遷移を見れる
- 文法規則はここらへん
  - https://github.com/ruby/ruby/blob/master/parse.y#L1295
- 構文解析の結果を見るには、`Ripper.sexp(code_str)`
- `--dump parsetree`オプションで、ASTの情報を出力できる
- **2章 コンパイル**
  - コンパイラはRuby1.9以降
  - 上から再帰的にツリーを訪れて、ASTノードをYARV命令に変換する
  - YARVはスタックマシン
  - 関数呼び出しのコンパイル
    - レシーバーをプッシュ
    - 引数をプッシュ
    - メソッドを呼び出す
      - `send`YARV命令
  - compile.cにコンパイラが実装されている
    - https://github.com/ruby/ruby/blob/master/compile.c
  - 変換されたVARV命令列を見るには
    - `RubyVM::InstructionSequence.compile(code).disasm`
  - `putobject`YARV命令でレシーバーをpush
  - レシーバが無いときは`putself`YARV命令を使って、selfポインタ(後述)の現在の値をレシーバとして使うように指示する
  - ブロックパラメータがコンパイルされると、その情報はASTの外の、ローカルテーブルという場所に保存される
  - Rubyの各スコープはそれぞれローカルテーブルをもつ
  - ブロックパラメーターの他に、ローカル変数とかの情報の保存にもこのテーブルを使う
    - テーブルの値がローカル変数なのか、メソッドの仮引数なのか、とかの情報も一緒に持っている
  - `getlocal`YARV命令列でローカルテーブルを参照する
  - 上に書いたRubyVMでYARVを見る方法で、ローカルテーブルも見れる。
