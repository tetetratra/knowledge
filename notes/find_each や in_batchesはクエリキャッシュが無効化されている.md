---
tags: "ActiveRecord"
---

# find_each や in_batchesはクエリキャッシュが無効化されている

- ActiveRecord
- `find_each` や `in_batches`はクエリキャッシュが無効化されている
  - `find_each` や `in_batches`は、内部でクエリキャッシュを保持しない設定でクエリを実行しているので、クエリキャッシュによるメモリ消費の増加は**発生しない**
    - https://github.com/rails/rails/blob/main/activerecord/lib/active_record/relation/batches.rb#L430
**activerecord/lib/active_record/relation/batches.rb**

```
relation.skip_query_cache! # Retaining the results in the query cache would undermine the point of batching
```

- **逆に、独自実装でfind_eachを実装する場合、この  skip_query_cache! を忘れると、クエリキャッシュによるメモリ消費が嵩んでしまいむしろメモリ消費が増えてしまう罠があるので注意**
- rails consoleではクエリキャッシュが無効化されている(アプリやsidekiqなどでは普通に有効化されている)ので、ローカル確認OKだったから大丈夫というわけではない罠にも注意
  - `User.uncached do ~`のようにして無効化する
    - [【ど忘れ御免】Railsでアレってどうやるんだっけ？  - Qiita](https://qiita.com/ryounagaoka/items/f2c7c810c3e05ec49045#activerecord%E3%81%AE%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5%E3%82%92%E4%BD%BF%E3%82%8F%E3%81%9A%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%E7%99%BA%E8%A1%8C%E3%81%99%E3%82%8B)
