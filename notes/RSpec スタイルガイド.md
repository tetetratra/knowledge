---
tags: "テスト, RSpec, Ruby_on_Rails_test, コーディング"
---

# RSpec スタイルガイド

- [willnet/rspec-style-guide: 可読性の高いテストコードを書くためのお作法集](https://github.com/willnet/rspec-style-guide)
  - >可読性の高いテストコードを書くためのお作法集です。
  - `let`を上書きしない
    - こうだと思っていた
      - factoryではデフォルト値の設定は最小に
      - specでは、各contextで共通で使う値は、各contextのletからパラメータを微調整する
```rb
let(:user) { create :user, mail: mail }
context 'mail empty' do
  let(:mail) { nil }
context 'mail exist' do
  let(:mail) { 'test@example.com' }
```

- こっちのほうがいいらしい
  - factoryではデフォルト値の設定は、ランダムにして全て埋める
  - specでは、各contextごとに使う値をletで定義する
```rb
context 'mail empty' do
  let(:user) { create :user, mail: nil }
context 'mail exist' do
  let(:user) { create :user, mail: 'test@example.com' }
```

- `allow_any_instance_of`を使うようなケースでは、そもそもの設計が間違えているかも
  - DIしたほうがいいかもらしい
    - → https://zenn.dev/murakamiiii/articles/eddd69f3dcde18#allow_any_instance_ofの書き換え
- `let, let!, before`の使い分け
  - 参照する?
    - Yes
      - 参照される前に評価したい?
        - Yes → `let!`
        - No → `let`
    - No → `before`
  - `let!`の是非
    - (`let!`の)実行順序というルールを持ち込んでしまうデメリットがある
    - `let`と`let!`を使い分ける面倒さがある
    - 人による [willnet/rspec-style-guide: 可読性の高いテストコードを書くためのお作法集](https://github.com/willnet/rspec-style-guide#let%E3%81%A8let%E3%81%AE%E4%BD%BF%E3%81%84%E5%88%86%E3%81%91)
