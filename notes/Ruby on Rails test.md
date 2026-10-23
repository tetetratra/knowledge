---
tags: "Rails, テスト, DSL, モック, Minitest, FactoryBot, Capybara, ActiveJob, Rollbar"
---

# Ruby on Rails test
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
- capybara
  - 公式ドキュメント: [File: README — Documentation for jnicklas/capybara (master)](https://www.rubydoc.info/github/jnicklas/capybara)
- 　 [Capybaraチートシート - Qiita](https://qiita.com/morrr/items/0e24251c049180218db4)
- 　 [使えるRSpec入門・その4「どんなブラウザ操作も自由自在！逆引きCapybara大辞典」 - Qiita](https://qiita.com/jnchito/items/607f956263c38a5fec24#%E3%81%95%E3%82%89%E3%81%AB%E3%81%95%E3%82%89%E3%81%AB)
- featureテスト書く時の心得(アンチパターン)
- 　[Rails: テスティングアンチパターン –後編（翻訳）｜TechRacho（テックラッチョ）〜エンジニアの「？」を「！」に〜｜BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2018_02_23/52599)
- 今のURL知る(capybara)
  - `page.current_path`
  - `page.current_url`
- `it_behaves_like`と`shared_examples_for`で共通のテスト
    - 「OOしないこと」「OOでないこと」のテストに使うと良さそう。「想定以外の動作をしないこと」のテスト。AするときはBとCはしないし、BするときはAとCはしない、のような
- 箇条書きにした仕様のネストが、深くなるにつれて過去の出来事に言及するようになったとき、Rspecのcontextのbefore_actionでの条件づくりが同じネスト具合ではできなくなる
- テスト内のリクエスト(`get ~~`とか)は、そのテストと同じキャッシュストアが使われるから、テスト内や前のリクエストで作られたクエリキャッシュが次のリクエストでも効いてしまい、期待してほしくない挙動が起こる
  - [Rails のキャッシュ機構 - Railsガイド](https://railsguides.jp/caching_with_rails.html)
  - リクエスト時は毎回別のキャッシュストアを使って使うようにすれば良さそう?
  - リクエスト時はキャッシュは一切使わない、だと、キャッシュに依存したリクエスト内の処理があったときに困りそう
  - [Rspecで特定のテストケースでキャッシュストアを変更する - Qiita](https://qiita.com/yamashun/items/1a53e86dbdb39be23b6c)
  - [ActiveRecord::ConnectionAdapters::QueryCache](https://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/QueryCache.html#method-i-uncached)
  - [Rails/RSpec toggle cache for a single test - Stack Overflow](https://stackoverflow.com/questions/31929514/rails-rspec-toggle-cache-for-a-single-test)
- 気まぐれでテストがコケるときは、before_action内で作っている共用のレコードが、片方のテストで更新されていないか確認してみる。
- >テストのロジックは同じだけど、入力値とそれに対する結果が異なるみたいなテストをシンプルにかけるrspec-parametrizedというgemがあります。
  - [rspec-parameterizedで条件だけが異なるテストコードをDRYに書く - PIYO - Tech & Life -](https://blog.piyo.tech/posts/2018-06-04-rspec-parameterized/)
- **共通化したいもの**

| 対象 | 方法 |
| --- | --- |
| テストのロジック | where, with_them (rspec-parametrized) |
| テストの前提条件 | context |
| テスト対象 | subject |
| テスト対象 | let |
| テスト観点 | it_behaves_like |

- 独自のmatcherをhelperに定義するのもあり
- [モック]には https://docs.ruby-lang.org/ja/latest/class/OpenStruct.html を使うと便利かも
- [Minitest]でモックを使ってメソッドが呼ばれたことをテストする
  - [Class: Minitest::Mock — Documentation for minitest (5.11.3)](https://www.rubydoc.info/gems/minitest/5.11.3/Minitest/Mock#expect-instance_method)
  - [Class: Object — Documentation for minitest (5.11.3)](https://www.rubydoc.info/gems/minitest/5.11.3/Object#stub-instance_method)
  - 使い方
    - `Object#stub(method_name, val_or_callable, *block_args)`で、置き換えたい&呼ばれたことを検証したいメソッドを指定
    - 渡したブロック内で検証をする
    - ブロック内でmethod_nameが呼ばれたときは、戻り値がval_or_callableに置き換わる
      - respond_to? `#call`ならcallの戻り値が戻り値に、そうでなければval_or_callable自体が戻り値になる
      - >If val_or_callable responds to `#call`, then it returns the result of calling it, otherwise returns the value as-is
    - メソッドが呼ばれたことをテストするために、val_or_callableにはMinitest::Mockのインスタンスを渡す
      - `Minitest::Mock#expect(name, retval, args = [], &blk)`
    - Minitest::Mockのインスタンスを渡したとき、渡したブロック内でのmethod_nameの処理は置き換わらないが、引数と戻り値の受け渡しがMinitest::Mockの処理を経由するようになる(実際には置き換わっているけれども、Minitest::Mockの処理に囲まれる、みたいな感じ)
    - Minitest::Mockの処理では、引数がargsに一致しているかどうか、返り値がretvalに一致しているかどうかを検証する
      - 「メソッドが呼ばれたことのテスト」そのもの
    - 最後に`mock.verify`を呼ぶ必要がある
  - 例
    - [minitestでモジュールメソッドにstubを使う - Qiita](https://qiita.com/matsukaz/items/6616d6f18e98108e9207)
    ```ruby
module TestModule
  module_function
  def hex(length)
    SecureRandom.hex(length).slice(0, length)
  end
end
    ```

    ```ruby
describe TestModule, :hex do
  describe "when length is passed" do
    it "should return hex value" do
      test_module_mock = MiniTest::Mock.new
      test_module_mock.expect :call, "0123456789abcdef", [16]
      TestModule.stub :hex, test_module_mock do
        hex = TestModule.hex 16
        hex.must_equal "0123456789abcdef"
        test_module_mock.verify
      end
    end
  end
end
    ```

    - 「TestModuleのhexが、引数が`16`で呼ばれて、返り値が`0123456789abcdef`であること」をテストしている
- `allow`と`expect`
- `expect(instance).to receive(:method_name).and_return`はテスト用
  - 失敗したら
- `allow(instance).to receive(:method_name)`はモック用
- `with`で検証する引数を、詳しく検証したいとき
    - 普通の検証なら`.with('hoge')`とかでいい
    - 引数にファイルとかが来るときにその中身を検証したいときはこう書く
  ```rb
expect(mock_uploader).to receive(:upload).with(any_args) do |argument|
  expect(argument[:file].read).to eq(expected_tsv)
  expect(argument[:upload_file_name]).to eq(expected_upload_file_name)
end
  ```

- `stub_const`で定数のスタブ化
  - 定数は、letで定義すると定数に入るわけではないので、`Module#name #=> nil`になる
    - letで定義するとメソッドになる(大文字メソッド)
  - もう一つの問題として、`describe`はブロックだから`class`キーワードで作った名前がグローバルになってしまう
  - [RSpec: How to define classes for specs - makandra dev](https://makandracards.com/makandra/47189-rspec-how-to-define-classes-for-specs#section-2-defining-the-class-and-assigning-to-a-constant) この方法でうまくできる
  ```ruby
  before do
    test_record = Class.new
    stub_const('TestRecord', test_record)
  end
  ```

- [現在時刻が関わるユニットテストから、テスト容易性設計を学ぶ - t-wadaのブログ](https://t-wada.hatenablog.jp/entry/design-for-testability)
- ファイルアップデートのテストは`Rack::Test::UploadedFile`でファイルインスタンスを作る
- [minitest]でソースコードを指定
  - https://stackoverflow.com/questions/5285711/is-it-possible-to-run-a-single-test-in-minitest
    - `rake test TEST=test/test_foobar.rb`
      - `rake`を`rails`にしてしまうと効かないみたい
- minitest vs test-unit
  - [意見交換 test-unit vs. minitest - Qiita](https://qiita.com/scivola/questions/dfc339b3639336649355)
    - (素の)minitestはDSLみたいな書き方はできない
      - railsならできるのはrailsが拡張しているから
    - test-unitはデータ駆動なテストも書ける
      - minitestじゃできない
  - [library test/unit (Ruby 3.1 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/latest/library/test=2funit.html)
  - [library minitest/unit (Ruby 3.1 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/latest/library/minitest=2funit.html)
  - [Rubyのテスティングフレームワークの歴史（2014年版） - 2014-11-06 - ククログ](https://www.clear-code.com/blog/2014/11/6.html)
- エラーをrescueでキャッチして、その中でRollbarなどに報告したのちに握り潰しているような処理は、テスト環境だとRollbarの出力は見えない上にRuby的にも例外が見えないから、ミスに気づきにくい
  - テスト時にだけ上書きするといいかもしれない
    - 異常系テストでは邪魔になるだけだから必要なときのみ使おう
  ```rb
module Rollbar
  class << self
    def error(...)
      print 'Rollbar.error is called with: '
      p(...)
    end
  end
end
  ```

- `assert_difference(-> { hoge.count } => 100) do fuga end`
- 配列の中身がある条件を満たしてほしいときは、`include`と`have_attributes`を合わせて使える
  - `expect([1,2]).to include(have_attributes(to_s: "1", odd?: true))`
  - [Rspec — 僕の知らなかったRspec - Qiita](https://qiita.com/YumaInaura/items/223a7d55af385e1b9503#include--have_attributes)
  - `include`の他には`contain_exactly`など
  - (頑張れば)構造化されたデータを一発で検証できる
- モデルを作った後でfactoryを作りたいとき(factorybot)
  - [ruby on rails - Can FactoryBot generate factories after your models have been created? - Stack Overflow](https://stackoverflow.com/questions/11702265/can-factorybot-generate-factories-after-your-models-have-been-created)
  - `rails g factory_bot:model Car name speed:integer`のように打つ
- [flaky test]の減らし方について
  - [大阪Ruby会議03でflaky testについて話してきました - おもしろwebサービス開発日記](https://blog.willnet.in/entry/2023/09/12/105149)
    - `Capybara.disable_animation = true`
    - https://github.com/willnet/capybara-wait_image
      - >wait for the image to load automatically 
    - https://github.com/willnet/ci_logger
      - 失敗したテストのログだけ出す
    - 失敗時の動作の動画化
    - [https://gyazo.com/7e28dd368b88ba12bc3a930547bbc5f9]
- `perform_enqueued_jobs`
  - 入った[ActiveJob]を同期実行ためのヘルパーメソッド
