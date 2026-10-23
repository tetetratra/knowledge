---
tags: "Rails, RSpec, Minitest, モック"
---

# Railsテストの共通化・モック・スタブ

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
