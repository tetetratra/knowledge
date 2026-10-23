---
tags: "本, Ruby, MRI, Bison, LALR, YARV, $ \\sube"
---

# Rubyのしくみ：メタプログラミング

- Ruby under a microscope
  - https://github.com/ruby/ruby
- Ruby2.0の実装を解説している
- **9章 メタプログラミング**
  - `def`でメソッドの名前だけを指定したときは、レキシカルスコープから対象のクラスを探して、メソッドテーブルに追加する
  - `def ojb.method_name`で、objの特異クラスのメソッドテーブルにメソッドを追加する
  - `class << obj`は、objの特異クラスにアクセスする手段
    - だからselfでクラスメソッドを作るとき以外でも使える
  - C言語レベルでは、特異クラスとメタクラスを区別して扱っている?
- Refinements
  - `refine`メソッドを使うと
    - 新しいレキシカルスコープを作る
    - refinementモジュールを作る
      - 作った新しいレキシカルスコープの`nd_class`に対応する
    - 作ったrefinementモジュールの`refined_class`に、refneで指定したクラス(`RClass`)が設定される
  - `using`の後で`refine`されたクラスのメソッドを呼び出すとき
    - `using`によって、レキシカルスコープの`nd_refinements`ポインタが、refineしたクラスを指すように設定される
    - 呼び出したメソッドのメソッドタイプが`VM_METHOD_TYPE_REFINED`だったなら、refineされたメソッドの方を`nd_refinements`を通して最初に探す
  - `self`には何が設定されるか
    - クラス(モジュール)のスコープ内では、selfはそのクラスを指す
    - メソッド内では、selfはメソッド呼び出し時のレシーバを指す
- メタプログラミングとクロージャ: eval, instance_eval, binding
  - `eval`は、パースをコンパイルを動的に行った後で、ブロックを作るときと同じようにクロージャを
  - `Kernel#.binding`メソッド
    - 実行した場所の環境を取得できる
    - YARVスタックや、呼ばれた場所のスタックフレームをヒープにコピーする
    - ブロックを作っているときと似ている処理
    - `rb_proc_t`ではなくて`rb_proc_t`に、`filename, line_no, env`とかを入れている
  - `self`が呼ばれたときは、`rb_control_frame_t`の`self`が呼ばれる
  - `instance_eval`
    - レシーバを`self`に設定する
    - レキシカルスコープ`cref`を作って、それが指すクラス`nd_class`はレシーバの特異クラスになる
