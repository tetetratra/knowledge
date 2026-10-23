---
tags: "本, GHC, 型クラス, パターンマッチ, 値コンストラクタ, 多相型, 具体型, Functor, 型コンストラクタ, ファンクター, Applicative, モノイド, モナド"
---

# すごいHaskell：型やクラスを作る

- [すごいHaskellたのしく学ぼう！](https://shop.ohmsha.co.jp/shopdetail/000000001926/)
- **第7章: 型やクラスを自分で作ろう**
  - `data Bool = False | True`
  - `data Shape = Circle Float Float Float | Rectangle Float Float Float Float`
    - `Circle`を「値コンストラクタ」という
      - 普通の関数
      - `Circle`に引数を与えると「値」になる
    - `Shape`は「型」
    - エクスポートするときは
      - `Shape (Rectangle, Circle)`
      - もしくは`Shape (..)`
      - `Shape`のみ指定すれば、型は公開するけれど型コンストラクタは非公開、ができる
        - データ構造の実装を隠したいときとかに
  - レコード構文
    - `data Person = Person String String -- 名, 姓` はわかりにくい
    - `data Person = Person { firstName :: String , lastName :: String }` と書ける
      - `firstName :: Person -> String`関数が生える
    - 後述のshowの自動導出時にもこの記法でつけた名前を利用してくれる
  - `data Maybe a = Nothing | Just a`
    - `Maybe`は「型コンストラクタ」
    - `Maybe`に「型引数」を与えると「型」になる
    - `Maybe a`のような型を「多相型」という
      - `Maybe Int`は「具体型」
    - 型クラス制約はデータ宣言にはを付けず、関数の方に付ける
  - `Eq, Ord, Enum, Bounded, Show, Read`が`deriving`で自動導出できる型クラス
    - `Eq`らは「型クラス」
    - `read "Just 3" :: Maybe Int`
      - readを使うときは、型注釈で（多相型ではなく）具体型を書く必要がある
  - 「型シノニム」
    - `type String = [Char]`
    - 別名を与えているだけ。読みやすさのためにつかうもの
    - 型シノニムの多相化
      - `type AssocList k v = [(k, v)]`
  - `data Either a b = Left a | Right b deriving (Eq, Ord, Read, Show)`
    - RustのResult
  - `infixr 優先順位 中置関数名`
    - `infixr`は右結合、`infixl`は左結合
    - デフォルトは`infixr 9`
  - （木構造の定義については省略）
  - 型クラスの定義
    - `class 型クラス名 型変数 where`
    - `class Eq a where`
    - 「型変数」
      - 将来その型クラスのインスタンスとなるであろう型
    - where以降では、関数の型宣言を書く
      - 関数の実装は任意
  - 型を型クラスのインスタンスにする
    - `instance 型クラス名 型名 where`
```haskell
instance Eq (Maybe m) where
    Just x == Just y = x == y
    Nothing == Nothing = True
    _ == _ = False
```

- 型クラスのサブクラスである型クラスの定義
  - `class (Eq a) => Num a where`
- `:info 型クラス`で、型クラスの情報を見れる
```haskell
ghci> :i Num
type Num :: * -> Constraint
class Num a where
  (+) :: a -> a -> a
  (-) :: a -> a -> a
  (*) :: a -> a -> a
  negate :: a -> a
  abs :: a -> a
  signum :: a -> a
  fromInteger :: Integer -> a
  {-# MINIMAL (+), (*), abs, signum, fromInteger, (negate | (-)) #-}
        -- Defined in ‘GHC.Num’
instance Num Word -- Defined in ‘GHC.Num’
instance Num Integer -- Defined in ‘GHC.Num’
instance Num Int -- Defined in ‘GHC.Num’
instance Num Float -- Defined in ‘GHC.Float’
instance Num Double -- Defined in ‘GHC.Float’
```

- Functor型クラス
  - 全体を写せる(map over)もの
```haskell
class Functor f where
    fmap :: (a -> b) -> f a -> f b
```

```haskell
instance Functor Maybe where
    fmapf (Just x) = Just (f x)
    fmap f Nothing = Nothing
```

- 上の例で、Maybeという型コンストラクタを指定しているのに注意というか着目というか
- 「kind」
  - 「種類」
  - 型の型、のようなもの
  - `:k 型名`で型の種類を調べられる
```haskell
ghci> :k Int -- Intは「型」
Int :: *
ghci> :k Maybe -- Maybeは「型コンストラクタ」
Maybe :: * -> *
ghci> :k Maybe Int
Maybe Int :: *
ghci> :k Either -- Eitherも「型コンストラクタ」
Either :: * -> * -> *
```

- `*`は具体型を表す記号
- 型クラスに対してkindを調べると？
```haskell
ghci> :k Functor
Functor :: (* -> *) -> Constraint
```

- `Constraint`は「型制約種」というらしい？よくわからない
  - [About kind system of Haskell (Part 1) - Haskell-jp](https://haskell.jp/blog/posts/2017/10-about-kind-system-part1.html)
  - [Haskellの種(kind)について (Part 2) - Haskell-jp](https://haskell.jp/blog/posts/2017/13-about-kind-system-part2.html)
