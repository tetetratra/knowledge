---
tags: "Ruby_on_Rails, マイグレーション, Ruby_on_Rails_マイグレーション, scope, bulk_insert, bulk, JSON型, SQL, Ruby_on_Rails_test"
---

# Rails model: ページネーションとActiveRecordの応用

- kaminariのtotal_countをAPIモードで返すとき
- コントローラーで `response.headers['X-Total-Count'] = @records.total_count`
- フロントの受け取る処理で`X-Total-Count`を取り出す

- マイグレーションファイル内の`execute`で、up/down時にSQLを発行できる
- バッチファイルを当てる代わりに使えたり

- delegated type
- https://github.com/rails/rails/pull/39341
  - 入ったプルリク
- [Rails: ActiveRecord::DelegatedType APIドキュメント（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2022_04_12/112882)
  - プルリクの和訳
- テーブルの共通のカラムは親テーブル＆親モデルで持つ
- テーブルごとに違うカラムは子テーブル＆子モデルで持つ

- ActiveModelを構成する色々なモジュール
- `ActiveModel::Validations`
  - バリデーション(`validates :hoge`)ができるようになる
- `ActiveModel::AttributeAssignment`
  - `assign_attributes`を使えるようになる
- `ActiveModel::Attributes`
  - `attribute :flag, :boolean, default: false`のようなものを使えるようになる

- `pluck(Arel.sql('count(id)'))`

- モデル A,B,C が 1:N:1 のとき、`a.bs.map { |b| b.c }`のようなことがしたいなら、Aのhas_manyにCを`through`で指定すればOK

- ActiveRecord関連付けの3大激ムズ機能
- [ポリモーフィック関連付け]
  - `type`と`id`をもつやつ
  - なんでも紐づけできる
  - モデルとテーブルが多：1
- [STI]
  - `type`をもつやつ
  - typeによっては無駄になるカラムが発生したりする
  - モデルとテーブルが多：1
- [delegated type]
  - STIの無駄を無くしたもの
  - モデルとテーブルが1：1
  - 共通のカラムのみ一つのテーブルに切り出す

- `ActiveRecord::Relation => ActiveRecord` を返すようなメソッドを生やしたいとき
- `current_user.hoges.current #=> 最新Hogeのインスタンス` のようなことができる`current`メソッドを生やしたい
- https://stackoverflow.com/questions/13070658/first-or-limit-in-rails-scope
- クラスメソッドとして生やせば ActiveRecord::Relation からも使えるようになるらしい


  - > 🔗 Rails 7版: Active Recordのさまざまなattribute更新系メソッドの比較リスト（Ruby Weeklyより）
- [週刊Railsウォッチ: Active Recordのattribute更新系メソッド比較リスト、Railsリファクタリングガイドほか（20220425前編）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2022_04_25/117359#2-2)
- [Different Ways to Set Attributes in ActiveRecord (Rails 7)](https://scottbartell.com/2022/04/12/set-attributes-in-active-record-rails-7/)

- [![図](../assets/5972f62350ed86d9d31fe6c2b3e44b9c9d1f9a7b9a69bf3a01e331b8c535f6ed.png)]
  - 一度のクエリで、scopeの付いた同一クラスのリレーションを複数扱うときは注意
    - 記事
      - [Rails 6.0でDeprecatedになるActive Recordの振る舞い3つ - かみぽわーる](https://blog.kamipo.net/entry/2019/05/15/152652#:~:text=これは説明がむずかしいというか面倒なんですけど%E3%80%81たとえばTopicのツリー型の掲示板みたいなものがあったとして%E3%80%81トップレベルのTopic%E3%80%81かつその中でも子スレッドを持つものをscopeとして定義したいとします%E3%80%82)
      - [DEPRECATION WARNING: Class level methods will no longer inherit scoping from スコープ名 in Rails 6.1. 〜〜 の解説 Rails6 - Qiita](https://qiita.com/KeiSakam/items/7964fd43865c7fea8817)
      - https://railsguides.jp/6_1_release_notes.html#active-record-主な変更:~:text=名前付きスコープをチェーンしたときのスコープが%E3%80%81クラスレベルのクエリメソッドにリークしないようになった
    - Rails 6.0まで
      - あるクエリAにscopeを付けると、モデルクラスの(内部的な)グローバル変数を利用してscopeが付くので、別のクエリBの発行時にクエリAのscopeが付くことがある
    - Rails 6.1から
      - ↑の挙動が治ったが、逆にこの挙動に依存していいた処理は注意が必要
    - 例
      - Rails6.0までは `Model.admin.where(条件2).or(Model.where(条件2))` で、or内のクエリにも`scope :admin`が付いた
      - Rails6.1からは付かないので、`Model.admin.where(条件1).or(Model.admin.where(条件2))`のようにor内のクエリにも`.admin`を付ける必要がある
        - `scope = Model.admin; scope.where(条件1).or(scope.where(条件2))`のような書き方もアリ
  - Rails6.1からは`.not(...)`に複数条件を渡したときに**NORではなくNAND**になった
    - https://railsguides.jp/6_1_release_notes.html#active-record-主な変更
    - `.not(A, B)`と書いたとき
      - 6.0まで：「Aじゃない」かつ「Bじゃない」
        - (not A) and (not B) = not (A or B) = A nor B
      - 6.1から：「AかつB」じゃない
        - not (A and B) = A nand B
        - こっちの新しい挙動の方が若干直感的かも?
  - 同一テーブルの複数データのcreate!が誕生した場合、bulk化を考慮する
    - bulk自体はバグりやすいので、必要になるまでbulk化はしなくていい
    - 少し書き換えるだけですぐにbulk化できるようなコードにはしておく
  - JSON型
    - mysql5.7から標準でサポートされている
      - JSON型を扱う関数とかがある
    - Railsでも使える
  - どんなクエリが流れているか知りたいとき
    - `echo -n '' > log/test.log && less -R +F log/test.log`してrspecして
    - `cat log/test.log | grep SELECT | sort | uniq | grep ちょうどよいキーワード`からの目grep
  - 定数とマスタデータの半々くらいのデータはActiveHashで表現する選択肢もある
  - 非正規化されてしまったマスタデータ的なenumのカラムがあるとき、妥協案としてActiveHashとかを使って分解する方法がある
    - `emum { :hoge_fuga_piyo, :hoge_fuga, :hoge, ... }`のようなenumがあるとき、`:hoge, :fuga, :piyo`ごとにカラムを作って正規化するのが設計としては正しい。ただ、今更治すのはとても大変という時がある
    - こういうとき、実質的に`:hoge, :fuga, :piyo`カラムがあるようなインターフェースをActiveHashとかを使って用意してあげることで、既存のシステムに手を加えずにマシな設計で進むことができる
  - `eager_load` で`LEFT OUTER JOIN`されるのは知っていたけれど、1：多 の多側を`eager_load`してもrails側でよしなにやってくれてレコードの重複は起きないの知らなかった... なんか勘違いしていた
    - `limit`とかと併用するときはまた変な挙動をするから注意
