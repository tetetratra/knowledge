---
tags: "本, GHC, 型クラス, パターンマッチ, 値コンストラクタ, 多相型, 具体型, Functor, 型コンストラクタ, ファンクター, Applicative, モノイド, モナド"
---

# すごいHaskell：入出力

- [すごいHaskellたのしく学ぼう！](https://shop.ohmsha.co.jp/shopdetail/000000001926/)
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
