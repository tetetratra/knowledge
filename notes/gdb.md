---
tags: "C, gdb, デバッグ, MRI, CRuby, ブレークポイント"
---

# gdb

- 使い方例
  - `make miniruby && gdb ./miniruby -ex 'break c_function' -ex 'run ../ruby/test.rb'`
- [gdbのコマンド一覧](http://www.fos.kuis.kyoto-u.ac.jp/le2soft/siryo-html/node49.html)
**コマンド**

| コマンド名 | 省略形 | 動作 |
| --- | --- | --- |
| run args | r | プログラムを（引数argsで）実行する |
| break n | b n | ソースのn 行目にブレーク・ポイントを設定 |
| delete n | d n | n 番目のブレーク・ポイントを削除 |
| info breakpoints | i b | ブレーク・ポイント一覧を表示 |
| continue | c | プログラムの実行を再開 |
| step | s | ステップ・イン実行 |
| quit | q | gdbを終了 |
| backtrace | bt | バックトレース（関数呼出の履歴）を表示 |
| frame n | f n | n 番目のフレームを選択 |
| up | up | 一つ上のフレームを選択 |
| down | down | 一つ下のフレームを選択 |
| info locals | i locals | 選択中のフレームの局所変数一覧 |
| info args | i args | 選択中のフレームの実引数一覧 |
| print e | p e | 式e を評価して表示 |
| printf f ,e | printf f ,e | 式e を評価してフォーマットf で表示 |
| what e | wha e | 式e の型を表示 |
