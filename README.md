# Knowledge

[閲覧サイト](https://tetetratra.github.io/knowledge/)

記事は `notes/`、画像は `assets/` に置く。書籍は1冊1ページ。

Node.js 22以上とPython 3でローカル実行できる。

```sh
npm ci
npm run build
npm test
npm run preview
```

`main` へのpush時にGitHub Pagesへ公開する。生成物は `dist/` に出力し、Git管理しない。

検索は文字一致を優先し、意味が近い結果を後から追加する。ビルド時に日本語StaticEmbeddingモデルを取得・軽量化し、生成物として配信する。モデルの出典・ライセンスは `scripts/embedding-LICENSE.txt` を参照。
