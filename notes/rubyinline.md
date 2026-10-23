---
tags: "Ruby, CRuby, MRI, C, 動的リンク, gem, 拡張ライブラリ"
---

# rubyinline

- [seattlerb/rubyinline](https://github.com/seattlerb/rubyinline)
- Rubyで動的にCを実行できるGem
- `gem install RubyInline` (大文字なことに注意)でインストールできる
- https://github.com/seattlerb/rubyinline/blob/master/lib/inline.rb にすべての処理が書かれている(900行くらい)
**サンプルコード.rb**

```
require "inline"
class MyTest
  inline do |builder|
    builder.c "
      long factorial(int max) {
        int i=max, result=1;
        while (i >= 2) { result *= i--; }
        return result;
      }"
  end
end

factorial_5 = MyTest.new.factorial 5


```

- [RubyInline gem で C 拡張を手軽に作ってみた - エムスリーテックブログ](https://www.m3tech.blog/entry/rubyinline)
  - RubyInline の動作原理
  - >1. inline 関数の呼び出し元のファイル(class を定義しているファイル)の更新日時・ハッシュ値を元に、キャッシュ用のハッシュ値を算出 *5
  - >2. 上記で算出したハッシュ値に該当するコンパイル済みのファイルがあれば、それを読み込む
  - >3. コンパイル済みキャッシュがないならば、以下の処理を行う
    - >1. 与えられた C ソースの中で最初に宣言されている関数を正規表現で見つける
    - >2. 上記の関数に対して、 VALUE 型と C 言語の型を変換するためのラッパー(後述)を生成
    - >3. Ruby 本体のコンパイル時に使われた C コンパイラ・オプションなどを使って C ソースをコンパイルする
      - > RbConfig から LDSHARED などを取得しています
  - [RubyでインラインCコードを書いてメモリ共有&爆速化してみた（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2018_01_31/51055)
    - 元記事：[Writing C and Sharing Memory... in Ruby!](https://blog.rebased.pl/2017/12/27/writing-c-and-sharing-memory.html)
  - ソースコードを読んでみる
    - `Module#inline(lang = :C, options={})`を生やしている
      - `yield Inline::C.new(self)`している
        - `inline { |builder| builder.c "Cのソースコード" }` のように使うから、`Inline::C#c`の実装を追ってみる
    - `Inline::C`
      - 「Cの型」について「Ruby(VALUE)→C」と「C→Ruby(VALUE)」への変換用関数を列挙している
```c++
TYPE_MAP = {
  'char'               => [ 'NUM2CHR',        'CHR2FIX'      ],
  'char *'             => [ 'StringValuePtr', 'rb_str_new2'  ],
  'double'             => [ 'NUM2DBL',        'rb_float_new' ],
  'int'                => [ "FI\X2INT",       'INT2FIX'      ],
  'unsigned int'       => [ 'NUM2UINT',       'UINT2NUM'     ],
  'unsigned'           => [ 'NUM2UINT',       'UINT2NUM'     ],
  'long'               => [ 'NUM2LONG',       'LONG2NUM'     ],
  'unsigned long'      => [ 'NUM2ULONG',      'ULONG2NUM'    ],
  'long long'          => [ 'NUM2LL',         'LL2NUM'       ],
  'unsigned long long' => [ 'NUM2ULL',        'ULL2NUM'      ],
  'off_t'              => [ 'NUM2OFFT',       'OFFT2NUM'     ],
  'VALUE'              => [ '',               ''             ],
  # Can't do these converters because they conflict with the above:
  # ID2SYM(x), SYM2ID(x), F\IX2UINT(x)
}
```

- `Inline::C#c`
  - `self.generate`を呼び出している
  - メソッドに渡すCコードに含まれる関数は1個のみ(多分)
  - 最後に`builder.build`, `builder.load` を呼んでいる
- `Inline::C#generate`
  - `signature = parse_signature(src, !expand_types)`
    - ソースコード中に現れるCの型を文字列操作を頑張って取り出している
  - なんかソースコードをゴニョゴニョしているけれどよくわからぬ
    - 引数や戻り値の型をCの型からRubyの型に変えている感じがする
  - 文字列操作後のC関数をインスタンス変数に保持しておいている
- `Inline::C#build`
  - コンパイルするためのコマンド(`clang -dynamic -bundle ......`) を組み立てている
    - Rubyには`RbConfig::CONFIG`という標準添付ライブラリがあったらしい
  - 組み立てたコマンドで実際にコンパイルしている
```rb
`#{cmd}`
```

- `Inline::C#load`
  - `require "#{so_name}"`している
- 作ったC関数をどのように呼び出しているのか
  - サンプルコード見た感じだとmethod_missingか動的なメソッド追加っぽいが...
  - `generate_ext`というメソッドで `method << "    rb_define_singleton_method(c, \"#{method_name}\", "`のようなコードを作っていた
    - `generate_ext`メソッドは`build`メソッド内で呼ばれるメソッド
- `require`でロードしている
  - https://docs.ruby-lang.org/ja/latest/method/Kernel/m/require.html#:~:text=拡張ライブラリ%20(*.so%2C*.o%2C*.dll%20など)
  - > Ruby ライブラリとは Ruby スクリプト (*.rb) か**拡張ライブラリ (*.so,*.o,*.dll など)**であり、feature の拡張子が省略された場合はその両方から探します( *.rb が優先されます)
