---
tags: "通信プロトコル, HTTP, Webブラウザ, websocket"
---

# Websocket

- [WebSocket サーバーの記述 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/WebSockets_API/Writing_WebSocket_servers)
- Websocketの開始時、サーバーへのリクエスト時は、普通のGETでリクエストする
  - サーバーはパスを見て、普通のHTTPを返すかWebsocketを開始するかを判断
- >ハンドシェイク後の任意の時点で、クライアントまたはサーバーのどちらかが、相手に ping を送信することを選択できます。 ping が受信されると、受信者はできるだけ早く pong を返さなければなりません。 これを使用して、たとえばクライアントがまだ接続されていることを確認できます。
- [WebSocketについて調べてみた。  - Qiita](https://qiita.com/south37/items/6f92d4268fe676347160)
  - コネクション確立まではHTTPと同じ形式のプロトコルによって行われる
    - 「WebSocket opening ハンドシェイク」という
  - 双方向通信の実現
    - >その確立されたTCPコネクション上で、双方向にデータをやり取りする
    - **フレーム**と呼ばれる単位でデータが送信される
      - HTTPプロトコルとは別の、websocket特有のプロトコルに移行する
**フレームの構造**

```
0                   1                   2                   3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
```

- テキストデータとバイナリデータを区別して送信できる
- >WebSocketはクライアントとサーバーの間でTCPコネクションを張りっぱなしにして通信を行う為、Blocking I/Oを持つWebサーバとは相性が悪い。Blocking I/Oを持つサーバープロセスは一度に1つのクライアントとしかコネクションを張れない為、WebSocketを使いたければクライアントの数だけサーバープロセスが必要になってしまう。
- > そういった状況を避ける為に、WebSocketを利用する場合には通常Non Blocking I/Oを持つサーバーが使われる。WebSocketの文脈で一番有名なのはNode.jsだと思うが、他にも例えばrubyであればThinやRainbows!などのappサーバーが利用出来る。WebSocketに対応する為のライブラリとしては、socket.ioやwebsocket-railsなんかが有名だと思う。
- > reverse proxyとしてよく利用されるnginxもWebSocketに対応したようで(参考: NGINX as a WebSockets Proxy)、WebSocketを利用する為の環境はどんどん整ってきてるんじゃ無いだろうか。
- Rubyでシンプルに使うだけなら https://github.com/ruby-jp/websocket-client-simple というgemがある
