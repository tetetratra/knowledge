---
tags: "gem, Ruby, linter, Rubocopのバージョンアップ手順"
---

# RuboCop

- GithubのREADMEに書いてあるあのバッジは、画像を表示しているらしい
  - https://github.com/rubocop/rubocop#readme-badge
- 複数プロジェクトで共通する設定を使いたいときは、rubocop.ymlの`inherit_gem:`の機能がある
  - 社内gemのような感じでrubocop用のリポジトリを作って、そこに共通規約を書く
  - https://rochefort.hatenablog.com/entry/2016/09/06/180000
- autocollectの`--only`や`--except`オプション
  - 指定したcopのみを直せる
  - 複数指定するときは`,`区切りで指定する
  - [RuboCopの--onlyオプションの改善 - koicの日記](https://koic.hatenablog.com/entry/improve-only-option-of-rubocop)
- 先送りにしたいcopは`.rubocop_todo.yml`へ
  - 自動生成するファイル
- [SolargraphをDocker環境でこっそり使う](https://r7kamura.com/articles/2022-06-11-invisible-solar)
- Rubocopのバージョンアップ手順
- autocollectの`--disable-uncorrectable`オプション
  - 直せないものには`# rubocop:todo`が付く
  - 直せるものにも`# rubocop:todo`をつけるオプションは無いのだろうか...
