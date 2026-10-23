---
tags: "AWS, AWS_CloudFront, X-Forwarded-For, IPスプーフィング, CloudFront-Viewer-Address"
---

# CloudFront

- [Amazon CloudFront環境におけるクライアントIPアドレスについて 〜CloudFront-Viewer-Addressの紹介〜 - メドピア開発者ブログ](https://tech.medpeer.co.jp/entry/cloudfront_viewer_address)
  - > 「CloudFront」を最前列に配置して、その後ろに「ALB」と「Railsアプリケーションが稼働するECS」を置くような構成が主流です。
  - > この構成の場合一つ困ることがあります。 それは
  - >**「RailsアプリケーションからクライアントのIPアドレスを取得できない」**という点です。
- X-Forwarded-For
  - > 本ヘッダーは容易に改ざん可能（≒ IPスプーフィングリスクがある）なため一工夫必要
- CloudFront-Viewer-Address
  - > CloudFrontを経由するアクセスに対して、以下のような構文でCloudFrontのViewer（クライアント）のIPアドレスとポート番号をヘッダーに付け加えてくれる機能です
    - `CloudFront-Viewer-Address: 192.0.2.0:46532`
- railsで使うにあたって
  - > 従来の request.remote_ip のI/Fを維持するにはRack層で処理する必要がありそうです
  - https://github.com/tmimura39/actionpack-cloudfront_viewer_address
  - > 本Gemをインストールするだけで、自動的に「CloudFront-Viewer-Address」を参照し request.remote_ip でクライアントのIPアドレスが取得できるようになります
