---
tags: "Rails, RSpec, Capybara, feature test"
---

# RailsのfeatureテストとCapybara

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
