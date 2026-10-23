---
tags: "本, Ruby, MRI, Bison, LALR, YARV, $ \\sube"
---

# Rubyのしくみ：制御構造とメソッドディスパッチ

- Ruby under a microscope
  - https://github.com/ruby/ruby
- Ruby2.0の実装を解説している
- **4章 制御構造とメソッドディスパッチ**
  - アセンブリ言語みたいな感じで条件分岐や繰り返しをしている
  - `branchif x`YARV命令
    - スタックのトップがtrueならxにジャンプ
  - `throw`YARV命令
    - ブロックでの`break`や、メソッドの`return`とかで使われる
    - YARVコードはスコープごとにある
    - YARVコードは捕捉テーブルという、そのYARVコードのある場所を指すテーブルをもっている(ブレークポインタ)
    - `throw`が呼ばれたら、親スコープの補足テーブルを見て、ブレークポインタが見つかればそこに処理を戻す。無ければ見つかるまで更に親を見ていく
  - `send`YARV命令
  - 1. YARVがsendを呼ぶ
  - 2. メソッド探索
  - 3. メソッドディスパッチ
  - 4. YARVが対象のメソッドを実行する
  - メソッドには種類がある
    - ISEQ
      - Rubyで書かれたメソッド
    - CFUNC
      - Cで書かれたメソッド
    - ATTRSET
      - `attr_writer`
    - IVAR
      - `attr_reader`
    - などなど
  - 通常のメソッド呼び出し
    - 引数を格納するローカルテーブルを作る
    - 引数の種類に応じてラベル付けされる
    - 呼び出しごとに`rb_control_frame_t`構造体で新しいスタックフレームが作られる
