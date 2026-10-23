---
tags: "Rubocop, Gem, Gemfile, 依存関係, Dependabot"
---

# Rubocopのバージョンアップ手順

- Rubocop
  - 手順
    - **準備**
      - (dependabotとかが)gemのバージョンを上げる
      - CI上のrubocopからのメッセージを確認して、あった場合は対応する
        - 「この設定は非推奨だよ」「このcopは名前が変わったよ」などの警告
      - リリースノートをチェックしておく
        - rubocopのコマンドなどの更新を見ておく
    - **copの適用/無視の判断**
      - `rubocop --auto-gen-config`してrubocop_todo.ymlを生成し、それのみを別のブランチでコミットし、dependabotとは別のプルリクを出す
      - 新規に増えたcopについて下記の基準で判断して、そのプルリク上でコメントを残す
        - 簡単に修正できるcop：違反している数が少ない or 不具合なくautocollectできそうなcop
**判断基準.mmd**

```
flowchart LR

S[適用したいcopか?]
A[簡単に修正できるcopか?]

S -- N --> Z[rubocop.ymlで無効化する]
S -- Y --> A

A -- Y --> X[違反している箇所を直す]
A -- N --> Y[rubocop_todo.ymlで<br>現在違反するもののみ無効化する]

```

- プルリク上で ↑ の判断についてチーム内で合意をとる
- **作業**
  - 「rubocop.ymlで無効化する」と判断したcopをrubocop.ymlに追記してコミット
  - `rubocop -A --except (rubocop_todo.yml送りにすると判断したcopを,区切りで列挙)`してコミット
    - (`--except`ではなく)`--only`で1個1個直すと、直したことにより別のcop違反が発生するので、このように一気に直す
      - `expect(response.status).to eq 404`が`expect(response).to have_http_status 404`になっても、更に`expect(response).to have_http_status :not_found`にしないといけなかったりする
  - ↑を再度実行しても出てくる違反(auto-collectできなかったもの)を手で直してコミット
  - `rubocop --auto-gen-config --exclude-limit 9999`してコミット
    - 「今違反しているcop違反はrubocop_todo.yml送りにするが新しいコードで守る」という方針を実現するために`--exclude-limit 9999`を指定する(デフォルトは15なので違反数が多いcopが全部todo送りになってしまう)
  - CIが落ちたら直してコミット
- **プルリク**
  - diffをよく確認する
  - レビュー依頼を出す
