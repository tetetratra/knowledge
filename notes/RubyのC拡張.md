---
tags: "Ruby, C, MRI, YARV, C_API, gem"
---

# RubyのC拡張

- **作り方について**
- gemの公開については gem へ
  - Rubyの拡張ライブラリの作り方
    - [extension.ja - Documentation for Ruby 2.4.0](https://docs.ruby-lang.org/en/2.4.0/extension_ja_rdoc.html)
  - C拡張を使うGemの作り方(RubyGemsの公式ガイド)
    - [Gems with Extensions - RubyGems Guides](https://guides.rubygems.org/gems-with-extensions/)
  - [いちばんやさしいCでつくるgem - yamshing's diary](https://yamshing.hatenablog.com/entry/2016/03/23/201840)
    - >rake compileでlibフォルダーが出来その中にbundleファイルがコンパイルされるようになります
    - Gemfileとかを気にしないやり方
  - [Ruby Cネイティブ拡張gemの作成・デバッグ - wataash's blog](https://blog.wataash.com/ja/ruby-c-extension/)
  - [rbenv/ruby-build: Compile and install Ruby](https://github.com/rbenv/ruby-build)
    - >Compile and install Ruby
- **C APIについて**
  - C API
    - https://docs.ruby-lang.org/ja/3.1/function/index.html
  - [The Ruby C API](http://silverhammermba.github.io/emberb/c/)
    - C APIを詳しく解説している
**変換表**

| 行→列の変換 | `char*` | String | Symbol |
| --- | --- | --- | --- |
| `char*` | - | `rb_str_new` | `rb_str_new` >> `rb_str_intern` |
| String | `rb_str_to_cstr` | - | `rb_str_intern` |
| Symbol | `rb_sym_to_s` >> `rb_str_to_cstr` | `rb_sym_to_s` | - |

- Rubyの文字→Rubyのシンボル
  - `rb_str_intern`
- Rubyのシンボル→Rubyの文字
  - `rb_sym_to_s`
- Rubyの文字のnew
  - `rb_str_new("aiueo", 5);`
  - `rb_str_new(0, 0);`なら空文字
- `rb_str_cat_cstr(VALUE, char*)`
- `rb_hash_aref(VALUE, VALUE)`
- `RARRAY_LEN(val)`
- Rubyの文字→Cの文字
  - `char* rb_str_to_cstr(VALUE str)`
- `rb_cSymbol`のメソッド登録はstring.cで行われている
- ハッシュを作るには
  - `[['foo', 'zero'], ['bar', 'one']]`のような配列を経由して`static VALUE rb_ary_to_h(VALUE ary)`で作る?
    - `{"foo"=>"zero", "bar"=>"one"}`になる
- `rb_cObject`
  - トップレベルのmainオブジェクト
- クラスメソッドの定義までの一連のコード例
  ```c
  rb_const_get(rb_cObject, rb_intern("RubyVM"))
  rb_define_singleton_method(rb_cISeq, "load", iseq_s_load, -1)
  ```
- メソッドの定義について
  - [function rb_define_method (Ruby 3.2 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/latest/function/rb_define_method.html)
  - `void rb_define_method(VALUE klass, const char *name, VALUE(*func)(), int argc)`
  - 最後の引数`argc`について
    - 0以上
      - そのメソッドの引数の数
      - `VALUE func(VALUE self, VALUE arg1, ... VALUE argN)`
    - -1
      - 引数はCの配列として第二引数に入れて渡される
      - 第一引数は配列の要素数
      - `VALUE func(int argc, VALUE *argv, VALUE self)`
    - -2
      - 引数はRubyの配列に入れて渡される
      - `VALUE func(VALUE self, VALUE args)`
- 可変長引数の解析
  - [function rb_scan_args (Ruby 3.1 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/3.1/function/rb_scan_args.html)
  - フォーマット
    1. 必須引数の数
    2. 省略可能な引数の数
    3. 残りの引数を Ruby の配列として受け取ることを示す `*` (省略可)
    4. 最後の引数をオプションハッシュとして受け取る事を示す `:` (省略可)
    5. ブロックを Proc オブジェクト化して受け取ることを示す `&` (省略可)
- [Kernel#create_makefile (Ruby 3.2 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/latest/method/Kernel/i/create_makefile.html)
  - > `Kernel#have_library` などの各種検査の結果を元に、拡張ライブラリをビルドするための Makefile を生成します。
  - > `extconf.rb` は普通このメソッドの呼び出しで終ります。
- `puts(v)`したい
  ```c
  VALUE str = ...;
  rb_io_puts(1, &str, rb_ractor_stdout());
  ```
  - io.c の rb_io_puts のコードなどを参考にするとよい
- `ruby_debug_print_v(VALUE v)`関数が便利そう
  - 引数の型は`VALUE`。アドレス(`VALUE *`)を渡さないように注意！
- フレーム一覧を見るには`rb_vmdebug_stack_dump_raw_current()`
- VALUEスタックの一覧を見るには...?
- インスタンス生成
  - `rb_class_new_instance(1, &obj, klass);`
  - 引数について
    1. 引数の個数
    2. 引数の入った(RubyのVALUEの)配列
       - 引数1個の場合はオブジェクトのアドレスを渡してあげる
    3. クラスオブジェクト
       - `rb_define_class`の戻り値など
- `hoge.fuga`のようにattributeにアクセスするには
  - `rb_attr_get(self, rb_intern("@ptr"))`のようにやる
- 配列操作
