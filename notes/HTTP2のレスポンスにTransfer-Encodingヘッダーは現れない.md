---
tags: "HTTP, ストリーミング"
---

# HTTP2のレスポンスにTransfer-Encodingヘッダーは現れない

- HTTP/1.1 では、本文の長さを先に決めずに送るとき、`Transfer-Encoding: chunked` を付けて本文をチャンクに区切る
- HTTP/2 は本文を DATA フレームに分けて送り、本文の終わりは END_STREAM フラグで示す
  - チャンク形式は HTTP/2 では使えない（[RFC 9113 8.1](https://www.rfc-editor.org/rfc/rfc9113#section-8.1)）
  - `Transfer-Encoding` は接続固有のヘッダーとして禁止されている（[RFC 9113 8.2.2](https://www.rfc-editor.org/rfc/rfc9113#section-8.2.2)）
- アプリケーションサーバーが HTTP/1.1 のチャンク形式で返しても、手前のロードバランサーが HTTP/2 に変換する構成では、このヘッダーはクライアントに届かない
- そのため HTTP/2 では、長さを決めずに少しずつ返しているかを、`Content-Length` がないことで見分ける
  - ブラウザの開発者ツールで `:method` や `:authority` などの疑似ヘッダーが見えれば、その通信は HTTP/2 以降である
