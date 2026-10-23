---
tags: "プログラミング言語, Ruby, pdf"
---

# Ruby

- **公式リンク集**
  - [組み込みライブラリ](https://docs.ruby-lang.org/ja/2.7.0/library/_builtin.html)
  - [標準添付ライブラリ](https://docs.ruby-lang.org/ja/2.7.0/library/index.html)
  - [るびま](https://magazine.rubyist.net/) (Rubyマガジン)
  - https://docs.ruby-lang.org/en/2.7.0
  - https://ruby-doc.org/core-2.7.0/
  - https://rubyreferences.github.io/rubyref/
  - https://docs.ruby-lang.org/en/2.7.0/
  - https://ml.ruby-lang.org/mailman3/hyperkitty/
    - ML
  - [AtCoder に登録したら解くべき精選過去問 10 問を Ruby のメソッドチェーンで解いてみた  - Qiita](https://qiita.com/phocom/items/c94a0fba2c04f9e7a8f8)
  - tmpfileとは
    - Fileと同じ様に扱える。ブロック終わったら消える
    - `Tmpfile.create('tmp'){|file| hoge }`
  - Rubyでpdfの内部情報扱う
**main.rb**

```
require 'pdf/reader'
def pdf_moddate(path)
 pdf_info = PDF::Reader.new(path).info
 return pdf_info[:ModDate]
end
pp pdf_moddate('fuga.pdf')
pp pdf_moddate('hoge.pdf')
```

[BOM]つけるRuby

**main.rb**

```
File.open('example.csv', 'w:UTF16LE') do |f|
 f.write "\uFEFF"
 f.write "あ\tい\tう\tえ\tお"
end
```

BOMつきファイルを開く
 `File.open("utf16.txt", "rb:BOM|utf16"){|file| .... }`
 https://docs.rubylang.org/ja/latest/method/IO/s/open.html

一括require
 `Bundler.require`

log同期
 `file.sync = true`
 `@logger = Logger.new(file, 7)`
 [class Logger (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/class/Logger.html]

bashで実行するrubyプログラムは、(ruby実行時ではなく)bash実行時の環境変数をみてる

ファイルの[ロック]
 https://www.buildinsider.net/language/rubytips/0023

ruby のextend
 https://qiita.com/leonjoel/items/f7c4643023f44def5ebd
 「Controllerクラス」インスタンスが、（rubyは全部インスタンス）Bbbのインスタンスメソッドを、Controllerのインスタンスメソッドとして取り込まれる。
 「Contorller#instance_method」ということで、実質クラスメソッドのようになる。

**main.rb**

```
class Controller < BaseController
 extend Bbb
end
```

ruby2.5
 https://qiita.com/jnchito/items/f182b6f0093a6a3701a1

CSVにBOMつける

**main.rb**

```
open('hoge.csv', 'w'){|f|
 bom = ["EF", "BB", "BF"].map{|e|
  e.hex.chr
 }.join
 f.puts CSV.generate(bom, {force_quotes: true}){|line|
  line << [
   'column1',
   'column2'
  ]
 }
  f.puts CSV.generate(force_quotes: true){|line|
   line << [
    'aaaa',
    'bbb'
   ]
  }
 }
}

```
`nil`も`yieald_self`使えるから`&.then`で通るバグに注意

クォートなしtsvを開いて、クォート有りcsvに変換

**main.rb**

```
require 'csv'
CSV.open("meibo2.csv", "w", force_quotes: true) do |csv|
 CSV.foreach('meibo2.txt', col_sep: "\t", quote_char: ?') do |row|
  csv << row
 end
end

=begin
quote_char: ?' は、元々のデフォルトが"で、""でミスるから。
"john","m","18"
"pau"",l","m","20"
"alice","f","15"
"dabid","m","17"
"jasmin","f","17"
=end
```

`if __FILE__ == $0` はテスト用に使える

rubyのacsessserはgettter,setterを定義しているのと同じだから，クラス内でローカル変数を呼び出すように呼べるようになる（実際にはメソッドを呼んでいる）

hashの、指定したキーが等しいか確かめるとききれいに書く
 `update_plan_job.slice(:max_n, :plan_status) == target_plan.slice(:max_n, :plan_status)`

Rubyの`at_exit{}`
 全ての終了時に処理できる

Rubyは果たして死んだのか記事
 https://tech.nikkeibp.co.jp/atcl/nxt/column/18/00138/032700259/

`gets`と`ARGV`
 併用するときは`STDIN.gets`のように、標準入力を取得すると明記しないとエラーになる

irbで、最後の式の結果は`_`変数に入る

irbで、`irb [1,2,3]`みたく打つと、その中に入れる

Fileoepnのパスの定型文
 `File.expand_path('../config/environment', __dir__)`
 第2引数を基準にして第1引数を考えたときの絶対パスを取得する。__dir__は書かれたファイルが有るディレクトリ

Ruby型チェックgem https://note.com/5f_tech/n/nec2df9f5e6a8

tmpfileで接頭辞、接尾辞をしていできる
 `Tempfile.open(['tmpfile_for_hoge', '.html']) do |file|`

rubyのhashは順序がある。(1.9から)
 コーディング規約にも、順序を信じてOKと書いてある

`OpenURI.open` の返り値は`StringIO` だけど、 `OpenURI::Meta` をextendしているから、`#meta` とかが使える
	>サーバから取得したデータの属性を扱うために使われるモジュールです。データを表す文字列や StringIO が extend します。
 [module OpenURI::Meta (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/class/OpenURI=3a=3aMeta.html]

[module Open3 (Ruby 2.2.0) https://docs.ruby-lang.org/ja/2.2.0/class/Open3.html] でターミナルコマンドのstderrとかも取れる

injectでindexも使うには
	[each_with_indexしつつinjectしたい - Qiita https://qiita.com/ymstshinichiro/items/366b738ceefd224b5d41]
	`(1..3).each.with_index.inject([]) { |r , (val, idx)| r << [val , idx] }`
		`each.with_index`で出来るのはあくまでイテレーター
		`(val, idx)`が`each.with`で出来たもの。
		`r`が`inject`のmemo側. `(val, idx)`がitem側

anddotを記号メソッドに使うには`arr&.[] ind`
 [【一人 Ruby Advent Calendar 2017】Ruby の &. 演算子【14日目】 - Secret Garden(Instrumental) http://secret-garden.hatenablog.com/entry/2017/12/15/000505]

`&&`は式、`and`は文
	https://twitter.com/yukihiro_matz/status/1242106330149605377
	()で囲めば文は式になる
	[プログラム・文・式 (Ruby 2.4.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/2.4.0/doc/spec=2fprogram.html]
	 >メソッドの引数に指定できない式は、括弧によるグルーピングを行うことで普通の式として使用することができます。

- なのでこうなる
**main.rb**

```
❯❯ p( 1 and 2 )
SyntaxError: unexpected `and', expecting ')'
p( 1 and 2 )
     ^~~
❯❯ p( (1 and 2) )
2
2  
```

RubyにはJIS規格がある
　[RubyがJIS規格「JIS X 3017」に制定：CodeZine（コードジン） https://codezine.jp/article/detail/5854]
  2013年ごろのだから古いけど
 調べればpdfが出てくるけれど、本来有料のものみたいだから正規なものかは怪しい...

モジュール関数とは
	モジュールの関数
	`Kernel.#require`とか
	モジュールだからdef self.hogeの関数作成はできなくて、moduel_methodを呼び出してから定義する。
	クラスメソッドと使われ方や見た目は同じそう

setterメソッドの呼び出しには明示的なレシーバーが必要

** setter.rb**

```
class A
  attr_accessor :var 
  def set_without_self(x)
    var = x
  end 
  def set_with_self(x)
    self.var = x
  end
end
a1 = A.new
a1.set_without_self(123)
p a1.var # => nil

a2 = A.new
a2.set_with_self(123)
p a2.var # => 123
```

`Tempfile.open{|tp| }` の tp は`tp.class #=> Tempfile` である
 TempfileはFileの移譲
  Delegatorを使った移譲
  Forwardableの移譲とは別物
  Forwardableは移譲するメソッドを指定するけど、こっちは指定しないで基本的には全部移譲

enumratorの連結ってどうやるんだろう
 `CSV.generate{|csv| ~ }`で、`csv`, `header`, `rows` を`inject(:<<)` したい。けど、連結がむずい
 lazy系を使う?

ターミナル入力操作のexpectコマンドみたいなのをRubyから扱えるライブラリ
	[IO#expect (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/method/IO/i/expect.html]

procを抜けるにはnext
 returnだと外側のメソッドを抜けてしまう

DSLのようなことをするには、`instance_eval`を使う(多分)
```ruby
class DSL
    def self.meirei(obj, &block)
      dsl = Object
      dsl.define_method(:hairetuka) do
        obj = obj.chars
      end
      dsl.define_method(:hanten) do
        obj = obj.reverse
      end
      p dsl.instance_eval(&block)
    end
  end

  DSL.meirei("123") do
    hairetuka
    hanten
  end
```

定義場所探し
 [Rubyでclassやconstの定義位置を調べる方法 - Qiita https://qiita.com/ksss/items/377eef080909564e4a25]
  pryで`show-source`
 [Rubyでメソッドの定義場所を見つける方法 - Qiita https://qiita.com/jnchito/items/fc8a61b421d026a23ffe]
  `source_location`

https://docs.ruby-lang.org/ja/latest/library/set.html
 >set ライブラリを require すると Enumerable モジュールが拡張され、Enumerable#to_set の形で集合オブジェクトを生成できるようになります。

Rubyは各々のstringごとに、自身の文字コードの情報を持っている

gsub時にエラーになるときは
	`ArgumentError invalid byte sequence in UTF-8` と出てくるとき
	`String#scrub`
		[String#scrub (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/method/String/i/scrub.html]
 [Ruby 2.1.0 に追加される不正なバイト列を除去する String#scrub の紹介 - sonots:blog http://blog.livedoor.jp/sonots/archives/34702351.html]
 [Ruby の invalid byte sequence in UTF-8 例外を encode("UTF-8", "UTF-8") で回避するのはおかしいよ、という話 - sonots:blog http://blog.livedoor.jp/sonots/archives/23652294.html]

[library kconv (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/library/kconv.html]
	>日本語文字コードの変換を手軽に行うためのライブラリです。
 > kconv を require すると String クラスに変換用のメソッドが定義されます。 Kconv にも同等のメソッドが定義されます。 Kconv にはエンコーディングを表す定数も定義されています。
 `string.tojis`

- ネットアクセス
  - open-uriライブラリで、`URI.open`が追加される
    - `URI`モジュールのメソッド
      - httpヘッダ指定できない?
    - `OpenURI.open_uri`が追加
  - `open-uri`系か、`Net::HTTP`系がある
 [RubyのHTTPリクエストをできるだけシンプルに実装する - Qiita https://qiita.com/takano-h/items/dd10818eb7e09161bc29]
 [class Net::HTTP (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/class/Net=3a=3aHTTP.html]
 [library open-uri (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/library/open=2duri.html]

`CSV`の`headers: true`オプションで、eachとかの返り値のクラスが`CSV::Row`になる
 [class CSV::Row (Ruby 3.0.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/class/CSV=3a=3aRow.html#I_HEADER--3F]
 そのままだとarray
 これは、`row[column_name]`でアクセスできる
 カラムが無いときも、CSV上で空文字のときも`nil`になってしまうので注意!
 カラムがあるか調べるには`CSV::Row#header?`

`Proc#>>` にはproc以外にも渡せる
 >Proc、Method、もしくは任意の call メソッドを持ったオブジェクト。

ハッシュで、キーが無かったら更新したいとき
 [ActiveSupportを読む: Hash#reverse_merge | TECHSCORE BLOG https://www.techscore.com/blog/2013/02/14/activesupport%E3%82%92%E8%AA%AD%E3%82%80-hashreverse_merge/]
 ActiveSupportの`reverse_merge`

structの活用
 るりまより
```ruby
Customer = Struct.new(:name, :address) do
    def greeting
      "Hello #{name}!"
    end
  end
Customer.new("Dave", "123 Main").greeting # => "Hello Dave!"
```

default gem と bundled gem
 https://secret-garden.hatenablog.com/entry/2021/07/08/204602
 [How to develop the Standard Libraries of Ruby? by Hiroshi SHIBATA - RubyKaigi Takeout 2021 https://rubykaigi.org/2021-takeout/presentations/hsbt.html]
  3.0 [https://gyazo.com/ae72428e6679dc0ec311e24b06a5b269]
- standard libraries
  - 標準添付ライブラリ
  - 変更不可
  - ruby/ruby 内
- default gems
  - gem install OK
  - ruby/ruby 内
- bundled gems
  - gem install OK
  - ruby/ruby 外
  - C拡張で書かれたものは使えない
  - Ruby公式が予めgem installしてくれているgem, ということ？
- primeは、3.1からbundled gems
```text
irb(main):002:0> RUBY_VERSION
    => "2.7.2"
    irb(main):003:0> Prime = Prime
    (irb):3: warning: already initialized constant Prime
    /Users/user/.rbenv/versions/2.7.2/lib/ruby/2.7.0/prime.rb:97: warning: previous definition of Prime was here
```
```text
irb(main):005:0> RUBY_VERSION
    => "3.1.1"
    irb(main):006:0> Prime = Prime
    (irb):6: warning: already initialized constant Prime
    /usr/local/lib/ruby/gems/3.1.0/gems/prime-0.1.2/lib/prime.rb:170: warning: previous definition of Prime was here
```

`using Module.new {}` でその場所でrefine

`ruby --dump=parsetree`で構文木を見れる

ロードパスをコマンドラインから調べるには `ruby -e 'puts $:'`
	[$-I (Ruby 3.0.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/method/Kernel/v/=3a.html]

Rakeのファイルタスクは実行されないときもある。ファイルタスクはファイルを作るタスクだから
	関連するファイルが存在しない場合
	事前タスクで作成したファイルの方が新しい場合
	[library rake (Ruby 3.0.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/library/rake.html]

[列挙型]っぽいやつはどうやって実現されているのか
	値の部分はどうなっているのか
	連番を入れているだけっぽい
 https://github.com/ruby/logger/blob/master/lib/logger/severity.rb
```ruby
module Severity
    # Low-level information, mostly for developers.
    DEBUG = 0
    # Generic (useful) information about system operation.
    INFO = 1
```

[弱参照]
 [GC]まわり
 [class WeakRef (Ruby 3.0.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/class/WeakRef.html]


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
 > [** トップレベルの場合は、現在のファイルの最下部まで]となります。

昔のRubyをとれるサイト
 https://cache.ruby-lang.org/pub/

[refinement]の細かい制約とか詳しく書いてある
 [【Ruby Advent Calendar 2018】あなたのしらない Refinements の世界【3日目】 - Secret Garden(Instrumental) https://secret-garden.hatenablog.com/entry/2018/12/03/231925]


https://workingwithruby.com/
 >このサイトでは、Ruby プログラマーにシステム プログラミングを紹介することを目的とした 3 つの電子ブックに無料でアクセスできます。
 Unix[プロセス], [TCPソケット], Ruby[スレッド]

サービスクラス配下に`Service::Result::{Error,Success,PartialSuccess}`型を作って、戻り値を代数的データ型的に扱うと格好いいかもしれない
 おのおのは抽象クラス`Service::Result`を継承する感じ

Rubyで使える[並列処理]・[並行処理]の内部実装
 [Rubyの並行処理についてまとめてみる - ユニファ開発者ブログ https://tech.unifa-e.com/entry/2021/01/29/175021]
 (OS) [Thread]
 (OS) [Process]
 (Ruby) [Fiber]
  [class Fiber (Ruby 3.1 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/class/Fiber.html]
   > Thread と違いユーザレベルスレッドとして実装されています
  [ユーザレベルスレッド], [ユーザースレッド] とは
   [スレッド (コンピュータ) - Wikipedia https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89_(%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF)#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%81%A8%E3%82%AB%E3%83%BC%E3%83%8D%E3%83%AB%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89]
    > ユーザ空間で実装されたスレッド機構をユーザースレッド、特に仮想機械上で動くものをグリーンスレッドと呼ぶ。
    >しかし、ひとつのプロセス内の複数のスレッドは常に1つだけが動作していることになり、マルチプロセッサシステムの恩恵を受けられない。
  並列ではなくて平行なので、IOバウンドな場合に恩恵があるはず
  Fiber Schedulerに関しては下にまとめてある
 (Ruby) [Ractor]
  [Ruby 3.0 の Ractor を自慢したい - クックパッド開発者ブログ https://techlife.cookpad.com/entry/2020/12/26/131858]
  Ractorは1個以上の(ネイティブ)スレッドと紐付いている?

[Fiber Scheduler]
 [Fiber Schedulerの使い方 - マイペースなRailsおじさん https://ytnk531.hatenablog.com/entry/2020/10/24/183321]
  >Fiber Schedulerは、Ruby3で追加される予定の、Fiberの新機能です。IOを扱うファイバーを複数作って、これらを適切にコンテキストスイッチしてあげると、Threadを使うよりも高い並行性を得られるという話があります。[** Fiber Schedulerは、このコンテキストスイッチを実装しやすくするための機能]で、もともとはAuto Fiberと呼ばれていました。
 Fiber Schedulerは日本語版ドキュメントにはまだ載っていないかも?
  英語版には`Fiber.schedule`が書かれている：[class Fiber - RDoc Documentation https://docs.ruby-lang.org/en/3.0/Fiber.html#method-c-schedule]
 Schedulerを作って登録して、`Fiber.schedule`を呼び出すと、IO処理ごとにSchedulerに定義したメソッドが呼ばれるので、そのメソッド内でfiberの切り替え処理を書けば、IOを並行に処理できるようになる
  従来みたく`Fiber#transfer`でfiberを切り替えるのに比べて、同じ処理(スケジューリング)を楽に書ける、という新機能らしい?
 ドキュメント：[ruby/fiber.md at master · ruby/ruby https://github.com/ruby/ruby/blob/master/doc/fiber.md#scheduler]

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
	`#to_s`だと情報が減る

`disable-pry`すると、サーバー再起動するまでdisableし続けてしまう問題
	内部実装では`ENV['DISABLE_PRY'] = 'true'`とすることでフラグを管理している
  - 元に戻し方
    - 外側から(大抵はdockerの)サーバーのプロセスの環境変数を書き換えるのは... 無理そう
    - `binding.pry`していた箇所の直前に`ENV['DISABLE_PRY'] = nil`と書けばよい

メモ化のイディオムが現代のRubyパフォーマンスに与える影響
 https://techracho.bpsinc.jp/hachi8833/2024_03_04/139605
 [オブジェクトシェイプ]、[インラインキャッシュ] とメモ化の関係

