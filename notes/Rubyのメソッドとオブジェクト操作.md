---
tags: "Ruby, メソッド, オブジェクト指向"
---

# Rubyのメソッドとオブジェクト操作

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
  - モジュールの関数
  - `Kernel.#require`とか
  - モジュールだからdef self.hogeの関数作成はできなくて、moduel_methodを呼び出してから定義する。
  - クラスメソッドと使われ方や見た目は同じそう

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
  - [IO#expect (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/method/IO/i/expect.html]

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
  - `ArgumentError invalid byte sequence in UTF-8` と出てくるとき
  - `String#scrub`
    - [String#scrub (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/method/String/i/scrub.html]
 [Ruby 2.1.0 に追加される不正なバイト列を除去する String#scrub の紹介 - sonots:blog http://blog.livedoor.jp/sonots/archives/34702351.html]
 [Ruby の invalid byte sequence in UTF-8 例外を encode("UTF-8", "UTF-8") で回避するのはおかしいよ、という話 - sonots:blog http://blog.livedoor.jp/sonots/archives/23652294.html]

[library kconv (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/library/kconv.html]
  >日本語文字コードの変換を手軽に行うためのライブラリです。
 > kconv を require すると String クラスに変換用のメソッドが定義されます。 Kconv にも同等のメソッドが定義されます。 Kconv にはエンコーディングを表す定数も定義されています。
 `string.tojis`
