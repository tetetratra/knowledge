---
tags: "Ruby, メソッド, pry, パフォーマンス"
---

# Rubyのメソッドと実行時の小技

`def self.f`に`private`は効かない
 `class << self`で指定する必要がある
 `Lint/IneffectiveAccessModifier`で検知できる

[ruby 1.9 を日常的に使うぼくが 1.9 の新機能を寸評する - まめめも https://mametter.hatenablog.com/entry/20090126/p1#f-29fc50d0]

オーバーライド(親のメソッドを子で再定義)したときの挙動
 メソッド検索はインスタンスを元にして行われる
 ```ruby
class A
    def f = a
    def a = "a"
  end
  class AA < A
    def a = "aa"
  end
  AA.new.f # => "aa"
```

[ご意見募集: Rubyに名前空間サポート的なものが欲しいという話 - たごもりすメモ https://tagomoris.hatenablog.com/entry/2023/05/15/174652]

[Rubyの外部コマンド実行入門について発表しました - pockestrap https://pocke.hatenablog.com/entry/2023/02/19/004700]

エラー情報を文字列に埋め込むときは`#inspect`しよう
  - `#to_s`だと情報が減る

`disable-pry`すると、サーバー再起動するまでdisableし続けてしまう問題
  - 内部実装では`ENV['DISABLE_PRY'] = 'true'`とすることでフラグを管理している
  - 元に戻し方
    - 外側から(大抵はdockerの)サーバーのプロセスの環境変数を書き換えるのは... 無理そう
    - `binding.pry`していた箇所の直前に`ENV['DISABLE_PRY'] = nil`と書けばよい

メモ化のイディオムが現代のRubyパフォーマンスに与える影響
 https://techracho.bpsinc.jp/hachi8833/2024_03_04/139605
 [オブジェクトシェイプ]、[インラインキャッシュ] とメモ化の関係
