---
tags: "RubyKaigi 2022, Ruby, RBS, RubyVM"
---

# RubyKaigi 2022 Day 3

- **Day 3**
  - error_highlight: user-friendly error diagnostics
    - YARVバイトコードに場所情報を入れることで、どこがエラーになったのかを出すようにする
    - 3.2からは3.1よりも色々な文法にも対応した
    - Rubyの文法は伏魔殿
  - Syntax Tree
    - Rubyパーサーを取り替えるプロジェクト
    - Rubyの文法を扱うライブラリ(rubocop, solargraph等)もこれを使えるようにする
    - 壮大なプロジェクト
  - Let's collect type info during Ruby running and automaticall
    - TracePointで型情報を集められるようにする
  - Why is building the Ruby environment hard?
    - mysql2がインストールできないのは、brewで入れたmysqlが使うopensslと、Rubyが使うopensslのライブラリが違うから？
      - 最新のmysql2ではそこらへんをよしなにやってくれるらしい
    - 色々な難しさを紹介
  - String Meets Encoding
    - `String#split`の高速化
    - Cのコードを書き換えて高速化
    - 肝心な部分を聞き逃した...
  - Ruby programming with types in action
    - RBSで、関数に`self`(レシーバー)の型を書けるようになる?
      - `#sort`のselfの要素は比較可能であれ、みたいなのが書ける?
    - `# @type hoge: Integer`以外の注釈が紹介されていたけれど忘れた...
    - 色々なデモ
  - Stories from developing YJIT
    - 難しかった...
