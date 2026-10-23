---
tags: "Ruby, MRI"
---

# YARV

- from MRI
  - [YARV Maniacs 【第 1 回】 『Ruby ソースコード完全解説』不完全解説](https://magazine.rubyist.net/articles/0006/0006-YarvManiacs.html)
  - [YARV カテゴリーの記事一覧 2ページ目 - ひとり勉強会](https://hzkr.hatenablog.com/archive/category/YARV?page=2)
  - [YARVアーキテクチャ](http://www.atdot.net/yarv/yarvarch.ja.html)
  - [高速な Ruby 用仮想マシンの開発](https://atdot.net/~ko1/activities/sasada_dt.pdf)
    - 論文
  - [丁稚な日々](https://www.garbagecollect.jp/~usa/d/201412a.html#id20141201)
    - > 短期集中連載「Rubyスタートアップ」第1回 Rubyのスタートアップ処理の概要
    - 第0回から第17回まである
  - レジスタは5種類 (2005年時点の情報)
    - [YARVアーキテクチャ](http://www.atdot.net/yarv/yarvarch.ja.html)
    - >VM は 5 つの仮想的なレジスタによって制御されます。
      - `PC (Program Counter)`
        - 現在実行中の命令列の位置
        - currentはコールスタックのtopを見ればいい
        - savedはコールスタックの下を見ればいい
      - `SP (Stack Pointer)`
        - スタックトップの位置
        - currentはコールスタックのtopを見ればいい
        - savedはコールスタックの下を見ればいい
      - `CFP (Control Frame Pointer)`
        - 指しているコールスタックのはず
      - `LFP (Local Frame Pointer)`
        - 謎
      - `DFP (Dynamic Frame Pointer)`
        - 謎
  - [RubyVM::InstructionSequence.load_from_binaryから実行までの流れ - Qiita](https://qiita.com/yamshing/items/c08adb8e88048dce8123)
**バイナリ化.rb**

```
iseq = RubyVM::InstructionSequence.compile('puts "Hello world"')
puts iseq.to_binary.bytes.join(',')
```

**バイナリ読み込み.rb**

```
bin_arr = (出力されたバイト列)
bin = bin_arr.pack("c*")
iseq = RubyVM::InstructionSequence.load_from_binary(bin)
iseq.eval

```

- [YARV のバイトコードと戯れる方法 - まめめも](https://mametter.hatenablog.com/entry/20080523/p1)
  - バイトコードを直接実行する方法はすでに提供されていた...
    - 今は`VM::InstructionSequence.load`は提供されていなかった
  - >ただし、VM::InstructionSequence.load は (今のところ) 呼び出せないようになっています (iseq.c の中でメソッド定義がコメントアウトされています) 。
    - 2008年
  - [YARV のバイトコードベリファイアを作ってみた - まめめも](https://mametter.hatenablog.com/entry/20080523/p2)
    - 続き
  - [YARV のバイトコードベリファイアを作ってみた の続き - まめめも](https://mametter.hatenablog.com/entry/20080524/p1)
    - 続き2
- [Ruby中間表現のバイナリ出力を改善する - クックパッド開発者ブログ](https://techlife.cookpad.com/entry/2019/09/26/143000)
  - >Rails5.2以降ではデフォルトでプロジェクトにインストールされる Bootsnap という gem は、前項で説明した `#to_binary` メソッドを使って、スクリプトファイルのコンパイル結果を自動的に ./tmp/ 以下のディレクトリにキャッシュしてくれます
  - >`#to_binary` の実装の大部分は Ruby の compile.c に書かれています。
    - https://github.com/ruby/ruby/blob/master/compile.c
      - 1万行もある...
