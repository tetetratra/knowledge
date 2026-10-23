---
tags: "本, GHC, 型クラス, パターンマッチ, 値コンストラクタ, 多相型, 具体型, Functor, 型コンストラクタ, ファンクター, Applicative, モノイド, モナド"
---

# すごいHaskell：はじめの第一歩

- [すごいHaskellたのしく学ぼう！](https://shop.ohmsha.co.jp/shopdetail/000000001926/)
- **第1章: はじめの第一歩**
  - 1987年から開発されている
  - The Glasgow Haskell Compiler(GHC)
  - `ghci`
    - [ghci で複数行を入力する方法　:{ :} コマンド : tnomuraのブログ](https://tnomura9.exblog.jp/23586727/)
    - `:set +m`コマンド
    - `:{`コマンドと`:}`コマンド
  - `++`,`:`,`!!`,`head`,`tail`,`last`,`init`,`length`,`take`,`maximum`,`minimum`,`sum`,`elem`
  - `..`でRange
    - `[2, 4..10] -- > [2,3,6,8,10]`
      - `[]`のguardの糖衣構文っぽそう
  - `cycle`
  - `repeat`
  - `replicate`
  - リスト内包
    - `[x*2 | x <- [1..10]]`
    - `[x*y | x <- [2,5,10], y <- [8,10,11], x*y > 50]`
    - これも糖衣構文（後述）
  - タプル`()`
    - タプルと配列を別の物にしてる言語のワケがしっくりくる
  - `fst`
  - `snd`
