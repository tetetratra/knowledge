---
tags: "本, GHC, 型クラス, パターンマッチ, 値コンストラクタ, 多相型, 具体型, Functor, 型コンストラクタ, ファンクター, Applicative, モノイド, モナド"
---

# すごいHaskellたのしく学ぼう！

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
- **第2章: 型を信じろ！**
  - `:t`で、式の型を知れる
  - 「多相的関数」
    - 型変数を用いた関数
  - 「型クラス」
    - Rustのトレイトと同じ
  - `ghci> :t (==)`
    - `(==) :: Eq a => a -> a -> Bool`
      - 「型シグネチャ」という
    - この`=>`の右の`Eq a`は「型クラス制約」
      - 型`a`は型クラス`Eq`のインスタンスでなければならない、という意味
  - 型クラスいろいろ
    - `Eq`
      - `==`, `/=`
    - `Ord`
      - `compare`, `<`, `<=`, ...
    - `Show`
    - `Read`
      - evalできるもの
      - `read :: (Read a) => String -> a`
    - `Enum`
      - 列挙できるもの
      - `succ`, `pred`
    - `Bounded`
      - 上限と下限を持つもの
      - `minBound`, `maxBound`
        - `minBound :: Bounded a => a`
    - `Num`
      - 数字は多層定数として表現されている
        - `123 :: Num a => a`
    - `Floating`
      - `sin :: Floating a => a -> a`
    - `Integral`
      - 整数
      - `fromIntegral :: (Integral a, Num b) => a -> b`
        - `Integral`型クラスから`Num`型クラスに緩める関数?
        - `fromIntegral (length [1,2,3,4]) + 3.2`のように使う
  - 「型注釈」
    - 式の終わりに`::`をつけ、その後に式の型（型注釈）を指定
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
- **第6章: モジュール**
  - `Prelude`というモジュールが、デフォルトでインポートされている
    - `map`, `even`, `==`とかは全部`Prelude`モジュールの関数
  - `import モジュール名`
  - [Introduction | Hackage](https://hackage.haskell.org/)
    - >Hackage: The Haskell Package Repository
  - [Hoogle](https://hoogle.haskell.org/)
    - >関数名、モジュール名、はては型シグネチャからも検索できる、とても素晴らしいHaskell検索エンジンです。
  - `import Data.List (nub, sort)`で一部をインポート
  - `import Data.List hiding (nub)`で一部を除いたすべてをインポート
  - `import qualified Data.Map`で完全修飾名じゃないと呼べなくする
  - `import qualified Data.Map as M`で別名
  - `Data.List`
    - リストに対する関数群
    - `words`
    - `group`
      - Rubyのchunk
    - `sort`
    - `tails [1,2,3,4,5] -- [[1,2,3,4,5],[2,3,4,5],[3,4,5],[4,5],[5],[]]`
    - `foldl'`
      - foldlの正格評価版
        - 正格評価される関数をユーザー側で定義したいときはどうするんだろう
      - スタックのオーバーフローを防ぐために使う
    - `find :: Foldable list => (item -> Bool) -> list item -> Maybe item`
    - `lookup :: Eq key => key -> [(key, value)] -> Maybe value`
  - `Data.Char`
    - `ord 'a' -- 97`
    - `chr 97 -- 'a'`
    - `digitToInt`
    - `isDigit`
  - `Data.Map`
    - 連想配列(リスト)
    - `fromList :: Ord k => [(k, a)] -> Map k a`
    - `fromListWith`
      - キーの重複を排除しない版
    - `insert :: Ord k => k -> a -> Map k a -> Map k a`
    - `size`
  - モジュールを自作
    - ファイル名は`モジュール名.hs`にする
    - `module モジュール名 (公開したい関数, ...) where`
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
- **第8章: 入出力**
  - `helloworld.hs`のコンパイルには`ghc --make helloworld`
  - `putStrLn :: String -> IO ()`
    - `foo <- putStrLn "Hello, what's your name?"`
    - `putStr`, `putChar`もある
  - `getLine :: IO String`
    - `name <- getLine`
  - >I/O アクションから値を取り出すには、他の I/O アク ションの中で `<-` を使って名前に束縛するしかありません
  - `let`
    - >`<-` が I/O を実行してその結果を名前に束縛 するのに対し、
    - >`let` は I/O アクションの中で普通の値に名前を与えたいときに 使います。これはリスト内包表記における let 構文に似ています
  - `return :: Monad m => a -> m a`
    - 純粋な値からI/Oアクションを作る
    - 無の値にはvoid`()`がある
  - `print :: Show a => a -> IO ()`
    - 便利そう
  - `when :: Applicative f => Bool -> f () -> f ()`
    - `import Control.Monad`が必要
    - falseのときに`return ()`をしてくれる便利関数
  - `sequence :: (Traversable t, Monad m) => t (m a) -> m (t a)`
    - `sequence $ map print [1,2,3,4,5]`
  - `mapM :: (Traversable t, Monad m) => (a -> m b) -> t a -> m (t b)`
    - `mapM print [1,2,3] :: IO [()]`
  - `mapM_ :: (Foldable t, Monad m) => (a -> m b) -> t a -> m ()`
    - `mapM_ print [1,2,3] :: IO ()`
  - `forever :: Applicative f => f a -> f b`
    - IOアクションを永遠に繰り返す
  - `forM`
    - `mapM`と引数の順序が逆になっていて、for-each文っぽく書ける
- **第9章: もっと入力、もっと出力**
  - `getContents :: IO String`
    - 遅延IO
  - `unlines :: [String] -> String`
  - `interact :: (String -> String) -> IO ()`
    - `main = interact (String -> String の関数)`のように書ける
  - `System.IO`モジュール
    - `openFile :: FilePath -> IOMode -> IO Handle`
```hs
ghci> :i IOMode
type IOMode :: *
data IOMode = ReadMode | WriteMode | AppendMode | ReadWriteMode
ghci> :t ReadMode
ReadMode :: IOMode
```

- `withFile :: FilePath -> IOMode -> (Handle -> IO r) -> IO r`
  - 最後の引数をラムダ式にするとスッキリ書ける
- `Control.Exception`
  - `bracket :: IO a -> (a -> IO b) -> (a -> IO c) -> IO c`
    - リソース→リソースを開放する関数→リソースを操作する関数→リソース
    - 2つ目の引数がfinally句のようなものになっている
- `readFile :: FilePath -> IO String`
- `writeFile :: FilePath -> String -> IO ()`
  - 追記版の`appendFile`もある
- `openTempFile`
- （メモアプリ作成の節はスキップ）
  - `getArgs`
  - `getProgName`
  - `System.Random`
    - [Haskellの最近の乱数生成事情について](https://zenn.dev/autotaker/articles/random-1-2-is-awesome)
      - 今は別のものが使われている？
        - `import System.Random`ができなかったので
    - `random :: (RandomGen g, Random a) => g -> (a, g)`
      - `RandomGen`型クラス
        - ランダムの源
        - 乱数ジェネレータ
        - `StdGen`型が実装している
      - `Random`型クラス
        - ランダムな値になることができる型
        - 数値とか真偽値とか
    - （残りは省略）
  - `bytestring`
    - 正格
      - `Data.ByteString`
    - 遅延
      - `Data.ByteString.Lazy`
      - 64KBごとに格納される
      - `pack :: [Word8] -> ByteString`
        - `Word8`型
          - 8ビット符号なし整数(0~255)
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
