---
tags: "Ruby_on_Rails, Rack, HTTP, ALB, ストリーミング"
---

# RackのETagミドルウェアはストリーミングを止める

- Rack::ETag は（rack 2.2 のソースで確認）、レスポンスの body からハッシュ（SHA256）を計算して `ETag` ヘッダーを付けるミドルウェア
  - ハッシュを計算するために、body を `each` で最後まで読んで配列に溜める
  - そのため、少しずつ返すつもりの body（Enumerator など）も、全部作り終えるまで1バイトも返らない
**rack 2.2 の lib/rack/etag.rb**

```ruby
def digest_body(body)
  parts = []
  digest = nil

  body.each do |part|
    parts << part
    (digest ||= Digest::SHA256.new) << part unless part.empty?
  end

  [digest && digest.hexdigest.byteslice(0, 32), parts]
end
```

- 起きること
  - CSV などを作り終えるまで、ヘッダーすらクライアントに届かない
  - その間にクライアントが待ちきれずに接続を切ると、ALB は 460 を記録する
    - 460 は、ロードバランサーが応答する前にクライアントが接続を閉じたことを表す
    - [Application Load Balancer のトラブルシューティング](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-troubleshooting.html)
- 計算を飛ばす条件（rack 2.2 の `call`）
  - ステータスが 200 と 201 以外
  - body が `to_path` を持つ（ファイルを返す場合。Web サーバーの sendfile に任せるため）
  - レスポンスに `ETag` か `Last-Modified` のヘッダーがすでにある
**rack 2.2 の lib/rack/etag.rb**

```ruby
def skip_caching?(headers)
  headers.key?(ETAG_STRING) || headers.key?('Last-Modified')
end
```

- 回避策：ストリーミングで返すレスポンスに、`Last-Modified` か `ETag` を先に付けておく
  - **`Cache-Control: no-cache` を付けても、計算は止まらない**
    - `skip_caching?` は `Cache-Control` を見ていない
- ストリーミングにするなら、アプリの外側のミドルウェアが body を溜め込んでいないかまで確かめる必要がある
