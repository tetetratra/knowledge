---
tags: "CloudEvents, HTTP, Webhook, イベント駆動"
---

# CloudEventsのHTTPではContent-Typeで送り方を見分ける

- CloudEvents は、イベントの形式を定めた CNCF の仕様で、HTTP で送るときの送り方（content mode）を3つ決めている
  - binary：本文にはデータだけを入れ、イベントの属性は `ce-` で始まるヘッダーに入れる
  - structured：属性とデータを1つの JSON にまとめて本文に入れる。`Content-Type` は `application/cloudevents+json`
  - batched：複数のイベントを JSON の配列にして本文に入れる。`Content-Type` は `application/cloudevents-batch+json`
- 受け手は `Content-Type` を見て送り方を決め、本文が配列かどうかは見ない
- そのため、イベントの配列を `application/json` で送ってくる送り手がいると、SDK はバッチとして読めずにエラーを返す（Go の sdk-go v2 で確認）
  - 受け手の側で `Content-Type` を `application/cloudevents-batch+json` に書き換えてからパースすれば読める
- 出典：[CloudEvents HTTP Protocol Binding](https://github.com/cloudevents/spec/blob/main/cloudevents/bindings/http-protocol-binding.md)
