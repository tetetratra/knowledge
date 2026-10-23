---
tags: "本, GHC, 型クラス, パターンマッチ, 値コンストラクタ, 多相型, 具体型, Functor, 型コンストラクタ, ファンクター, Applicative, モノイド, モナド"
---

# すごいHaskell：関数の構文・再帰・高階関数

- [すごいHaskellたのしく学ぼう！](https://shop.ohmsha.co.jp/shopdetail/000000001926/)
- **第3章: 関数の構文**
  - パターンマッチ
    - `@`でasパターン
    - `where`キーワードで、各パターン内で共通して使う値をまとめておける
  - `let パターン式 in 式`
```haskell
ghci> a = [1,2,3]
ghci> let f : r = a in r ++ [f]
[2,3,1]
```

- `ghci`ではletのinを省略できて、その場合以降の行で束縛が使える
- `case`式
  - letは束縛がほしいとき、caseはマッチしたときの対応がほしいとき、という使い分けだと思う
- **第4章: Hello 再帰！**
- **第5章: 高階関数**
  - `max :: Ord a => a -> a -> a`は`max :: (Ord a) => a -> (a -> a)`とも書ける
  - ghciで部分適用された関数を得るには、得たい関数にletで名前をつけないとエラーになる
  - `->`は右結合
    - `a -> b -> c -> d`は`(a -> (b -> (c -> d)))`
  - `flip :: (a -> b -> c) -> b -> a -> c`
  - `map :: (a -> b) -> [a] -> [b]`
  - `filter :: (a -> Bool) -> [a] -> [a]`
  - ラムダ式`(\x -> xの式)`
  - `foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b`
    - `foldl (+) 1 [2, 3, 4] -- => 10`
      - 単項演算子は括弧で囲む
      - `++`は遅いから、リストの畳み込みには右畳み込み(foldr)を使ったほうが良い
  - `foldr :: Foldable t => (a -> b -> b) -> b -> t a -> b`
    - 右畳み込みは、リストの右から走査しているわけではないので注意
    - 引数関数の型がfoldlと違う
      - foldrは引数関数の第一引数がリスト（＝今までの計算結果）
        - Rubyのreduceと同じ順番
      - foldlは引数関数の第一引数が要素（＝次の要素）
    - 無限リストを展開したときに、foldrの場合は遅延評価ができる
      - foldlでもできるけれども、foldrの引数の順序の方が自然
      - こういうこと
```haskell
ghci> foldr1 (\x y -> x && y) (repeat False)
False -- 終わる
ghci> foldr1 (\x y -> y && x) (repeat False)
-- 永遠に終わらない
```

- `foldr1 (&&) (repeat False)`はFalseが返るけれどもfoldlだと終わらない
  - 「今までの計算結果」が左辺にあり、Falseなとき、`&&`は右辺を見るまでもなくFalseを返せるから
- `scanr :: (a -> b -> b) -> b -> [a] -> [b]`
  - 畳み込みの中間結果をリストにして返す
  - `scanl`も
- `takeWhile`
- `($) :: (a -> b) -> a -> b`
  - 右結合
  - 優先順位が低いことを利用して、括弧のないプログラムにできる
- `(.) :: (b -> c) -> (a -> b) -> a -> c`
  - 右結合
  - `f . g`で`\x -> f (g x)`となる
- [演算子 - ウォークスルー Haskell](http://walk.northcol.org/haskell/operators/)
