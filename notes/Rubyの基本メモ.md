---
tags: "Ruby, プログラミング言語"
---

# Rubyの基本メモ

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
  - [each_with_indexしつつinjectしたい - Qiita https://qiita.com/ymstshinichiro/items/366b738ceefd224b5d41]
  - `(1..3).each.with_index.inject([]) { |r , (val, idx)| r << [val , idx] }`
    - `each.with_index`で出来るのはあくまでイテレーター
    - `(val, idx)`が`each.with`で出来たもの。
    - `r`が`inject`のmemo側. `(val, idx)`がitem側

anddotを記号メソッドに使うには`arr&.[] ind`
 [【一人 Ruby Advent Calendar 2017】Ruby の &. 演算子【14日目】 - Secret Garden(Instrumental) http://secret-garden.hatenablog.com/entry/2017/12/15/000505]

`&&`は式、`and`は文
  - https://twitter.com/yukihiro_matz/status/1242106330149605377
  - ()で囲めば文は式になる
  - [プログラム・文・式 (Ruby 2.4.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/2.4.0/doc/spec=2fprogram.html]
   >メソッドの引数に指定できない式は、括弧によるグルーピングを行うことで普通の式として使用することができます。
