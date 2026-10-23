---
tags: "Ruby, MRI, 例外処理, Ruby向け動的コンパイラにおける例外処理の最適化, 表引き法, setjmp法"
---

# MRIの例外処理

- 論文 Ruby向け動的コンパイラにおける例外処理の最適化 より
  - (Ruby 1.9.1)
  - >(longjmpによる) 大域ジャンプ後，setjmp() の返戻値をチェックし，返戻値が 0 以外だったら longjmp() から戻ったと判断
    - Cで実装された関数からでも例外をraiseできるようにするために、ある意味gotoであるsetjmp, longjmpを使っている
  - Rubyで書かれたコードは表引き法でエラー処理して、Cで書かれたコードはsetjmp法を使っているらしい
    - >例外処理の実現方法が仮想機械の内部と外部(C 言語で実装したライブラリ)で異なる
- `rb_jmpbuf_t rb_execution_context_struct->tag->buf`に、setjmpで登録した値(goto先)が入っていそう
- [Rubyの大域脱出はどのように実現されているか - Qiita](https://qiita.com/k0kubun/items/695a52e3f30b79746f8b)
  - (未読)
