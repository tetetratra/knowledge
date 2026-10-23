---
tags: "GraphQL, graphql-ruby, 認可, トレーシング, query, mutation"
---

# GraphQL

- [graphql-rubyを使って認可する方法 - Qiita](https://qiita.com/ham0215/items/fa4ce59b5cbedfb1fb7d)
  - `authorized?`メソッドを利用する
  - > Type classes have `.authorized?(object, context)` class methods
  - > Fields have `#authorized?(object, args, context)` instance methods
  - > Arguments have `#authorized?(object, arg_value, context)` instance methods
- サーバーサイドの流れ(graphql-rubyの場合)
  - route.rbで`/graphql -> GraphqlController#execute`みたいにする
  - `(AppSchema < GraphQL::Schema)#execute`結果を返す
- トレーシング
  - [GraphQL - Tracing](https://graphql-ruby.org/queries/tracing)
  - >GraphQL::Tracing provides a `.trace` hook to observe events from the GraphQL runtime.
  - イベントが起こるごとにyieldされる
- queryはサーバーサイドの事情に関係なく柔軟なクエリを発行できるけれども、mutationはサーバーが決めた構造の引数しか受け付けないことについて
  - [「GraphQLのmutationは動的にネストしたリソースを更新するもの」ではない - suusan2号の戯れ](https://suzan2go.hatenablog.com/entry/2018/11/21/002138)
  - そもそもgraphqlがそういう思想らしい
- [graphql-ruby エラーの設計と実装 - STORES Product Blog](https://product.st.inc/entry/2024/11/22/120625)
