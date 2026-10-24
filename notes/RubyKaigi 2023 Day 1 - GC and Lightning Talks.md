---
tags: "RubyKaigi, Ruby, RubyKaigiA, Matz Keynote Yukihiro \"\"Matz\"\" Matsumoto, The future vision of Ruby Parser Yuichiro Kaneko, PEG, RubyKaigiB, Understanding the Ruby Global VM Lock by observing it, \"Ractor\" reconsidered, MaNy, Plug & Play Garbage Collection with MMTk, Lazy Sweep, 世代別GC, ライトバリア, Incremental Marking, VWA, Immix, Scala, GHC, Rubinius, Inko, LXR, MMTk, Lightning Talks, RubyKaigiC, Implementing \"\"++\"\" operator, stepping into parse.y, Yet Another Ruby Parser, Splitting: the Crucial Optimization for Ruby Blocks Benoit Daloze, Reading and improving Pattern Matching in Ruby, Fitting Rust YJIT into CRuby Alan Wu, Tips and Tricks for working in the MRI Codebase, Optimizing YJIT’s Performance, from Inception to Production Maxime Chevalier-Boisvert, Ruby JIT Hacking Guide"
---

# RubyKaigi 2023 Day 1: GCとLightning Talks

- [since:2023-05-11_16:00:00_JST until:2023-05-11_16:30:00_JST  - Twitter検索 / Twitter](https://twitter.com/search?q=since%3A2023-05-11_16%3A00%3A00_JST%20until%3A2023-05-11_16%3A30%3A00_JST%20%23RubyKaigiB&src=typed_query&f=live)
  - (B) EN  Plug & Play Garbage Collection with MMTk Matt Valentine-House @eightbitraptor
    - スライド：https://www.eightbitraptor.com/presentations/RubyKaigi2023-mvh.pdf
    - 1995 Ruby 0.95
      - 最初期のGC
**gc.c**

```
typedef struct RVALUE {
  union {
    struct {
      VALUE flags;		/* always 0 for freed obj */
      struct RVALUE *next;
    } free;
...
```

- `RVALUE *freelist`というものがあって、中身は↑のリスト
  - ヒープのうち、空いているスロットをポインタでつなげたLinkedList (のrootを指している)
- Rootから、マークされなかったモノをfreelistとしてつなげる
  - ![図](../assets/9f59a12457137bea2c1bfd657d014d4234e03345327898f478914a2af82f3530.png)
- 2011 Ruby 1.9.3
  - Lazy Sweep の導入
    - Sweepちょちょっとずつおこなって、Markは一気やる
    - ![図](../assets/a200b9db7614d8e11ccad175c8e9aeb8f52a62dc06bd7519314cd24ba8ef386b.png)
      - mutatorというのはユーザーのコードの実行などの、オブジェクトの生成や破棄をするもの
- 2013 Ruby 2.1
  - 世代別GC (Generational GC)
    - MinorMark と MajorMark
  - ライトバリア
    - オブジェクトへの書き込みを検知する機構のこと
    - C拡張のオブジェクトはUnprotectedであり、Unprotectedなオブジェクトはoldには決してならない(常にyoung)
    - (既存のC-extなどへの)後方互換性を保っているが、パフォーマンスを犠牲にしている
- 2014 Ruby 2.2
  - Incremental Marking
  - MinorMarkとMajorMarkとSweepingがあって、どれもちょっとずつ
  - ![図](../assets/9fd73da305d0ce9edee3c08651d3f82a572946045c9232f37712f4ceeef9f8a2.png)
- 2019 Ruby 2.7
  - Compaction
  - ヒープが少しで済む、局所性が上がる、CoWのパフォーマンスが上がるなどのメリット
  - C-ext によって作られたオブジェクトは常にpinned(固定)(compactionされない)
- 2020 Ruby 3.0
  - Automatic Compaction
  - 2.7は手動でcompactionしていたが、3.0からは自動になった (?)
  - スイープ中であってもオブジェクトの変更ができるようになった(?)
- 2022 Ruby 3.2
  - variable width allocation (VWA)
  - improve mutator performance
  - improve date locality
  - fewer external allocations
- 2023 ?
  - RubyGCは30さい
- Immix
  - [Immix: a mark-region garbage collector with space efficiency, fast collection, and mutator performance](https://dl.acm.org/doi/10.1145/1379022.1375586) で提案された手法
  - GCのアルゴリズムは↓の3つの組み合わせ。性能はそれぞれ。
    - Allocation
      - Free-List
      - Bump Pointer
    - Identification
      - Tracing (Implicit)
      - Reference Counting (Explicit)
    - Recaimation
      - Sweep
      - Evacuation
      - Compaction
  - Immixという、Mark-Region 方式のGC?
    - Inko, Scala Native, GHC, Rubinius
      - Inko というの言語がある https://inko-lang.org
      - Rubinius: https://github.com/rubinius/rubinius
        - >Rubinius uses a single mechanism for garbage collection, the **Immix mark-region collector.**
- LXR
  - [Low-latency, high-throughput garbage collection](https://dl.acm.org/doi/abs/10.1145/3519939.3523440)
  - 新しいGCアルゴリズムのこと
  - リファレンスカウント方式?
- MMTk
  - https://github.com/mmtk/mmtk-core
  - memory management toolkit
    - メモリマネージャー
  - 元々は Jikes RVM という JVM の一部
  - これを組み込めばいろいろな種類のGCを使うことができる？
  - いくつかの言語で取り込み済み(OpenJDK, V8, JikesRVM), 取り込み中(Julia, GHC, Ruby!)
  - rubyのmmtkブランチで試せる(linux only)
- よしあし
  - よし
    - 早くなりそう
  - あし
    - エラーのコードが複雑？
    - GCの処理は変更しづらい
- Rubyは一般的なメモリマネジメントのAPIを提供するべきか？
  - Benefits
    - GCライブラリを使える
    - mmtkとかを使える
  - Questions
    - C-ext
    - メンテナンス負担
    - パフォーマンスペナルティ
- https://wiki.eightbitraptor.com/rubykaigi-2023-references
- (A) EN/JA Lightning Talks
  - Building Ruby Native Extention using Ruby
    - **Rubyで**Rubyのネイティブextを作りたい
    - 「Rubyをx86のアセンブラにする」
    - https://github.com/katsyoshi/vaporware
    - https://blog.katsyoshi.org/blog/2023/03/21/my-hobby-is-building-vaporware/
  - RBS meets LLMs - Type inference using LLM
    - 単語の意味から型を推測できるかも？
    - だいたい上手く行った
    - FewShot
      - 模範解答を入力してから回答させる手法
      - →余分なコードも出ずにいい感じになった
  - Customize your Vim/Neovim directly with Ruby
    - vimは**高橋メソッド**に便利
    - vimscriptでrubyが書ける?
      - `rubyeval`関数
    - Ruby3.2のAbstractSyntaxTree::keep_tokensの機能を使っている
      - ノードからそのトークンを得れる機能
  - mruby VM
    - mruby
      - resgister based
        - 1個1個の命令は長くなるが、トータルの命令の量はへる
        - のぞき穴最適化がしやすい
      - ruby specialized instructinos
      - portable
    - keyboardの上で動かしたりできる
      - picorubyコンパイラでやっている人がおおいかも
  - Natsukantou the XML translator
  - BINGO!
  - Adding custom rule for Rubocop in the 2 month of employment
  - Unexplored Region - parse.y -
    - [たのしいRubyの構文解析ツアー - Speaker Deck](https://speakerdeck.com/coe401_/tanosiirubynogou-wen-jie-xi-tua)
  - Ultra-fast test-driven development
    - https://github.com/asonas/rspec-daemon
    - guradとのちがい
      - プロセス立ち上げっぱなし
        - じゃあspring gemとは何が違うのか
          - fgで起動しておいている
  - Optimizing Ruby’s Memory Layout: Variable Width Allocation
    - VWA
    - GCによるメモリレイアウトの制限
      - 40byte
        - それ以上は別の場所に置かれる
      - ↑欠点
        - キャッシュが効きにくい
        - mallocのオーバーヘッド
        - メモリの使い方が非効率的
    - そこで、VWA
      - 動的にサイズが変化するオブジェクトについて... (聞き取れず...)
  - Dividing and Managing: The Cops Squad of RuboCop RSpec Dept
  - Serverless IdP for small team
    - https://github.com/sorah/himari
