---
tags: "末尾呼び出し, 末尾呼び出し最適化, 末尾再帰, Scheme, スタック割り当て"
---

# Efficient Stack Allocation for Tail-Recursive Languages

- https://dl.acm.org/doi/10.1145/91556.91603
- 1990
```scheme
(define (f a)
  (define (g)
    a) ; fの引数aを参照
  (g))
```

- ↑のように，末尾呼び出しをしたフレームをすぐには破棄できないケースがあることについて議論している論文
- [![図](../assets/39da43280e47b51942fc697fe92fcffe4860d11df806616c4ec356a77d55e7e4.png)]
  - Activation records created by evaluation of the expression `(accuaulate + 0 '(1 2 3))` when accurtiate is compiled using non-tail-recursive methods.
