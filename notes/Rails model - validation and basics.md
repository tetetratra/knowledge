---
tags: "Ruby_on_Rails, マイグレーション, Ruby_on_Rails_マイグレーション, scope, bulk_insert, bulk, JSON型, SQL, Ruby_on_Rails_test"
---

# Rails model: モデルの検証と基本操作

- マイグレーションや、テーブル定義関連の話は Ruby on Rails マイグレーション へ
  - `ActiveModel::Model`をincludeすると、DBに保存しないモデルを扱える
    - 検索フォーム専用のモデルを作ったり
      - [1.1. 検索フォームの実装 — Railsアプリケーション構築ガイド](https://rails.densan-labs.net/form/search_form.html)
      - [【Rails】FormObjectを使ってほしい - Qiita](https://qiita.com/9ro/items/10e3676741e09ffb98bb)
      - [【Rails】Form Objectを使ってModelに依存しないFormを作成する ｜ もふもふ技術部](https://tech.mof-mof.co.jp/blog/rails-form-object/)
  - 単一モデルで検索を扱うときはこっち
    - [【Rails】一覧ページ上部に検索機能を実装する ~ form_with ~ - Qiita](https://qiita.com/shin1rok/items/779e581e9d12a92310c3)
    - モデルに検索用scopeを作って、formの値はまとめてハッシュ的なインスタンス変数1つに。
- **has_secure_password**
  - モデルに、`has_secure_password`を付けると、`password`という名前で、暗号化の処理は考えなくてレコードの更新ができる
    - リファレンス: [ActiveModel::SecurePassword::ClassMethods](https://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html)
    - [Ruby on Rails の has_secure_password のコードを読んでみる - What is it, naokirin?](https://naokirin.hatenablog.com/entry/2019/03/29/032801)
    - [Railsのhas_secure_passwordとは - Qiita](https://qiita.com/shumpeism/items/4d8946ade2dbdccab31c)
      - >セキュアにハッシュ化したパスワードを、データベース内のpassword_digestという属性に保存できるようになる。
      - > 2つのペアの仮想的な属性（passwordとpassword_confirmation）が使えるようになる。また、存在性と値が一致するかどうかのバリデーションも追加される 。
      - > authenticateメソッドが使えるようになる（引数の文字列がパスワードと一致するとUserオブジェクトを、間違っているとfalseを返すメソッド）。
    - [第6章 ユーザーのモデルを作成する - Railsチュートリアル](https://railstutorial.jp/chapters/modeling_users?version=5.1#sec-adding_a_secure_password)
    - `model.authenticate("aabbcc")` で、パスワードが引数の文字列どうかを確かめられる
    - updateやsaveで、passwordに空文字列を渡すと、パスワード更新をスキップしてくれるらしい
      - https://teratail.com/questions/248543
      - けど、公式リファレンスを読んでも記載は見当たらない
    - passwordのバリデーションをこれに追加で付けるときは、`allow_nil: true`をしないと、(passwordは仮想的に扱えるカラムなので)、1カラムだけupdateとかで毎回バリデーション失敗になってしまう。
  - messageオプションで、invalid時のメッセージを変えられる
    - [Active Record バリデーション - Railsガイド](https://railsguides.jp/active_record_validations.html#%E3%83%90%E3%83%AA%E3%83%87%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97)
    - `@rec.errors`でとれる
    - simple_form gemを使うと、このメッセージを自動でviewに表示してくれる
      - [GitHub - heartcombo/simple_form: Forms made easy for Rails! It's tied to a simple DSL, with no opinion on markup.](https://github.com/heartcombo/simple_form)
  - alias定義するときは`alias_attribute `
    - [Railsのカラムにaliasをかける - Qiita](https://qiita.com/jkr_2255/items/168a35e937166e5e9790)
    - イコール付きメソッドとかもまとめてaliasにしてくれる
  - 条件付きユニーク
    - [Rails - Modelのユニークバリデーションを複数項目で判定 - Kei178's blog](https://kei178.me/programming/1025/)
  - モデルのvalidationを、特定の場合のみに適用・スキップ
    - [Active Record バリデーション - Railsガイド](https://railsguides.jp/active_record_validations.html)
    - `unless: -> { validation_context == :hoge }`
    - コントローラーでは、`@model_object.save(context: :hoge)`のようにかく
    - updateメソッドではcontextを設定できない
    - [Rails4でModelのvalidatesを切り替える - Qiita](https://qiita.com/HamaTech/items/e4016224a134f1b35535)
    - `user.attributes = { email: 'test@mail.com' }`  `user.save(context: :hoge)`のように書く
  - active recordのwhereとかで、boolにbool以外の値を使う時
    - [tinyint(1)がtrue, falseなのはRailsの世界 - hatappi.blog](https://blog.hatappi.me/entry/2018/05/05/154429)
    - `[false, 0, "0", "f", "F", "false", "FALSE", "off", "OFF"]` がFALSE扱い
  - preloadして、子のSUMをする
    - [How to eager load child model's sum value for ruby on rails? - Stack Overflow](https://stackoverflow.com/questions/30112199/how-to-eager-load-child-models-sum-value-for-ruby-on-rails)
  - 加工処理をどこに書こう問題
    - 「Rails実践入門」より
    - ビューにそのまま書くと見にくい(醜い)
    - ヘルパーは、全view共通で定義されちゃうから名前付けが難しい
    - モデルは、MVCから離れててイマイチ
    - なので、デコレーターという選択肢がある
      - そのままだと、`return view_context.link_to(...)`のように書く必要があるので委譲を使うと良い
  - `uniq`は`distinct`のaliasになってるので注意!
    - `model_ojbect.method(:uniq).source_location #=> ActiveRecordのソースの場所が出る`
    - Emumのuniqを使うには、、、
  - [Railsでこの時だけ特定のバリデーションを検証したくないときしたこと - hatappi.blog](https://blog.hatappi.me/entry/2017/04/13/201505)
    - `unless: -> { validation_context == :hoge }`
  - modelのerrorについて
    - [【Rails】errors.addって何？ - Qiita](https://qiita.com/yujiG/items/3e34e2e0e7b4120b0584)
    - 調べたら出てきたのが知ってる人だった..!
  - user_idが同一内でnameがユニーク、みたいな制約をかけることができる
  - `find_or_initialize_by`
    - レコードがなければ作って(new)あればそれを使う(find_by)
  - `ActiveRecord::Base.transaction`でトランザクションの開始
    - `raise ActiveRecord::Rollback`でロールバックしてブロックを抜ける(後の処理も実行する)
    - それ以外のエラーraiseだと、ロールバックして、ブロックの外側でもraiseされている状態になる(rescueに行くやつ)
    - コンソール見てると`BEGIN, ROLLBACK`とか出てくる
  - すでに定義されたvalidationを新しく上書きするのは難しそう?
    - [Railsのvalidationの実行過程を調べる - Qiita](https://qiita.com/wakasa51/items/b3d65eac5cdad7787083)
  - [Railsモデルの関連付けでbuildを使う時のメソッド名](https://gist.github.com/seak0503/7291012e7e99fc8aca80)
    - >モデル間の関連付けの際に、データを保存したくない場合はbuildを使うが、 関連付けのパターンによって、メソッド名が変わる
    - [railsのnewとbuildの違い - Qiita](https://qiita.com/sukechansan/items/6bae532b4f678fdcf87d)
      - buildもnewと同じ。でも慣用的に関連モデルはbuildで作ることが多い
  - presenceとかのvalidationをこう書くこともできる
    - `validates_presence_of(バリデーション対象 [, ...])`
    - https://railsdoc.com/page/validates_presence_of
  - jbuilderのcall
    - [Method: Jbuilder#call — Documentation for rails/jbuilder (master)](https://www.rubydoc.info/github/rails/jbuilder/Jbuilder:call)
    - https://github.com/rails/jbuilder/blob/master/lib/jbuilder.rb#L224-L230
```ruby
def call(object, *attributes, &block)
  if ::Kernel.block_given?
    array! object, &block
  else
    extract! object, *attributes
  end
end


```
