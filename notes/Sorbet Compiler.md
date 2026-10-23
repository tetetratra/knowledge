---
tags: "Sorbet, LLVM, Ruby"
---

# Sorbet Compiler

- [Sorbet Compiler: An experimental, ahead-of-time compiler for Ruby · Sorbet](https://sorbet.org/blog/2021/07/30/open-sourcing-sorbet-compiler)
- >過去1年間、SorbetチームはSorbetとLLVMを利用したRuby用の実験的な先行時間コンパイラの開発に取り組んできました。今日、私たちはそのソースコードを共有します。ソースコードはGitHubの既存のSorbetのコードと一緒に、主にcompiler/のフォルダにあります。
  - ohbarye/Sorbet#61050fe774d1360000151dda
    - >コンパイラがLLVM用の中間言語を吐いて、LLVMがnative shared object (`*.so`)を生成する
    - >Rubyを使ってRubyのnative extensionが書ける
