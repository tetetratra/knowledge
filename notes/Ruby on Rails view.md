---
tags: "Ruby on Rails, Rails, Yarn, Webpacker, Sprockets, 45602, sass-rails"
---

# Ruby on Rails view

-  Ruby on Rails
  - [Rails 6: Webpacker+Yarn+Sprocketsを十分理解してJavaScriptを書く: 後編（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=85943)
    - Yarnのファイル
      - package.json
    - Webpackerのファイル
      - config/webpacker.yml
      - app/javascript/packs/application.js
      - app/views/layouts/application.html.erb
    - Sprocketsのファイル
      - app/assets/config/manifest.json
  - simple_formのgem
    - https://github.com/heartcombo/simple_form
    - ` simple_form_for :piyo` で、`params[:piyo]`のフォームができる
    - エラーの表示forとかもやってくれるらしい?
  - チェックボックスは文字列で送信されることに注意
    - [check_boxによって送られてくるパラメータを真偽値として扱う方法 - Qiita](https://qiita.com/kadoppe/items/1b49bf6b8f2e0dbb7518)
  - kaminariで、`remote: true`は、画面の描画がAjaxされるのであって、ページネーションのDOMが非同期になるわけではない
    - ページネーションの全体件数カウントのクエリが遅くて、早くしたいときにずっとこれで検索してて時間浪費してしまった
  - モーダルみたいなのを非同期で
    - [Railsで remote: true と js.erbを使って簡単にAjax(非同期通信)を実装しよう！(いいね機能のデモ付) - Qiita](https://qiita.com/__tambo__/items/45211df065e0c037d032)
    - `link_to`を`remote: true`で
    - `.js.erb`をrender
      - ここで、HTMLを付け加えるjsを実行する。付け加えるHTMLは非同期で出すモーダル
      - jsエスケープは`j`メソッド
      - jqueryには`modal`メソッドがある
  - falthryをfalseにするには
    - [ActiveRecord::Type::Boolean#cast の返り値が nil となるケースについて - Qiita](https://qiita.com/natsuokawai/items/5ac1a9704805ff17b3f2)
    - 空文字とnilはnilになるので注意
  - `form_for(@obj) do |f| の@ojbは`f.object`で取れる
  - [Rails 国際化（i18n）API - Railsガイド](https://railsguides.jp/i18n.html#%E5%9F%BA%E6%9C%AC%E7%9A%84%E3%81%AA%E5%8F%82%E7%85%A7%E3%80%81%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97%E3%80%81%E3%83%8D%E3%82%B9%E3%83%88%E3%81%97%E3%81%9F%E3%82%AD%E3%83%BC)
    - >したがって、以下の4つの呼び出しはすべて等価です。
```rb
I18n.t 'activerecord.errors.messages.record_invalid'
I18n.t 'errors.messages.record_invalid', scope: :activerecord
I18n.t :record_invalid, scope: 'activerecord.errors.messages'
I18n.t :record_invalid, scope: [:activerecord, :errors, :messages]

```

- viewの`render`メソッドは`actionview-7.0.4.2/lib/action_view/helpers/rendering_helper.rb:30`にある
  - https://api.rubyonrails.org/classes/ActionView/Helpers/RenderingHelper.html#method-i-render
  - `render(options = {}, locals = {}, &block)`という形式の引数
    - `[[:opt, :options], [:opt, :locals], [:block, :block]]`
- form_forのラジオボタンとかで、「デフォルト値を設定するための値」と「コントローラーへ送信するときの値」を別の値にしたいとき
  - 一旦「デフォルト値を設定するための値」でタグを生成して、それをgsubすれば良い
```ruby
# フォームのデフォルト値の設定では User#gender_converted の値を使うが、
# コントローラーへ送る際は `user[gender]: 'male'` のように gender というキーで送る
form.radio_button(:gender_converted, 'male').gsub('gender_converted', 'gender').html_safe

```

- 部分テンプレートの引数(`locals`でしていするやつ)を制限できるテンプレート機能が入る
  - [Allow templates to define which locals they accept by joelhawksley · Pull Request  · rails/rails](https://github.com/rails/rails/pull/45602)
  - `<%# locals: (title: "Default title", comment_count: 0) %>`のように書く
    - デフォルト値を設定可能
    - パターンマッチで受け取る際に分解可能
- [アセットパイプライン - Railsガイド](https://railsguides.jp/asset_pipeline.html#sprockets%E3%81%AE%E5%88%A9%E7%94%A8%E6%B3%95)
  - 1ファイルにまとめたいCSSのファイル郡を manifest.js に書く
- sass-rails gem
  - manifest.jsに`.css`と書いても、`.scss`ファイルを探しに行ってくれて、cssファイルへのコンパイルもしてくれる
