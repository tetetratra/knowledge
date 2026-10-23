---
tags: "inverse_of, Ruby on Rails, Ruby_on_Rails_マイグレーション"
---

# Ruby on Rails inverse_ofオプション

- inverse_of
- Ruby on Rails
- Ruby_on_Rails_マイグレーション
  - 「親モデルが見る子モデルが見る親モデル」が、最初の親モデルに一致するようになる設定
  - デフォルトで設定される
  - [inverse_of について - Qiita](https://qiita.com/itp926/items/9cac175d3b35945b8f7e)
    - >inverse_of を使うと、同じオブジェクトをみるようになり、
    - > このようなデータの不整合が生じなくなるとともに
    - > 無駄にオブジェクトを生成しないので、アプリケーションの効率もよくなる。
  - [週刊Railsウォッチ（20191021）Rails 6でhas_many関連の修正やSprockets 4.0対応、Shrine 3.0がリリース、Minitestスタイルガイドほか｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=82012)
    - >なお、以下の記事 ( https://makandracards.com/makandra/33309-rails-4-1+-automatically-detects-the-inverse_of-an-association )では
    - >**「Rails 4.1以降ではinverseの自動検出機能がある」**
    - >**「inverseの自動検出はhas_many、has_one、belongs_toでのみ効く」**
    - >**「関連付けにそれ以外のオプションを付けると自動検出されなくなる」**
    - >ともあります。APIのActiveRecord::Associations::ClassMethodsの「Setting Inverses」にも同じ記述がありました。
  - [Railsの6.1で変更されたinverse_ofの挙動とハマったポイント](https://zenn.dev/yasuno0327/articles/8ca7000096893a)
    - >Railsの6.1では、inverse_ofの挙動に変更が入りました。
    - > 内容としては、Rails6.0以前までは動いていなかったbelongs_toからのinverse_ofも機能するようにする変更が入っています。
    - 実装について詳しく解説している
  - [ActiveRecord 双方向関連付けとinverse_of](https://zenn.dev/igaiga/books/rails-practice-note/viewer/ar_inverse_of#双方向関連付けが自動認識されないケース)
    - 双方向関連付けが自動認識されないケース
      - >ActiveRecordは規約通りであればこのように自動で双方向関連付けを行いますが、規約から外れた名前をつかうとき、たとえば:foreign_keyや:throughオプションをつかうときには、双方向関連付けを自動認識しません。
