---
tags: "ACM, DLS"
---

# Wasm/k: delimited continuations for WebAssembly

- ACM
-  2020
- [Wasm/k: delimited continuations for WebAssembly | Proceedings of the 16th ACM SIGPLAN International Symposium on Dynamic Languages](https://dl.acm.org/doi/10.1145/3426422.3426978)
- >WebAssemblyは、JavaScriptに代わる、様々な言語のための安全で、移植可能で、効率的なコンパイルターゲットとして設計されています。高級言語の性能は、WebAssemblyの基本性能だけでなく、生成されたWebAssemblyコードの品質にも依存します。この論文では、現在のアプローチが複雑で非効率なコードを生成することによってのみWebAssemblyにコンパイルすることができる高レベル言語のいくつかの特徴を明らかにします。我々は、WebAssemblyが第一級の連続性をネイティブにサポートすれば、これらの問題に対処できることを主張する。そして、WebAssemblyを区切り付き継続で拡張するWasm/kを発表します。Wasm/kは新しい値型を導入しないので、WebAssemblyの型システム（検証）に大きな変更を加える必要はない。Wasm/kは、外来関数呼び出しがあっても安全です（例えば、JavaScriptとの間で）。最後に、Wasm/kは効率的な実装に適しています。既存のWebAssembly JITであるWasmtimeへのローカルな変更としてWasm/kを実装しました。C/C++に区切り連続を追加するC/kを実装して、Wasm/kを評価しました。C/kはEmscriptenを使用しており、その実装はWebAssemblyをターゲットとするコンパイラでWasm/kを使用する方法のケーススタディとして機能する。C/kを用いたいくつかのケーススタディを紹介し、グリーンスレッドの実装において、性能で18%、コードサイズで30%向上し、最新鋭のアプローチであるAsyncifyを凌駕することができることを示しています。
