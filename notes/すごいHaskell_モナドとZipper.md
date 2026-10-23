---
tags: "本, GHC, 型クラス, パターンマッチ, 値コンストラクタ, 多相型, 具体型, Functor, 型コンストラクタ, ファンクター, Applicative, モノイド, モナド"
---

# すごいHaskell：モナドとZipper

- [すごいHaskellたのしく学ぼう！](https://shop.ohmsha.co.jp/shopdetail/000000001926/)
- **第13章: モナドがいっぱい**
  - モナド
    - >「普通の値`a`を取って文脈付きの値を返す関数に、文脈付きの値 `m a`を渡したい」
    - つまり、`(>>=) :: (Monad m) => m a -> (a -> m b) -> m b` がほしい
      - バインド関数
```hs
class Monad m where
    return :: a -> m a

    (>>=) :: m a -> (a -> m b) -> m b

    (>>) :: m a -> m b -> m b      
    x >> y = x >>= \_ -> y

    fail :: String -> m a
    fail msg = error msg
```

- Maybeはモナド
```hs
instance Monad Maybe where
    return x = Just x
    Nothing >>= f = Nothing
    Just x >>= f = f x
    fail _ = Nothing
```

- `>>=`をメソッドチェーン的に使って、続けざまに値を移せる
  - これはApplicativeの`<*>`ではできないこと
    - `<*>`は右辺と左辺の両方に文脈つきの値を要求するから
- `>>`
  - `>>=`とは違い、右辺に値をうけとる
  - 文脈を考慮しつつ、文脈がOKなら（MaybeならJustなら）、右辺の値を包んだ文脈を返す
- do記法
  - `>>=`の右辺の、値から文脈付きの値を作る関数を、ラムダ式で`\x -> Just "!"`のように作ることはできて、それの連鎖を糖衣構文としたものがdo記法
```hs
foo :: Maybe String
foo = Just 3 >>= (\x ->
      Just "!" >>= (\y ->
      Just (show x ++ y)))
```

```hs
foo :: Maybe String
foo = do
    x <- Just 3
    y <- Just "!"
    Just (show x ++ y)
```

- `<-`の代入先の値は、文脈なしの普通の値
- リストモナド
  - 非決定性計算
```hs
instance Monad [] where
    return x = [x]
    xs >>= f = concat (map f xs) -- fは値を文脈付きの値（ここではリスト）にする関数
    fail _ = []
```

- do記法の最後で`return (n, ch)`のようにすることで、作られたネストされたリストがflatten(concat)されて非決定性計算ができるリストとなる
- リスト内包表記はリストモナドの構文糖衣
- `MonadPlus`型クラス
```hs
class Monad m => MonadPlus m where
    mzero :: m a
    mplus :: m a -> ma -> ma

    guard :: (MonadPlus m) => Bool -> m ()
    guard True = return ()
    guard False = mzero
```

- モノイドの性質を併せ持つモナド
```hs
instance MonadPlus [] where
    mzero = []
    mplus = (++)
```

- リスト内包表記のfilterは`guard`の糖衣構文
  - `|`の左側は`return`になっている
- **第14章: もうちょっとだけモナド**
  - Writerモナド
- **第15章: Zipper**
