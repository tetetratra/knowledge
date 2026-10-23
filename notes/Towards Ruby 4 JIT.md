---
tags: "Ruby, JIT, MRI"
---

# Towards Ruby 4 JIT

- https://rubykaigi.org/2022/presentations/k0kubun.html#day1
- [https://www.youtube.com/watch?v=Cbidkl6ApMM](https://www.youtube.com/watch?v=Cbidkl6ApMM)
  - 現在のRubyのJITの一覧の解説
    - YJIT
      - 3.1x86_64, no code GC, C
      - 3.2 arm64, code GC, Rust
    - MJIT
      - 3.1portable, C
      - 3.2 Ruby
  - Ruby3.2のMJITはRubyで書ける
    - ユーザーが独自のjitを書ける
    - YJITみたく、マシンコードをDSLで書く方式
    - MJITスタイルで、CのコードをRubyの文字列として書く方式
  - Ruby 4のJITでしたいこと
    - JavaやJSくらい早くしたい
    - 即値
    - opt_* をなくしたい
    - 畳み込みしたい
    - ヒープアロケーションをなくしたい
    - スタックを積みたくない
    - Ruby → C → Rubyインライン
    - どうやるか
      - 定数
        - JITで即値化したい
      - 変数
        - JIT, ObjectShape
      - メソッド呼び出し
        - インライン化
      - GC
        - オブジェクトを生成しないようにしたい
