---
tags: "Ruby, Refinement, パターンマッチ"
---

# Rubyの構文とRefinement

- キーワードに特別扱いされているメソッド
  - とは
    - キーワードというかRubyのトークンというか構文というか
    - そのメソッドを書き換えたらキーワードを使った処理に影響が出るもの
    - obj.singleton_classを上書きしても`class << obj`内でのselfはobjだから、`class << obj`構文は`singleton_class`を特別扱いしているわけじゃない、のような
  - メソッド
    - `each`: for in
    - `===`: case when
    - `deconstruct`, `deconstruct_keys`: case in
    - `to_ary`: splat展開(配列)
    - `to_hash`: splat展開(ハッシュ)
    - `to_s`: 文字列リテラル内の式展開 `"1#{2}3"`

[Rubyパターンマッチを闇の力でアクティブにする | 黒曜の吹き溜まり https://blog.kokuyouwind.com/posts/2019/11/ruby%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3%E3%83%9E%E3%83%83%E3%83%81%E3%82%92%E9%97%87%E3%81%AE%E5%8A%9B%E3%81%A7%E3%82%A2%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%81%AB%E3%81%99%E3%82%8B/]

[RubyのRefinement（翻訳: 公式ドキュメントより）｜TechRacho by BPS株式会社 https://techracho.bpsinc.jp/hachi8833/2017_03_23/37464]
 >(#usingで)refinementを有効にできるスコープは次の3つです。
  > トップレベル
  > クラス内
  > モジュール内
 > メソッドのスコープ内ではrefinementを有効にできません。
 > refinementが有効なのは、現在のクラス定義またはモジュール定義が終わるまでの間です。
 > **トップレベルの場合は、現在のファイルの最下部まで**となります。

昔のRubyをとれるサイト
 https://cache.ruby-lang.org/pub/

[refinement]の細かい制約とか詳しく書いてある
 [【Ruby Advent Calendar 2018】あなたのしらない Refinements の世界【3日目】 - Secret Garden(Instrumental) https://secret-garden.hatenablog.com/entry/2018/12/03/231925]
