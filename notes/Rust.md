---
tags: "プログラミング言語, Rust, 線型型, 所有権"
---

# Rust

- [refパターン - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/scope/borrow/ref.html)
```rs
// A `ref` borrow on the left side of an assignment is equivalent to
// an `&` borrow on the right side.
// 左辺に`ref`をつけることによる借用と、右辺に`&`をつけることによる借用は等価
let ref ref_c1 = c;
let ref_c2 = &c;


```

- https://keens.github.io/blog/2020/01/26/uwasanoveronawonagametemiru/
  - > Rustでいう所有権は型理論では線型型と呼ばれています。 なので所有権システムを持つことを線形性があるなんて言ったりします。
- 構造体のフィールドの一部を更新したいとき
- https://rust-unofficial.github.io/patterns/
