---
tags: "プログラミング言語, iOS, UIKit, SwiftUI, MVVM, Swift Combine, Swift"
---

# Swift

- https://developer.apple.com/jp/
  - appleの開発者向けページ
  - フォーラムページ：https://developer.apple.com/forums/
- [Learn swift in Y Minutes](https://learnxinyminutes.com/docs/swift/)
- 文法基礎
  - 辞書も配列も`[]`リテラルで作る
  - 基本的には仮引数の名前を指定して関数呼び出しをする
    - `multiply(_ a: Int, by b: Int)`のように定義すると、`a`は指定なしで呼べて、`b`は`by`という指定で呼べるようになる
      - `multiply(3, by: 5)`
      - 関数を呼ぶ側と呼ばれる側で、キーワード引数の名前を変更できるということ
- [Kotlinのラムダ式とSwift 3.0のクロージャ式の比較 | DevelopersIO](https://dev.classmethod.jp/articles/kotlin-swift-lambda/)
```swift
// any関数の定義
// レシーバーの型こうやって書くらしい↓
public inline fun <T> Iterable<T>.any(predicate: (T) -> Boolean): Boolean {
    // thisはキーワード**ではなく**、Iterable型が用意してくれた拡張関数というもの。
    // イテレータブルオブジェクトを指すgetterのようなものだと思う。
    for (element in this) if (predicate(element)) return true // 1行ifがあるっぽい?
    return false
}

let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]

// 何も省略しない、定義通りの形
// 引数名指定してラムダ式は{}で括って作ってラムダ式の型も引数もちゃんと書いている
names.any(f: { (element: String) -> Bool in return element.isEmpty })

// 型は推測できるため、省略可能
names.any(f: { element in return element.isEmpty })

// returnは一行だけなら省略可能
names.any(f: { element in element.isEmpty })

// 指定しない場合、デフォルトで$0,$1..$nで受け取ることできる
names.any(f: { $0.isEmpty })

// 最後の引数が()の場合、 ()は省略可能
names.any{ $0.isEmpty }

```

- UIKitとSwiftUI
  - [UIKitとSwiftUI、どちらから学習するべきか \| One Tech Blog](https://tech.gmogshd.com/uikit_swiftui/)
  - UIKit
    - UIの記述にStoryboard/XIB（xmlファイル）を利用
    - コードのみの実装も可能だがコード量が増える
    - APIが豊富で使える機能が多い
    - 長い歴史があり、iOS12以前にも対応
  - SwiftUI
    - UIを宣言的に記述する
    - プレビュー機能がある
    - iOS13以降でしか使用できない
- protocol
  - いわゆるインターフェース
- UseCase
  - クリーンアーキテクチャのUseCase層?
  - 永続化したデータにアクセスするためのインターフェースのようなもの?
  - publisherというクラスのインスタンス? を持っていることが多そう
- R.swift
  - コード生成ツール
  - `R.` から始まるなにか
  - コードからxibファイルを得るときに文字列じゃなくてメソッドで得れたりするらしい?
  - 色の定数化にも使ったりする
- xib
  - ファイルの拡張子
  - xml形式
  - GUIでレイアウトしたUIをxibファイルに変換できるのか...?
- viewModel
  - Model-View-ViewModel (MVVM) のVM部分
- Computed Property
  - インスタンス生成時に値が生成されるプロパティー
  - `{}`の中に計算ロジックを書くような記法で初期化する
- `.`から始まるコード
- `式1 ?? 式2` ＝ Nil Coalescing Operator
  - nilのときには式2
- guard文
  - `guard 条件式 else { falseの場合に実行される文 }`
- `@MainActor`
  - メインスレッドで実行するように強制
- struct定義内のinit関数はイニシャライザ
- `&変数名`は参照渡し
- Publisherとかの単語はSwift Combineのやつ
  - RxSwiftのようなもの?
- `[unowned self]`
  - [普段なにげなく書いているunowned selfの意味を調べる  - Qiita](https://qiita.com/shimesaba/items/f433de0850bf09a1d50d)
  - selfはキーワード
    - 現在のインスタンスや型を指す
  - unownedもキーワード
    - 弱参照で参照する
      - ので、(この例だと)selfが既に解放されている状態でクロージャが実行される場合はクラッシュするらしい
  - `[変数名]` は キャプチャという機能
    - クロージャの内側で`変数名`に代入しても、外側の`変数名`には影響しなくなる
    - クロージャが作られた時点での`変数名`の値が、クロージャ実行時に使われる
- `@escaping`
  - 関数の引数宣言部分のクロージャに付ける属性
  - (引数の)クロージャを、その関数の外側に持っていってもコンパイルエラーにならなくなる
  - `@escaping`で受け取ったクロージャは、クロージャ生成時にクロージャが持っていた環境を捨てているっぽい
- `var parameters: [String: Any] = [:]`
  - 空の辞書を作成
  - `parameters["count"] = count` のような感じで辞書にキーを追加できる
- `sink`
  - combineの関数
  - 引数にSubscriberを受け取る
    - クロージャとしてそのままSubscriberを書くことが多そう
      - `publisher.sink { string in ... }`
- enumの定義
```swift
enum EnumName: RawValueType, Protocol1, Protocol2, ... {
    // ケースやプロパティの宣言
    case keyName = "value"
}
```

- `@Published private(set) var count: Int64 = 0`
  - `@Published`
    - この値に変更があったら(combineが)自動でpublishする
  - `private(set)`
    - 読み込みはどこからでもOK. 書き込みは同一ファイルからのみ
- `?.`
  - `result?.count`のように使う
  - Optionalな型の値に対して使い、nilでなければプロパティを返し、nilならnilを返す
  - 戻り値は`Optional<countの型>`となる
  - Rustの`?`と違い、returnはしない
- `@propertyWrapper`
  - 変数の参照・代入時にhookできる機能
  - C++とかにありそう
  - 利用例：[SwiftのProperty Wrapperを利用してDIする  - Qiita](https://qiita.com/imk2o/items/9708a39de1b7d3b2a5f8)
- [VSCodeでSwift5.1のSourceKit-LSPを動かす - しおメモ](https://scior.hatenablog.com/entry/2019/10/27/215827)
  - sourcekit-lspはDockerを使ってビルドもできる
- [XcodeでSwift Package Manager実用段階 - クックパッド開発者ブログ](https://techlife.cookpad.com/entry/2022/06/01/090000)
  - > 本来のSwift Package ManagerがSwiftプロジェクトの一部です。コマンドラインでswift packageで使えます。活用するプロジェクトの構成をPackage.swiftで定義します。
  - >ですが、今回話したいのはSwift Package ManagerのパッケージをXcodeのプロジェクトで使う時の話です
  - >依存されているパッケージのプロジェクト構成がPackage.swiftで定義されていますが、メインのプロジェクトの構成がXcodeプロジェクト(xcworkspaceまたはxcodeproj)で定義されています。
- モジュールとは、再配布可能なプログラムの単位
  - パッケージ：(ビルドターゲット：モジュール)＝1：多(1：1)
- Package.swift
  - マニフェストファイル
  - ビルドターゲットの定義(名前や依存関係)を書き連ねていく
  - パッケージに対して1ファイル作る(ファイル名の通り)
