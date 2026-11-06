---
tags: "devise, Gem, Ruby_on_Rails, バリデーション, 認証"
---

# devise_invitableのinvite!はモデルのバリデーションを飛ばして保存する

- devise_invitable の `invite!` は、既定では `save(validate: false)` でレコードを保存する
  - そのため、モデルに書いた `validates` や `before_validation` のコールバックは走らない
  - 設定 `validate_on_invite` を `true` にすると、招待の前にモデルのバリデーションを通すようになる（既定は `false`）
  - [devise_invitable README「Configuring module」](https://github.com/scambra/devise_invitable#configuring-module)
- 既定のままでも、招待のキー（通常は `email`）だけは確かめる
  - 値が空なら `:blank` のエラーになり、保存されない
  - `Devise.email_regexp` に合わない値もエラーになる
    - Devise の既定の `email_regexp` は `/\A[^@\s]+@[^@\s]+\z/` で、`\s` は ASCII の空白だけにマッチする
  - Devise の `strip_whitespace_keys` で、前後の空白は取り除かれる
    - ただし `String#strip` なので、全角空白などは残る
  - 確認したのは devise_invitable 2.0 の `lib/devise_invitable/models.rb`
- 起きること
  - モデル側で全角空白の除去や独自のメール形式チェックをしていても、招待経路で作られたレコードには効かない
  - 「モデルにバリデーションがあるから DB の値はきれいなはず」と考えると、招待で入った値を見落とす
