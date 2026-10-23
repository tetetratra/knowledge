---
tags: "gem, リリース, フィーチャーフラグ, カナリアリリース, Redis"
---

# Flipper

- フィーチャーフラグのためのgem
- カナリアリリースもできる
  - キー置き場にRedisとかを指定する必要がある
  - カナリアリリースをするとき、内部では↓のような実装になっているので、Redisへのアクセスを`O(N)`ではなく`O(1)`で実現している
    ```rb
    def open?(user, feature, percentage)
      id = "#{user.id}#{feature.name}"
      Zlibcrc32(id) % 100 < percentage
    end
    ```
  - [Feature Toggleを用いたRailsアプリの継続的なリリースと要注意事項 - メドピア開発者ブログ](https://tech.medpeer.co.jp/entry/2022/05/17/feature-toggle)
    - > FlipperでActor機能を使うには、対象が一意の flipper_id を持つ必要があります。 それ用のmoduleを利用するか、自前でメソッドを定義しておきましょう
    - モデルで`include Flipper::Identifier`とすると、デフォルト実装の`flipper_id`メソッドが生える
      - https://www.rubydoc.info/gems/flipper/Flipper/Identifier
