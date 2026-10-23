---
tags: "Ruby, 標準添付ライブラリ, gem"
---

# Rubyの標準ライブラリとgem

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
  - [$-I (Ruby 3.0.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/method/Kernel/v/=3a.html]

Rakeのファイルタスクは実行されないときもある。ファイルタスクはファイルを作るタスクだから
  - 関連するファイルが存在しない場合
  - 事前タスクで作成したファイルの方が新しい場合
  - [library rake (Ruby 3.0.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/library/rake.html]

[列挙型]っぽいやつはどうやって実現されているのか
  - 値の部分はどうなっているのか
  - 連番を入れているだけっぽい
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
