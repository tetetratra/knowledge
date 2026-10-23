---
tags: "RubyKaigi 2022, Ruby, JIT, GC, YJIT"
---

# RubyKaigi 2022 Day 2

- **Day 2**
  - Matz Keynote
    - お金の話とか
  - Ruby debugger - The best investment for your productivity
  - Method-based JIT compilation by transpiling to Julia
    - Juliaは、型が一定であることを検知して、その情報を利用して高速化できる
      - jitが効くから？(忘れた)
    - Pythonのnumbaライブラリは、メタプロをしていないPythonを、メタプロチェックを取り除いたPythonバイトコードに変換することで高速化するライブラリ
    - RubyをJuliaに変換することで、namdaのようなことをしようというプロジェクト
    - 実際早くなっていた
  - Heaping on the complexity! An adventure in GC Compaction
    - 前半はVWAについての説明
    - 今のRubyは、`String#<<`などでオブジェクトの大きさが増えたときは、VWAから元のヒープ管理にフォールバックしている
    - GC時のtwo fingerアルゴリズムを少し変えるのと、VWAヒープ間に(データ構造の)スタック(ヒープだったかも)を用意することで、VWAヒープ間の移動をできるようにする、という発表
  - Packet analysis with mruby on Wireshark - dRuby as example
    - Wiresharkのビルド時にmrubyを含めることで
      - mrubyで書いた設定ファイルを読み込めるようになった
      - mrubyで書いた解析処理を書けるようになった
  - Ruby Committers vs The World
    - `{ it }`が入るかも
    - `Data.define, Struct.define`が入るかも
  - Implementing Object Shapes in CRuby
  - Hunting Production Memory Leaks with Heap Sampling
