---
tags: "本, Ruby, MRI, Bison, LALR, YARV"
---

# Rubyのしくみ

- Ruby under a microscope
  - https://github.com/ruby/ruby
  - 参考になりそうなweb記事
    - https://takatoshiono.hatenablog.com/entry/2015/12/10/200422
    - https://www.slideshare.net/yalab/ruby-61765227
    - [Rubyの定数探索の個人的な謎に迫る - Qiita](https://qiita.com/wakasa51/items/5f145380ab7bbf8fee15)
    - [YARV Maniacs 【第 11 回】 最近の YARV の事情](https://magazine.rubyist.net/articles/0041/0041-YarvManiacs.html)
      - ここのバックナンバーも
    - http://www.atdot.net/~ko1/diary/201212.html 「Ruby VM アドベントカレンダー」
    - [CRuby のおすすめソースコードリーディング方法 - Qiita](https://qiita.com/south37/items/0eb05ebf31ba6cbf53c4)
- Ruby2.0の実装を解説している
- **1章 字句解析と構文解析**
  - Bisonが、文法規則(parse.y)からパーサーコード(parse.c)を作る
  - パーサーコードが、Rubyコード(.rb)を字句解析&構文解析する
    - するとASTノードになって、それをコンパイルしてYARV命令列に変換している
  - 字句解析にLexは使っていない
  - キーワード一覧はここ https://github.com/ruby/ruby/blob/master/defs/keywords
  - Ripperというツールで字句解析結果が見れる
```ruby
require 'ripper'
pp Ripper.lex(code_str)
```

- LALR構文解析アルゴリズム
  - look ahead left to right, rightmost derivation
  - 左から右へパースしていく(L)
  - 右端導出。でボトムアップに還元していく。(R)
  - 先読みして何に還元するか判断するときもある(LA)
- rubyの`-y`オプションで、パーサーの状態遷移を見れる
- 文法規則はここらへん
  - https://github.com/ruby/ruby/blob/master/parse.y#L1295
- 構文解析の結果を見るには、`Ripper.sexp(code_str)`
- `--dump parsetree`オプションで、ASTの情報を出力できる
- **2章 コンパイル**
  - コンパイラはRuby1.9以降
  - 上から再帰的にツリーを訪れて、ASTノードをYARV命令に変換する
  - YARVはスタックマシン
  - 関数呼び出しのコンパイル
    - レシーバーをプッシュ
    - 引数をプッシュ
    - メソッドを呼び出す
      - `send`YARV命令
  - compile.cにコンパイラが実装されている
    - https://github.com/ruby/ruby/blob/master/compile.c
  - 変換されたVARV命令列を見るには
    - `RubyVM::InstructionSequence.compile(code).disasm`
  - `putobject`YARV命令でレシーバーをpush
  - レシーバが無いときは`putself`YARV命令を使って、selfポインタ(後述)の現在の値をレシーバとして使うように指示する
  - ブロックパラメータがコンパイルされると、その情報はASTの外の、ローカルテーブルという場所に保存される
  - Rubyの各スコープはそれぞれローカルテーブルをもつ
  - ブロックパラメーターの他に、ローカル変数とかの情報の保存にもこのテーブルを使う
    - テーブルの値がローカル変数なのか、メソッドの仮引数なのか、とかの情報も一緒に持っている
  - `getlocal`YARV命令列でローカルテーブルを参照する
  - 上に書いたRubyVMでYARVを見る方法で、ローカルテーブルも見れる。
- **3章 Rubyはどのようにコードを実行するか**
  - YARVスタックと制御スタックフレームの2つのスタック
    - YARVスタックはYARV命令のスタック
    - 制御スタックは`rb_control_frame_t`構造体のスタック
  - 登場人物は、「Rubyコード」「YARV命令列」「YARVスタック」「制御スタック」
  - コールスタック(制御スタック)のための`rb_control_frame_t`構造体
    - スタックポインタ(sp)
      - YARVスタックの現在の場所を指している
    - プログラムカウンタ(pc)
    - 環境ポインタ(ep)
    - self変数の値とかも保持している(self)
    - https://github.com/ruby/ruby/blob/a53aab1273729c10b7e675ce8fd1a711d22c0cd0/vm_core.h#L823-L837
```c
typedef struct rb_control_frame_struct {
    const VALUE *pc;		/* cfp[0] */
    VALUE *sp;			/* cfp[1] */
    const rb_iseq_t *iseq;	/* cfp[2] */
    VALUE self;			/* cfp[3] / block[0] */
    const VALUE *ep;		/* cfp[4] / block[1] */
    const void *block_code;     /* cfp[5] / block[2] */ /* iseq or ifunc or forwarded block handler */
    VALUE *__bp__;              /* cfp[6] */ /* outside vm_push_frame, use vm_base_ptr instead. */

#if VM_DEBUG_BP_CHECK
    VALUE *bp_check;		/* cfp[7] */
#endif
} rb_control_frame_t;
```

- `setlocal x, y`YARV命令
  - y個下のコールスタックフレームのepのx個下の箇所に、YARVスタックの頂点の値をコピーする
```text
- Each instructions are in following format:

  DEFINE_INSN
  instruction_name
  (type operand, type operand, ..)
  (pop_values, ..)
  (return values ..)
  // attr type name contents..
  {
    .. // insn body
  }
```

```c
/* Set a local variable (pointed to by 'idx') as val.
     'level' indicates the nesting depth from the current block.
 */
DEFINE_INSN
setlocal
(lindex_t idx, rb_num_t level)
(VALUE val)
()
{
    vm_env_write(vm_get_ep(GET_EP(), level), -(int)idx, val);
    RB_DEBUG_COUNTER_INC(lvar_set);
    (void)RB_DEBUG_COUNTER_INC_IF(lvar_set_dynamic, level > 0);
}

```

- `getlocal x, y`YARV命令
  - y個下のコールスタックフレームのepのx個下の箇所の値を、YARVスタックの頂点にコピーする
  - https://github.com/ruby/ruby/blob/a53aab1273729c10b7e675ce8fd1a711d22c0cd0/insns.def#L73-L99
    - YARV命令は`insns.def`にＣ言語(もどき)で書かれていて、それがC言語コードに変換されてYARV処理系になる(`vm.inc`になる)
```c
/* Get local variable (pointed by `idx' and `level').
     'level' indicates the nesting depth from the current block.
 */
DEFINE_INSN
getlocal
(lindex_t idx, rb_num_t level)
()
(VALUE val)
{
    val = *(vm_get_ep(GET_EP(), level) - idx);
    RB_DEBUG_COUNTER_INC(lvar_get);
    (void)RB_DEBUG_COUNTER_INC_IF(lvar_get_dynamic, level > 0);
}

/* Set a local variable (pointed to by 'idx') as val.
     'level' indicates the nesting depth from the current block.
 */
DEFINE_INSN
setlocal
(lindex_t idx, rb_num_t level)
(VALUE val)
()
{
    vm_env_write(vm_get_ep(GET_EP(), level), -(int)idx, val);
    RB_DEBUG_COUNTER_INC(lvar_set);
    (void)RB_DEBUG_COUNTER_INC_IF(lvar_set_dynamic, level > 0);
}
```

- `ep`が指すYARVスタックの箇所には、`special`
- `ep-1`が指す箇所には、`svar/cref`
  - `svar/cref`はspecial variable, class referenceの略
- ブロックの呼び出し
  - 新しい制御スタックフレームの`rb_block_t`構造体ができる
  - YARVスタックにも新しい`special`や`svar/cref`の値がpushされ、`special`の値は上の`rb_block_t`へのポインタとなる
  - 更にYARVスタックに新しい`special`, `svar/cref`の値がpushされ、epはこの`special`を指すようになり、この`special`の値は1つ前のepへのポインタとなる。
  - ブロック内でブロック外の変数を見つけるときは、最期にpushした方の`special`の値を辿ってepをたどる。
- 特殊変数の一部(ラストマッチ`$&`とか)は、`$`がついているけれどもグローバルではない。
- `svar/cref`とは、同じep-1の箇所だけれども、特殊変数のために使われるときか、クラス参照のために使われるかのどちらか、という意味
  - ブロックスコープのときは`cref`の役割になる
- `svar`は、「そのスタックでの特殊変数の値を保持しているセット」への参照となっている
- `cref`は、レキシカルスコープのために使われる
- **4章 制御構造とメソッドディスパッチ**
  - アセンブリ言語みたいな感じで条件分岐や繰り返しをしている
  - `branchif x`YARV命令
    - スタックのトップがtrueならxにジャンプ
  - `throw`YARV命令
    - ブロックでの`break`や、メソッドの`return`とかで使われる
    - YARVコードはスコープごとにある
    - YARVコードは捕捉テーブルという、そのYARVコードのある場所を指すテーブルをもっている(ブレークポインタ)
    - `throw`が呼ばれたら、親スコープの補足テーブルを見て、ブレークポインタが見つかればそこに処理を戻す。無ければ見つかるまで更に親を見ていく
  - `send`YARV命令
  - 1. YARVがsendを呼ぶ
  - 2. メソッド探索
  - 3. メソッドディスパッチ
  - 4. YARVが対象のメソッドを実行する
  - メソッドには種類がある
    - ISEQ
      - Rubyで書かれたメソッド
    - CFUNC
      - Cで書かれたメソッド
    - ATTRSET
      - `attr_writer`
    - IVAR
      - `attr_reader`
    - などなど
  - 通常のメソッド呼び出し
    - 引数を格納するローカルテーブルを作る
    - 引数の種類に応じてラベル付けされる
    - 呼び出しごとに`rb_control_frame_t`構造体で新しいスタックフレームが作られる
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
- **6章 メソッド探索と定数探索**
- メソッド探索
  - モジュールもクラスと同じ構造体を使う
  - インスタンスは作れないから、`iv_index_tbl`は使われないし、他の不要な機能のための値も使わない
  - クラスがモジュールをincludeすると、そのモジュールのコピーが紐付けられる
  - クラスの`RClass`の`super`は、そのコピーされたモジュールを指すようになる
  - コピーされたモジュールの`RClass`の`suser`は、元のクラスのスーパークラスを指すようになる
    - includeも継承と同じチェーンを使っていて、すべて一直線上にある
  - `extend`も同じような実装
    - `include`はクラスの`super`だったけど、`extend`はクラスのメタクラスの`super`に紐付けられる
  - RObjectのklass→RClassのm_tbl のようにメソッドを見に行く
  - 見つから無ければ見つかるまでsuperを辿る
  - グローバルメソッドキャッシュ、インラインメソッドキャッシュ、という高速化がされている
  - あとにincludeしたモジュールの方が、直近のsuperになる
  - prependの使いみち
    - たとえばProfessorモジュールがあって、コレを使えば名前の先頭に"Prof. "を付けたものになるようにしたい
    - だけど、nameをattributesとして持つMathematicianクラスがProfessorをincludeしても、MathematicianのほうがProfessorよりも下なので先に呼ばれてしまう
    - ここでprependを使えば、Professorのnameが先に呼ばれて、その中でsuperでMathematicianのnameを呼べて、期待した挙動になる
  - prependの実装
    - モジュールのコピーが使われる。ここはincludeと一緒
    - クラス→モジュールのコピー→originクラス→(スーパークラス→ ...) のような継承チェーンになる(superを辿るとこのチェーンになる)
    - originクラスとは、対象のクラスのコピーで、対象のクラスのメソッドは全てoriginクラスに移される
    - クラスのorigin(構造体だと`origin_`)には、「originクラス」が指定される
  - includeされた「モジュールのコピー」は、「コピー元のモジュール」とメソッドテーブルを共有するので、includeしたクラスのインスタンスを作った後でモジュールにメソッドを定義しても、インスタンスではその新しいメソッドを利用することができる
  - include機能のコード
    - https://github.com/ruby/ruby/blob/3d8e1ee40f4aa780243458ee0e527807b948c8fd/class.c#L912-L938
    - なにやってるかよくわからん
- 定数探索
  - クラスもモジュールも同じく`RClass`だから、以下、クラスで成り立つものはモジュールに置き換えても成り立つ
  - コンパイルされた各コード片ごとに、親のレキシカルスコープ(`nd_next`)と現在のクラスへのポインタ(`nd_class`)を持っている
  - 新しくクラスを作るときは、自身の`RClass` の定数テーブルに、新しいクラスを設定する
    - クラス内クラスとかを作るときの話
    - 定数と同じように管理されている
  - クラスを含めて定数探索時には、まずは自身のスコープのクラスである`nd_class`を探す。無ければ`nd_next`で1段浅いスコープに移って、そこの`nd_class`を見ていく(見つかるまで繰り返し)
  - スーパークラスチェーンとレキシカルスコープの両方を探索する
    - まず、レキシカルスコープを辿る
    - →各レキシカルスコープのautoloadを確認
    - →スーパークラスチェーンを辿る
    - →各スーパークラスチェーンのautoloadを確認
    - →const_missingを呼ぶ
  - [変数と定数 (Ruby 3.0.0 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/latest/doc/spec=2fvariables.html#prio)
    - >トップレベルの定数定義はネストの外側とはみなされません。したがってトップレベルの定数は、継承関係を探索した結果で参照されるので優先順位は低いと言えます。
- **7章 ハッシュテーブル: Ruby 内部の働き者**
  - ハッシュテーブルの値が連結リスト、のデータ構造
  - 再ハッシュ
    - ハッシュの値の密度がある一定増えると、再計算が起こる
  - 小さなハッシュのときは配列をハッシュとして使う
- **8章 Lispから借用したアイデア**
- ブロック
  - クロージャの定義
    - 「ラムダ式」と「ラムダ式を呼び出すときに使用される環境」のセット
  - ブロックを`rb_block_t`という構造体で表現している
  - ブロック呼び出し
```ruby
str = "abc"     # rb_control_frame_t が制御スタックフレームに作られる
10.times do |i| # rb_block_t         が制御スタックフレームに作られる
                # rb_control_frame_t が制御スタックフレームに作られる
  str2 = "def"
  puts str + str2
end
```

- 作ったブロックのEPには、現在のEPの値を入れる
  - 「環境を持つ」の実装になっている
- ↑ 微妙に理解できてないから間違ってるかも
- `rb_block_t`構造体が持っているもの
  - `iseq`
    - YARVコード命令へのコード片へのポインタ
  - `EP`
    - ブロックが作成されたときに一番上にあったスタックの位置へのポインタ
- 今のRubyでは`rb_block`という名前になっているみたい?
  - コード: https://github.com/ruby/ruby/blob/master/vm_core.h#L731-L762
- `rb_control_frame_t`のコード: https://github.com/ruby/ruby/blob/master/vm_core.h#L764-L776
- ラムダ・Proc
  - YARVスタックに値は入っていなくて、全部ヒープ領域へのポインタになっている
    - 整数やnilとかは例外で、直接入っている
    - `VALUE`ポインタ と呼ぶ
  - ラムダやprocは、「ブロックのコードの環境」と「参照元の環境」の両方を持つ必要がある
  - ラムダを呼ぶと、YARVスタック全体の内容をヒープ内にコピーする
    - 「ラムダが作られた場所のスタックフレーム、のコピー」「内部環境オブジェクトの`rb_env_t`構造体」「Procオブジェクト`rb_proc_t`構造体」の3つをヒープに作成する
      - `rb_proc_t`構造体は`rb_block_t`を内部に含んでいるので、`iseq`やEPをもって いる
        - EPには、ヒープにコピーされたスタックフレームへのポインタが入る
        - `iseq`にはラムダのYARVコードへの参照が入る
  - たとえば、あるメソッドがProcを返して、そのProcをなにか変数に入れたとき、Procへの参照はその変数が持っていて、Procはコピーしたメソッド内の環境を持っているから、どれもGCで開放されない
  - Procオブジェクトの図
```c
RTypedData {
  RBasic {
    flags,
    klass
  }
  data -> rb_proc_t {
    rb_block_t {
      iseq,
      EP
    }
    envval, is_lambda
  }
}
```

- ヒープにスタックのコピー(= 新しい`rb_env_t`構造体、か内部環境オブジェクトのコピー)を作ると、コピー元の`rb_control_frame_t`のEPは、ヒープ先のYARVスタックを指すように変わる。なので、外側の変数を参照するラムダを作った後でその外側の変数を書き換えても、作ったラムダにもその書き換えが反映される
- ラムダを作るときは、現在の(= つくった場所の)EPが「スタックのYARV」「ヒープのYARV」どちらを指しているか判断する。
  - 「ヒープのYARV」を指しているときは、その場所で既にラムダが1度作られたということなので、2度目以降のラムダ作成時にはコピーはせずに、1度目につくったコピーを共有する
    - なので、片方のラムダで環境を書き換えると、同じ場所のもう片方のラムダもその影響をうける
- この章激むずすぎる
- **9章 メタプログラミング**
  - `def`でメソッドの名前だけを指定したときは、レキシカルスコープから対象のクラスを探して、メソッドテーブルに追加する
  - `def ojb.method_name`で、objの特異クラスのメソッドテーブルにメソッドを追加する
  - `class << obj`は、objの特異クラスにアクセスする手段
    - だからselfでクラスメソッドを作るとき以外でも使える
  - C言語レベルでは、特異クラスとメタクラスを区別して扱っている?
- Refinements
  - `refine`メソッドを使うと
    - 新しいレキシカルスコープを作る
    - refinementモジュールを作る
      - 作った新しいレキシカルスコープの`nd_class`に対応する
    - 作ったrefinementモジュールの`refined_class`に、refneで指定したクラス(`RClass`)が設定される
  - `using`の後で`refine`されたクラスのメソッドを呼び出すとき
    - `using`によって、レキシカルスコープの`nd_refinements`ポインタが、refineしたクラスを指すように設定される
    - 呼び出したメソッドのメソッドタイプが`VM_METHOD_TYPE_REFINED`だったなら、refineされたメソッドの方を`nd_refinements`を通して最初に探す
  - `self`には何が設定されるか
    - クラス(モジュール)のスコープ内では、selfはそのクラスを指す
    - メソッド内では、selfはメソッド呼び出し時のレシーバを指す
- メタプログラミングとクロージャ: eval, instance_eval, binding
  - `eval`は、パースをコンパイルを動的に行った後で、ブロックを作るときと同じようにクロージャを
  - `Kernel#.binding`メソッド
    - 実行した場所の環境を取得できる
    - YARVスタックや、呼ばれた場所のスタックフレームをヒープにコピーする
    - ブロックを作っているときと似ている処理
    - `rb_proc_t`ではなくて`rb_proc_t`に、`filename, line_no, env`とかを入れている
  - `self`が呼ばれたときは、`rb_control_frame_t`の`self`が呼ばれる
  - `instance_eval`
    - レシーバを`self`に設定する
    - レキシカルスコープ`cref`を作って、それが指すクラス`nd_class`はレシーバの特異クラスになる
