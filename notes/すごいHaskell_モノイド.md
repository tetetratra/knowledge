---
tags: "本, GHC, 型クラス, パターンマッチ, 値コンストラクタ, 多相型, 具体型, Functor, 型コンストラクタ, ファンクター, Applicative, モノイド, モナド"
---

# すごいHaskell：モノイド

- [すごいHaskellたのしく学ぼう！](https://shop.ohmsha.co.jp/shopdetail/000000001926/)
- **第12章: モノイド**
  - `newtype`キーワード
    - 「1つの型を取り、それを何かにくるんで別の型に見せかけたい」とき
    - `newtype CharList = CharList { getCharList :: [Char] } deriving (Eq, Show)`のように
  - キーワードを整理
    - type
      - 型シノニム（新しい型はつくられない）
    - newtype
      - 既存の型を包んで新しい型を作る
    - data
      - 自作の新しいデータ型を作る
  - モノイド
    - 結合的な二項演算子
    - 単位元
  - `Monoid`型クラス
```hs
class Monoid m where
    mempty :: m
    mappend :: m -> m -> m
    mconcat :: [m] -> m
    mconcat = foldr mappend mempty
```

- モノイド則
  - `mappend mempty x = x`
  - `mappend x menpty = x`
  - `mappend (mappend x y) z = mappend x (mappend y z)`
- モノイドな型
  - リスト
  - 数
    - Product
    - Sum
    - 同じ「数」に対してProductとSumの両方のモノイドとして使いたいときは、newtype
  - Bool
    - `||`
    - `&&`
  - Ordering
```hs
instance Monoid Ordering where
    mempty = EQ
    LT ‘mappend‘ _ = LT
    EQ ‘mappend‘ y = y
    GT ‘mappend‘ _ = GT
```

- Maybe
  - 中身がモノイドのとき、Maybeもモノイドとする定義
  - 最初のJust値を得る`First`型
    - `newtype First a = First { getFirst :: Maybe a }`
  - 最後のJust値を得る`Last`型
    - `newtype Last a = First { getLast :: Maybe a }`
  - 最初の定義以外はnewtypeで新たに定義されたMaybe(の生まれ変わり)がモノイドのインスタンスとなっている
- `Data.Foldable`
  - 畳めるもの
  - `foldr`か`foldMap`を実装する
  - `foldMap :: (Monoid m, Foldable t) => (a -> m) -> t a -> m`
    - 中身`a`をモノイド`m`に変換して、それらをすべて`append`する
  - `F.foldr :: (F.Foldable t) => (a -> b -> b) -> b -> t a -> b`
    - リストのfoldrと同じ
  - 自作の木構造に使いなら
```hs
instance F.Foldable Tree where
    foldMap f EmptyTree = mempty
    foldMap f (Node x l r) = F.foldMap f l `mappend`
                             f x           `mappend`
                             F.foldMap f r

```
