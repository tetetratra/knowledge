---
tags: "Ruby_on_Rails, マイグレーション, Ruby_on_Rails_マイグレーション, scope, bulk_insert, bulk, JSON型, SQL, Ruby_on_Rails_test"
---

# Rails model: 保存処理と関連付け

- Kaminariで、COUNTするサブクエリのSELECT句が1を指定しているので、havingで集計済みの結果が取れない問題
```sql
SELECT COUNT(*)
FROM (
  SELECT 1 -- 自動で1のみ指定になってしまう. 元のsqlは is_foobar をSELECTしているのでHAVINGで使える
  FROM table_name
  GROUP BY col_name
  HAVING (is_foobar = 1) -- ココでエラーに
) subquery
```

- => HAVING句に計算を書くことで解決
- kaminariでコントローラーとアクション指定
  - [ruby on rails 3 - How to specify a controller & action for Ajax pagination with Kaminari? - Stack Overflow](https://stackoverflow.com/questions/7942347/how-to-specify-a-controller-action-for-ajax-pagination-with-kaminari)
  - `:params => {:controller => :exchanges, :action => :paginate_remotely}`
- has_manyに`autosave: true`オプションをつけると、親のsaveで子のsaveもしてくれる。
  - https://railsguides.jp/association_basics.html#belongs-toのオプション-autosave
  - 子レコードに`mark_for_destruction`メソッドを呼ぶと、親のsave時に削除してくれる
    - [ActiveRecord::AutosaveAssociation](https://api.rubyonrails.org/classes/ActiveRecord/AutosaveAssociation.html)
  - めちゃくちゃバグを踏みそう
    - https://github.com/rails/rails/issues/17466
    - 親が子を子だと認識できていなくて、子のsaveをしてくれないときがある。トランザクションを使ったほうがよさそう
  - `指定なし`, `autosave: true`, `autosave: false` の3種類ある
    - [ActiveRecord::AutosaveAssociation](https://api.rubyonrails.org/classes/ActiveRecord/AutosaveAssociation.html)
    - 一般的な「`指定なし`」の場合、親のsave時に**子が作られていなければ**子もsaveされる
      - 親が未saveでも子のbuildはできて、親のsave時に子もsaveされる
      - > When `:autosave` is not declared new children are saved when their parent is saved:
```rb
class Post < ActiveRecord::Base
  has_many :comments # :autosave option is not declared
end

post = Post.new(title: 'ruby rocks')
post.comments.build(body: 'hello world')
post.save # => saves both post and comment

post = Post.create(title: 'ruby rocks')
post.comments.build(body: 'hello world')
post.save # => saves both post and comment

post = Post.create(title: 'ruby rocks')
comment = post.comments.create(body: 'hello world')
comment.body = 'hi everyone'
post.save # => saves post, but not comment

```

- `accepts_nested_attributes_for`
  - >form でネストする params を作って異なる model の属性を格納し、一回のアクションで同時にsaveしたい。
  - [accepts_nested_attributes_forの使い方 - yshrfmru’s diary](https://yshrfmru.hatenablog.com/entry/2018/11/25/183126)
  - [Rails API: ActiveRecord::NestedAttributes（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/?p=132223)
- トランザクションのときは、`ActiveRecord::Base.transaction`内で、こんな風に書くとシンプルそう?
  - エラーを起こす update!, create!, destroy! を保存時には使うこと
```ruby
rescue ActiveRecord::RecordInvalid => err
  render json: { _errors: err.record.errors }, status: :unprocessable_entity

```

- `attribute_before_last_save`でafter_save内でsave前の値が知れる
  - むずそう
  - [Rails 5.1 で attribute_was, attribute_change, attribute_changed?, changed?, changed 等が DEPRECATION WARNING - Qiita](https://qiita.com/htz/items/56798d53ec5988733fc6)
  - `name_before_last_save`のような使い方?
- `t.references` は `type: :integer`のようにオプションを取れる
- 共通のbefore_saveとかを書きたいときどうするか。
  - 継承すると、その分のDBテーブルが必要？
  - Moduleで解決するのが良いらしい
  - https://qiita.com/iwsksky/items/e4baed3d7ef1b98f3ec5
  - moduleでは定数やメソッドは定義できるけど、メソッドをよびだすことはできないからbefore_saveできなかった。
    - includedメソッドで、ブロックに処理を渡すと、呼び出せる
    - https://ref.xaio.jp/ruby/classes/module/included
    - https://qiita.com/aosho235/items/1867be19d044d83127d4
**main.rb**

```ruby
 module CrawlFinishedAtSupport
  def self.included(base)
   base.class_eval do
    before_update :add_crawl_finished_at_colmn
   end
  end

  def add_crawl_finished_at_colmn
   self.crawl_finished_at ||= Time.now
   self
  end
 end
```

- updateで注意すること
  - attributes => save が中で起きてる
    - attributeはメモリでの値の設定
    - saveはDBの更新
  - https://www.rubydoc.info/docs/rails/4.1.7/ActiveRecord/Persistence#updateinstance_method
  - attributeとsaveの2つの操作があることに注意。
  - [ActiveRecord の attribute 更新方法まとめ Qiita](https://qiita.com/tyamagu2/items/8abd93bb7ab0424cf084)
  - saveが失敗したらattributeもなかったことにしてくれる方法があれば嬉しい。
- 関連付け系のローディングについて
  - [ActiveRecordのjoinsとpreloadとincludesとeager_loadの違い - Qiita](https://qiita.com/k0kubun/items/80c5a5494f53bb88dc58)

    **まとめ**

    | メソッド | キャッシュ | クエリ | 用途 |
    | --- | --- | --- | --- |
    | joins | しない | 単数 (INNER JOIN) | 絞り込み |
    | eager_load | する | 単数 (LEFT OUTER JOIN) | キャッシュと絞り込み |
    | preload | する | 複数 | キャッシュ |
    | includes | する | 場合による | キャッシュ、必要なら絞り込み |

  - include以外のメソッドを用途別に使おう
  - [ActiveRecordを使うときは頭にSQLを描こう - Qiita](https://qiita.com/ham0215/items/bf99d3c44e029176c2af)
