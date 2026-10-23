---
tags: "本, GHC, 型クラス, パターンマッチ, 値コンストラクタ, 多相型, 具体型, Functor, 型コンストラクタ, ファンクター, Applicative, モノイド, モナド"
---

# すごいHaskell：アプリカティブファンクター

- [すごいHaskellたのしく学ぼう！](https://shop.ohmsha.co.jp/shopdetail/000000001926/)
- **第10章: 関数型問題解決法**
- （コーディングの練習の章なので省略）
- **第11章: ファクターからアプリカティブファンクターへ**
  - Functor型クラス再掲
```hs
class Functor f where
    fmap :: (a -> b) -> f a -> f b
```

- ファンクターは、「関数で写せるもの」「文脈を持った値」
- fmapは、箱（文脈）の中の値を`a -> b`で変換
- kindは `Functor :: (* -> *) -> Constraint`
  - Functor型クラスの型引数の型は、具体型(`*`)を1つ取るものである必要がある
    - Maybeなどのように、他の具体型(`Int`など)を1つ取るもの
- `->`は型コンストラクタ
  - 型コンストラクタなので`Maybe`とかと同じもの
  - 2つの型引数を取る型コンストラクタ
    - 2つの型引数だから`Either`のほうが近いかも
  - `(->) :: * -> * -> *`
- `fmap :: (a -> b) -> f a -> f b`は、`f`を`(->) r`に置き換えると、
  - `(a -> b) -> ((->) r) a -> ((->) r) b`となる
  - 変形して、`(a -> b) -> (r -> a) -> (r -> b)`
  - `r -> a -> b`とやっていて、これは関数合成演算子`.`と同じことをしている
- 関数ファンクター
  - ファンクターとしての関数
  - `Maybe a`は、「a型の値があるかもしれない」文脈を表していた
  - 関数ファンクター`(->) r`は、「r型の入力を与えればなにか値が帰ってくる」という文脈を表している
  - `fmap`を関数に適用すると関数合成になる
  - 「文脈」「箱」のイメージからもっと広げて、「計算」として振る舞うものがファンクターになれる
  - 「関数」で装飾されたもの
- ファンクター則
- 1. `id`でファンクター値を写した場合、ファンクター値が変化してはいけない
  - `fmap id (Just 3)`も`id (Just 3)`も同じということ
- 2. `fmap (f . g) = fmap f . fmap g` ⇔ `fmap (f . g) x = fmap f (fmap g x)`
- アプリカティブファンクター
  - `fmap (*) (Just 3) :: Num a => Maybe (a -> a)`
    - 関数がファンクター値の中に入っている
  - 型クラスApplicative
```hs
ghci> :i Applicative
type Applicative :: (* -> *) -> Constraint
class Functor f => Applicative f where
  pure :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b
```

- `pure`は、値を文脈に入れるだけのもの
- `<*>`は、「文脈に包まれた関数」と「文脈に包まれた値」を受け取り、「文脈に包まれた関数を適用した新しい値」を返す
```hs
instance Applicative Maybe where
    pure = Just
    Nothing <*> _ = Nothing
    (Just f) <*> something = fmap f something
```

- 普通のファンクター
  - >ファンクターの中に入ってしまった関数適用の結果をファンクターの外に取り出す一般的な方法はありません。
- アプリカティブファンクター
  - >1つの関数で複数のファンクターを続けざまに写せるのです!
- `<*>`は左結合
- `pure f <*> x`は`fmap f x`と等しい
- `<$>`演算子
  - fmapを演算子にしただけ
  - `(<$>) :: (Functor f) => (a -> b) -> f a -> f b`
  - `f <$> x = fmap f x`
  - 普通の3引数関数`f`を、文脈に包まれた値達`x, y, z`に対して適用したいとき、`f <$> x <*> y <*> z`のように書ける
    - `(++) <$> Just "johntra" <*> Just "volta" -- => Just "johntravolta"`
      - 普通の2引数関数(Stringの)`++`を、文脈に包まれた値`Just "johntra", Just "volta"`に対して適用している
- Applicativeのインスタンス
  - Maybe
  - リスト
```hs
instance Applicative [] where
    pure x = [x]
    fs <*> xs = [f x| f <- fs, x <- xs]
```

- 直積的
- 非決定性計算（可能性のある答をすべて提示している）
```hs
ghci> [(*0),(+100),(^2)] <*> [1,2,3]
[0,0,0,101,102,103,1,4,9]
ghci> (++) <$> ["ha","heh","hmm"] <*> ["?","!","."]
["ha?","ha!","ha.","heh?","heh!","heh.","hmm?","hmm!","hmm."]
```

- IO
- 関数`(->) r`
```hs
instance Applicative ((->) r) where
    pure x = (\_ -> x)
    f <*> g = \x -> f x (g x)
```

- `pure`について、「Applicativeな関数を作るときの引数」を包んだものだから、その作った関数は引数を無視している（`\_ -> x`となっていて変数`_`を使っていないので）
- `<*>`の復習：文脈つき関数`f (a -> b)`と文脈つき値`f a`から文脈つき値`f b`を作る
- 関数が文脈だからメタ的になっていて脳がやられる
  - TODO：後で再挑戦
- Zipリスト
  - 今までのApplicativeのインスタンスの`<*>`は、型コンストラクタごとに独自だった
  - Applicativeとしての型とApplicative則さえ満たしていれば`<*>`の実装（中身）はなんでもよかった
  - というわけで、リストをアプリカティブファンクターにする実装は他にもあり、ZipList
  - `[(+3),(*2)] <*> [1,2]`が`[4, 4]`となる`<*>`
```hs
instance Applicative ZipList where
    pure x = ZipList (repeat x)
    ZipList fs <*> ZipList xs = ZipList (zipWith (\f x -> f x) fs xs)
```

- アプリカティブ則
- 1. `pure id <*> v = v`
- 2. `s pure (.) <*> u <*> v <*> w = u <*> (v <*> w)`
- 3. `s pure f <*> pure x = pure (f x)`
- 4. `s u <*> pure y = pure ($ y) <*> u`
- アプリカティブの便利な関数
  - `liftA2  :: (Applicative f) => (a -> b -> c) -> f a -> f b -> f c`
  - `liftA2 f a b = f <$> a <*> b`
  - 型を、`(a -> b -> c) -> (f a -> f b -> f c)`とも解釈できて、こうすると「通常の2引 数関数を、2つのアプリカティブ値を引数に取る関数に昇格させる」関数、とみなせる
- `sequenceA`についての解説は省略...
