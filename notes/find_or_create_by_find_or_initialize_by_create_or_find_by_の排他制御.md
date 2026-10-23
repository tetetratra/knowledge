---
tags: "find_or_create_by, find_or_initialize_by, create_or_find_by, ActiveRecord, 排他制御, 競合, レースコンディション, ロック"
---

# find_or_create_by, find_or_initialize_by, create_or_find_by の排他制御

- `find_or_create_by`
  - https://github.com/rails/rails/blob/cf6b3107753a762b27bfcf9eefcfd9feb43f0242/activerecord/lib/active_record/relation.rb#L231
  - `find_by(attributes) || create_or_find_by(attributes, &block)` している**のみ**
  - `this method is not atomic` (アトミックじゃないよ) と書いてある
    - DBにユニーク制約が無い場合、同時リクエストで2件作られてしまう
      - 十分に間隔を開けたリクエストであれば作られるのは1件のみ
- `create_or_find_by`
  - https://github.com/rails/rails/blob/cf6b3107753a762b27bfcf9eefcfd9feb43f0242/activerecord/lib/active_record/relation.rb#L273
  - `find_or_create_by` の内部で使われてもいる
  - **前提として、カラムにユニーク制約が貼ってあるテーブルに対して実行するメソッド**
    - 貼ってないテーブルに対して使った場合、**常に毎回レコードが作成されてしまう**
  - ユニーク制約違反になった場合はrescueしているのでエラーにはならない
- [「find_or_create_by」と「create_or_find_by」 の違い   - Qiita](https://qiita.com/4geru/items/e9c6545eb211124f153d#comment-3bcfa66521e94c76b963)
  - [週刊Railsウォッチ（20180216）Rails 5.1.5リリース、DHHのYouTubeチャンネルは必見、Ruby Toolboxが運営再開ほか｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2018_02_16/52623#:~:text=%E6%96%B0%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%3A%20%23create_or_find_by)
    - > つっつきボイス: 「#create_or_find_by...だと？」
    - >「unique制約ではじきながらcreateして、できなければfindする、みたいな流れか」
    - >「それにしても名前が紛らわしい...タイポかとおもた」
    - >「コードレビューで『これ間違いじゃ？』とか言われそうな予感」
    - >「#create_or_find_byはテーブルをロックするから安全な分状況によってはパフォーマンス落ちそうだなー」「登場して間もないし、Rails6向けだろうから、まだまだ議論されそうですね」
- `find_or_initialize_by`
  - https://github.com/rails/rails/blob/cf6b3107753a762b27bfcf9eefcfd9feb43f0242/activerecord/lib/active_record/relation.rb#L312
  - `find_by(attributes) || new(attributes, &block)` としている**のみ**
  - `find_or_create_by` とほぼ同じだが、`create`の代わりに`new`するのみ
  - そもそも更新系の処理をしていないので、同時実行しても競合という概念自体が起き得ない
    - (そのあとに更新系の処理をしている場合はそりゃ競合しうるので注意)
