---
tags: "Rails, Ruby_on_Rails, Ruby"
---

# Ruby on Rails routing

- `/rails/info/routes`でpathヘルパーとかを見れる
- resourcesじゃなくてgetとかでルーティングすると、パスヘルパーが使えない
  - POSTじゃなくてPATCHやDELETEにしてくれる
- [Railsのresourcesとresourceついて  - Qiita](https://qiita.com/Atsushi_/items/bb22ce67d14ba1abafc5)
  - resource(←sが無い)だと、index以外のルーティングをしてくれる
  - `resources`
    - >「人」や「本」などのようにアプリケーション上に「複数存在する」リソース
    - URLのリリース名にsがつく (ex: `/hoges/new`)
    - 記法：`resources :リソース名s`
  - `resource`
    - >自身のプロフィールの様に、ログインユーザーからみてアプリケーション上、１つしか存在しない様なリソース
    - URLのリリース名にsがつかない (ex: `/hoge/new`)
    - 記法：`resource :リソース名`
- resourcesのブロック直後にgetとか書くと、memberブロック内扱い
  - idがつく
  - idつけなくするには、collectionブロック内に書く
  - https://techracho.bpsinc.jp/baba/2020_11_20/15619
- [Railsのroutingにおけるscope / namespace / module の違い - Qiita](https://qiita.com/ryosuketter/items/9240d8c2561b5989f049), https://railsguides.jp/routing.html
**まとめ**

|  | URLへの影響 | ディレクトリ構造への影響 | ルーティング |
| --- | --- | --- | --- |
| resources | あり | なし | つくる |
| resource (sなし) | あり | なし | つくる (index以外) (末尾にsがつかない) |
| scope | あり | なし | つくらない |
| namespace | あり | あり | つくらない |
| module | なし | あり | つくらない |

- `resources`と`scope`の違いは、`resources :hoge do`はHogeControllerへのルーティングを作るが、`scope :hoge do`はつくらない点
- `resources`をネストすると、URLは`foo/1/bar/2`のようになるが、ファイル構成は`::BarsController`となる
  - これを、`Foos::BarController` としたいときは、`scope module: :foo do`を加える
  - [routeのresourcesのnestした部分をnamespaceにする方法 - mikami's blog](https://mikamisan.hatenablog.com/entry/2016/09/28/233751)
```ruby
resources :foo do
  scope module: :foo do
    resources :bar
  end
end



```
