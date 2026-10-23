---
tags: "RubyKaigi, Ruby, RubyKaigiA), Matz Keynote Yukihiro \"\"Matz\"\" Matsumoto, The future vision of Ruby Parser Yuichiro Kaneko, PEG, RubyKaigiB, Understanding the Ruby Global VM Lock by observing it, RubyKaigiA, \"Ractor\" reconsidered, MaNy, Plug & Play Garbage Collection with MMTk, Lazy Sweep, 世代別GC, ライトバリア, Incremental Marking, VWA, Immix, Scala, GHC, Rubinius, Inko, LXR, MMTk, Lightning Talks, RubyKaigiC, Implementing \"\"++\"\" operator, stepping into parse.y, Yet Another Ruby Parser, Splitting: the Crucial Optimization for Ruby Blocks Benoit Daloze, Reading and improving Pattern Matching in Ruby, Fitting Rust YJIT into CRuby Alan Wu, Tips and Tricks for working in the MRI Codebase, Optimizing YJIT’s Performance, from Inception to Production Maxime Chevalier-Boisvert, Ruby JIT Hacking Guide"
---

# RubyKaigi 2023 Day 3: Ruby JIT

- **Day3**
  - (A) EN Ruby Committers and The World CRuby Committers @rubylangorg
    - new committers
      - matt valentine-houserさん
        - shopyfy, yjit
      - makenowjustさん
        - regexの人
  - (A) EN Ruby JIT Hacking Guide Takashi Kokubun @k0kubun
    - スライド：https://speakerdeck.com/k0kubun/rubykaigi-2023
    - リポジトリ：https://github.com/k0kubun/ruby-jit-challenge
    - Ruby3.3 RJIT
    - `--yjit-dump-disasm`
    - x86のアセンブリをRubyでかいて`pack('*c')`してfiddleで読み込めば実行できる
    - 独自のjitを作ればfibonattiとかはYJITより早くできる?
    - メソッドの中身を置き換えられて、Intergerの`+`メソッドのバリデーションを外したりできる？
    - 定数もできる
    - https://twitter.com/kokuyouwind/status/1657266997338714112?s=20
      - >「Optimizing Ruby JIT。side exitsがとても重要」 ちょっと聞き取りきれてないけどメモリページをまたぐときにジャンプが必要でオーバーヘッドがかかるって話？
        - > Fixnum+Fixnumの結果が64bit signed intをoverflowしたときに、結果をBignumにしないといけないって話だと思います (@nalsh)
    - `stack[0]`がレジスタみたいな話をしているけれどもよくわからん
    - Ploymorphic method cache
      - ブロックのiseqが違う`each`について、インライン化できたりもするらしい?
- [RubyKaigiでJITコンパイラの書き方について発表した - k0kubun's blog](https://k0kubun.hatenablog.com/entry/2023/05/18/171546)
