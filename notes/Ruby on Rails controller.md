---
tags: "Rails, strong parameters"
---

# Ruby on Rails controller

- respondt_to
  - [respond_toを初心者向けに完全分解 - Qiita](https://qiita.com/hirokihello/items/79b744fed026e199a07f)
  - format(htmlやjsonとか)に応じて処理を分けるときにつかう
- モデル保存成功の判断
  - [第10章 ユーザーの更新・表示・削除 - Railsチュートリアル](https://railstutorial.jp/chapters/updating_and_deleting_users?version=5.1#sec-unsuccessful_edits)
  - create
    - newして、saveして、validかどうかを返り値で判断
  - update
- findして、updateの返り値で判断
- update_attributesはupdateのエイリアス
  - [ActiveRecord::Persistence](https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-update_attributes)
- [and returnを使うときの注意点 - Qiita](https://qiita.com/katsuyuki/items/abf6b8d1cd43915e5586)
  - `redirect_to :piyo and return`
- `redirect_to`の返り値は文字列だけど、返す値の情報は`response`変数に入っている
- `after_action`はviewの**後**に呼ばれるので注意!
- Railsのメソッド、HTTPのメソッド、`remote true/false`が混乱するので注意
  - ユーザー更新とかは、`Rails: PATCH, HTTP: POST, remote: false`のはず
  - スターを付けるとかは、`Rails: POST, HTTP: POST, remote: true`のはず
  - formatも紛らわしい
- `remote: true`で来たけど、条件によって`redirect_to`させたいとき
  - jsのメソッドでページ遷移させる方法しかなさそう..
  - [【Rails】ajax通信 -> 処理 -> redirect_toのやり方(remote: true/controller) - Qiita](https://qiita.com/geshi/items/536956b8bed7c2126187)
- `rescue_from`の`with:`で、rescue後の処理を指定できる
- たとえばBooksControllerでは、インスタンス変数は`@books`のみ定義してあげて、`@books.comments`のような子・親モデルのインスタンス変数は定義しないほうがよい?
  - でもそうすると [Railsのパターンとアンチパターン3: ビュー編（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=112127) のような状況が起きてしまう
- strong parameters
  - >Action ControllerのパラメータをActive Modelの「**マスアサインメント**」で利用することを禁止します（許可されたパラメータは除く）
    - マスアサインメント：一気に渡すやつ
- strong parametersで任意のHashや配列を受け取るには、`params.permit(key_name: {})`のようにする
  - `{ key_name: { 2023/11/01 => true, ... } }` のようなparamsを受け取りたいときなどに。
