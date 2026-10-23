---
tags: "GitHub"
---

# GitHub Deployments

- (by AI)
  - Deployments とは
    - コードをどの環境にいつデプロイしたかの記録
    - ステータス・コミット・URLなどが可視化される
  - Environments が増えるタイミング
    - ワークフローに environment: xxx を書いて実行されたとき
    - Vercel などの外部サービスが API 経由で自動作成したとき
    - Settings 画面から手動作成したとき
  - environment: を指定しない場合
    - ジョブは動くが Deployment レコードは作成されない
    - 履歴・承認・Environment Secrets などの管理機能が使えない
  - github-pages Environment とは
    - actions/deploy-pages を使うと自動で作られる特別な Environment
    - ビルド成果物をリポジトリにコミットせず GitHub Pages に公開できる
    - Storybook のようなものをチームに共有する手段として最適
      - 昔は gh-pages ブランチにコミットしてリポジトリが肥大化していた
      - 今は Actions の一時領域で完結し、リポジトリの履歴が汚れない
