---
tags: "tus, HTTP, ファイルアップロード, プロトコル"
---

# tusは中断したアップロードを途中から再開できるプロトコル

- tus は、大きなファイルの HTTP アップロードを、通信が切れても続きから送り直せるようにするオープンなプロトコル（[tus プロトコル仕様](https://tus.io/protocols/resumable-upload)）
  - `POST` でファイルのサイズを伝え、アップロード専用の URL を受け取る
  - その URL に `PATCH` で分割して送り、切れたら `HEAD` で届いた位置（オフセット）を聞いて再開する
  - 開始時に `Upload-Metadata` ヘッダーで任意のキーと値を付けられるので、完了後にアプリ側の記録と結び付けられる
- 実装には、Ruby の tus-ruby-server や JavaScript の tus-js-client がある
