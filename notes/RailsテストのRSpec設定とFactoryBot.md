---
tags: "Rails, RSpec, FactoryBot"
---

# RailsテストのRSpec設定とFactoryBot

- gem 
  - Rspec
  - FactoryBot
  - DatabaseCleaner
  - capybara
- `feature "機能名" do`が一番外側
- `RSpec.configure do |config|`について、
  - `config.before(:each) do`はexmple(= it)(= scenario)ごとに実行される
    - background(= before)にFactoryレコードのcreateと、そのアカウントでのログイン処理を書く
      - デフォルトのbeforeはbefore(:each)だから毎回呼ばれるよ
- `feature => background(= before), scenario(= it)(= example)`の階層で書く
  - 必要に応じて`context`を入れる
- [FactoryBot(FactoryGirl)チートシート - Qiita](https://qiita.com/morrr/items/f1d3ac46b029ccddd017)
- [【Rails】factory_botの使い方メモ - Qiita](https://qiita.com/at-946/items/aaff42e4a9c2e4dd58ed)
- `spec/factories/`に、雛形の[DSL]を書く
- スタートガイド: [factory_bot/GETTING_STARTED.md at master · thoughtbot/factory_bot](https://github.com/thoughtbot/factory_bot/blob/master/GETTING_STARTED.md)
- `spec/spec_helper.rb`に次のように書くと、`FactoryBot.create(:user)`じゃなくて`create(:user)`だけで書けるようになる
  - 設定しなくても問題ない。モジュール名から書くやり方で書けば使える
  - Rubyのincludeと同じことをしているみたい
  - [Module: FactoryBot::Syntax::Methods — Documentation for factory_bot (5.2.0)](https://www.rubydoc.info/gems/factory_bot/FactoryBot/Syntax/Methods)
  - [基礎からやり直す Rails RSpec - Qiita](https://qiita.com/kskinaba/items/38b143e79bdfd44cc42a)
```spec_helper
  config.include FactoryBot::Syntax::Methods
```

- スタイルガイド [GitHub - willnet/rspec-style-guide: 可読性の高いテストコードを書くためのお作法集](https://github.com/willnet/rspec-style-guide)
  - テスト対象のカラムはテスト内に明示的に。それ以外はbot内に。
- テストに関わらず、時間の入力はプログラミングにおいて超面倒。1箇所にまとめると良い。
  - [「現在時刻」を外部入力とする設計と、その実装のこと - クックパッド開発者ブログ](https://techlife.cookpad.com/entry/2016/05/30/183947)
- 特定のspecのみ実行するには
    - [Rspecの便利なオプション - Qiita](https://qiita.com/s_yasunaga/items/cc7489ee4e51ca196c43)
    - `rspec spec/path`
    - `rspec --example '実行したいexampleやdescribeの名前の一部'`
      - LIKE句みたいな感じで、部分文字列の一致箇所をテストしてくれる
  - `rspec spec/hoge.rb:12:24 spec/fuga:10` みたく、複数行・複数ファイルを指定できる
- 誰かが書いてたコーディング見つけた
    - [willnet/rspec-style-guide: 可読性の高いテストコードを書くためのお作法集](https://github.com/willnet/rspec-style-guide)
- `spec_helper.rb`の`RSpec.configure do |confng|`内に
  - `  config.before(:each) do`とかが書ける
- `spec/rails_helper.rb`と`spec/spec_helper.rb`の違い
  - [Rspecの設定はrails_helper.rbにだけ書けばよい - Qiita](https://qiita.com/kazutosato/items/8255a685206b327ad151)
  - >spec_helper.rbは、Railsを読み込まずにRspecだけで何かしらRubyのコードをテストするのに使う
    - なので、基本的にはrails_helperに全部書けばOK
