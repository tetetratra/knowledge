---
tags: "ラムダリフティング, クロージャ変換"
---

# lambda-lifting

- クロージャ変換とは別物?
  - 実現したいことは一緒そう
  - [ラムダリフティング-ウィキペディア](https://en.wikipedia.org/wiki/Lambda_lifting)
    - >**ラムダリフティングはクロージャ変換と同じではありません**。
    - >すべての呼び出しサイトを調整する必要があり（呼び出しに引数を追加する）、リフトされたラムダ式のクロージャを導入しません。
    - >対照的に、**クロージャ変換では**呼び出しサイトを調整する必要はありませんが、自由変数を値にマッピングする**ラムダ式のクロージャが導入されます**。
- クロージャ変換では、「環境」を1個引数に追加していたけれども、lambda-liftingでは、自由変数をそれぞれ引数に追加している？
  - ↓wikipedeaより
```js
function sum(n) {
    function f(x) {
        return n + x;
    }

    if (n == 1)
        return 1;
    else
        return f(sum(n - 1));
}
// After converting the free variable n to a formal parameter w
function sum(n) {
    function f(w, x) {
        return w + x;
    }
    if (n == 1)
        return 1;
    else
        return f(n, sum(n - 1));
}
// After lifting function f into the global scope
function f(w, x) {
    return w + x;
}
function sum(n) {
    if (n == 1)
        return 1;
    else
        return f(n, sum(n - 1));
}







```
