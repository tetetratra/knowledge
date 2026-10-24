# 技術ノート

Scrapboxから移行した技術ノートを、Gitリポジトリで管理し、GitHub Pagesで閲覧する。

- 記事はすべて `notes/` 直下に置く。
- 画像は `assets/` に物理ファイルとして保存し、記事から相対パスで参照する。ファイル名は画像内容のSHA-256。
- frontmatterは `tags: "タグ1, タグ2"` のみ。記事タイトルは本文先頭の `# タイトル` に置く。
- 冒頭のタグはfrontmatterへ移し、内部ページリンクはプレーンテキストにする。リンク先の技術用語もtagsに含める。
- 本人・知人の私的な情報を取り除き、画像とメタデータも確認する。公開された書籍・Web記事の著者名、登壇者名、公開アカウント・出典URLは保持する。定着した技術用語や、明らかな架空のサンプル値は実在者の個人情報と区別する。
- 個人情報の除去や変換に判断が必要なページは保留する。未取得の画像を含むページは移行済みとしない。
- まず元ページと1対1の状態を、記事と必要な画像を含めて1コミットずつ記録する。その後、独立した話題だけを分割し、元ページ単位でコミットする。書籍は1冊1ページとし、章や話題では分割しない。
- 原文、認証情報、未確認の下書きはGitへ保存しない。
- ユーザー指定の公開リポジトリ `tetetratra/knowledge` を保存先とする。

確認コマンド:

```sh
python3 scripts/validate.py
git status --short
git log --oneline
```

`validate.py` は形式・画像参照・一部の機密情報パターンを検査する。個人情報や意味の保持の確認は、人による確認やモデルによる原文との照合も必要となる。

## 移行状況

元ページ461件を取り込み、分割後の記事は519件、使用画像は206件。保留は0ページ。取得不可の画像3点はユーザー承認に基づき省略した。

- [移行結果と保留一覧](docs/移行結果.md)
- [分割ルール](docs/分割ルール.md)
- [元ページIDと記事・コミットの対応](migration.json)

## 閲覧サイト

[Knowledge](https://tetetratra.github.io/knowledge/) で全文検索・タグ絞り込み・関連ノートの表示ができる。日本語検索に対応し、記事下部に関連ノートを最大8件表示する。

```sh
npm ci
npm run build
npm test
npm run preview
# http://localhost:4173/ を開く
```

Node.js 22以上とPython 3を使用する。記事のHTML・画像コピー・一覧・検索インデックス・関連記事は `dist/` に生成され、Gitでは管理しない。`.github/workflows/pages.yml` が `main` へのpush時だけ生成・検証し、Actionsの成果物からPagesへ直接デプロイする。定期実行や生成物の自動コミットは行わない。

関連記事は日本語の単語分割とTF-IDFのコサイン類似度を中心に、共通タグの一致を加味して事前計算する。タイトルを重視し、URL・画像ハッシュと一般的な機能語を除く。類似度が低ければ8件未満とし、自分自身は推薦しない。外部AI APIは使わない。

参考: [Pagefind](https://pagefind.app/docs/)、[GitHub Pagesのカスタムワークフロー](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
