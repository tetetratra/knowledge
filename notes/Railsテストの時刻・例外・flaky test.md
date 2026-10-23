---
tags: "Rails, Minitest, flaky test, ActiveJob"
---

# Railsテストの時刻・例外・flaky test

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

![flaky testの対策](../assets/7c5ab6bc0559fc32cc3fe5f036f78906927bb93dfbafa15580b98f9b94de2e01.png)
    - [https://gyazo.com/7e28dd368b88ba12bc3a930547bbc5f9]
- `perform_enqueued_jobs`
  - 入った[ActiveJob]を同期実行ためのヘルパーメソッド
