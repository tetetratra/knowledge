---
tags: "Gem, Ruby_on_Rails, 権限管理"
---

# Pundit

- 権限管理用のgem
- [Punditをなるべくやさしく解説する - Qiita](https://qiita.com/yutaro50/items/52484b7ae4ca87aa99a2)
- モデルなどに対してPolicyを作る
- モデルじゃなくてもPolicyは作れる
- `authorize :ポリシー名, :操作?`
- `policy(:ポリシー名).操作?`
- policyの引数でネストしたポリシーを指定するときは配列で指定する
