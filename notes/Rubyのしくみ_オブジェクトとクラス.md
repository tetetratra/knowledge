---
tags: "本, Ruby, MRI, Bison, LALR, YARV, $ \\sube"
---

# Rubyのしくみ：オブジェクトとクラス

- Ruby under a microscope
  - https://github.com/ruby/ruby
- Ruby2.0の実装を解説している
- **5章 オブジェクトとクラス**
  - `RObject`という構造体にオブジェクトの情報が入っている
    - https://github.com/ruby/ruby/blob/5f2c4e344dc2f19aab54523ae418800b08adaa61/include/ruby/internal/core/robject.h#L93-L133
    - `RBasic`(後述)を中にもっている
    - `numiv`
      - インスタンス変数の数
    - `ivptr`
      - インスタンス変数の値の配列へのポインタ
    - `iv_index_tbl`
      - >各インスタンス変数の名前やIDと`ivptr`配列内の位置を対応付けるハッシュテーブルへのポインタ
      - 実際にはこの値は`RClass`構造体内に保存されるらしい? (これはキャッシュやショートカットらしい)
      - ?? よくわからん
    - `ary`
      - 値の配列
  - 一般的なオブジェクトは別のデータの持ち方
    - 文字列は`RString`構造体
    - 正規表現は`RArray`
    - 正規表現は`RRegexp`
  - `RBasic`という共通の構造を、上の構造体は全部、中にもっている
    - https://github.com/ruby/ruby/blob/3d8e1ee40f4aa780243458ee0e527807b948c8fd/include/ruby/internal/core/rbasic.h#L58-L108
    - `flags`
      - なんか色々なフラグ
    - `klass`
      - クラス
  - データ型っぽいオブジェクトは、構造体を使わない
    - `VALUE`ポインタに直接値を保存している
      - (ポインタをポインタとしてつかっていないっぽい)
    - integer, symbol, nil, true, false とか
  - `RClass`
    - https://github.com/ruby/ruby/blob/3d8e1ee40f4aa780243458ee0e527807b948c8fd/internal/class.h#L66-L77
    - `RBasic`を中にもっている
    - すべてのオブジェクトが`RClass`へのポインタをもっていて、自身のクラスを定めている
    - `RClass`の(`RBasic`の)klassは、Classクラスになっている
    - 継承
      - `super`でスーパークラスを持っている
    - クラスインスタンス変数, クラス変数
      - どちらも同じテーブルに保存している。先頭の`@/@@`で判断している
      - クラスインスタンス変数はクラスオブジェクトのインスタンス変数と考えてOK
      - クラス変数(`@@`のほう)は、値をサブクラスとも共有する
        - ので、参照/更新時には自身のクラスにその変数がなかったら全てののスーパークラスを見に行く
    - 定数
      - 定数テーブルももっている
    - `rb_classext_struct`構造体(へのポインタ)を持っている
      - https://github.com/ruby/ruby/blob/3d8e1ee40f4aa780243458ee0e527807b948c8fd/internal/class.h#L39-L64
      - クラス変数とクラスインスタンス変数用のテーブル(`iv_tbl`)
      - 定数テーブル(`const_tbl`)
      - prepend用の値(`origin_`)
      - refine用の値(`refined_class`)
      - ...などをこの構造体で持っている
  - クラスメソッドはどこに保存する?
    - 特異クラスのインスタンスメソッドとして保存する。インスタンスオブジェクトの特異メソッドと同じように。
    - クラスオブジェクトの特異メソッドのことを普通はクラスメソッドと呼んでいる
    - 「メタクラス」$ \sube「特異クラス」
      - クラスについての特異クラスを特に「メタクラス」と呼ぶ
```ruby
irb(main):001:0> class A; def self.m;end;end
=> :m
irb(main):002:0> A.singleton_class.instance_methods(false)
=> [:m]
```

- 特異クラスは、クラスの定義時には(特にクラスメソッドを定義とかしなくても)自動で作られる
```ruby
irb(main):001:0> ObjectSpace.count_objects[:T_CLASS]
=> 992
irb(main):002:0> class A; end
=> nil
irb(main):003:0> ObjectSpace.count_objects[:T_CLASS]
=> 994
```

- >Rubyクラスはメソッド定義と属性名、スーパークラスへのポインタと定数テーブルをもつRubyオブジェクトである
- クラスが持っている情報まとめると
  - インスタンス変数 `class C; def initialize; @v = nil; end; end`
    - 変数の**値**はインスタンス化した各インスタンスの`RObject`に入る(`RClass`とは別)
    - 変数の**名前**は`RClass`内の`rb_classext_struct`の`iv_index_tbl`
  - クラスインスタンス変数 `class C; @v = nil; end`
    - 名前も値も、`RClass`内の`rb_classext_struct`の`iv_tbl`
  - クラス変数 `class C; @@v = nil; end`
    - 名前も値も、`RClass`内の`rb_classext_struct`の`iv_tbl`
      - クラスインスタンス変数とは名前で(`@`の数で)区別している
  - 定数 `class C; V = nil; end`
    - 名前も値も、`RClass`内の`rb_classext_struct`の`const_tbl`
  - インスタンスメソッド `def m`
    - 名前も値(定義への参照)も、`RClass`の`m_tbl`
  - クラスメソッド `def self.m`
    - 特異クラスのインスタンスメソッド
  - 自身のクラス(クラスのクラス) `class C;end; C.class`
    - `RClass`内の`RBasic`の`klass`
  - スーパークラス `class D < C; end`
    - `RClass`の`super`
  - `prepend`
    - `RClass`内の`rb_classext_struct`の`origin_`
  - `refine`
    - `RClass`内の`rb_classext_struct`の`refined_class`
