---
tags: "AWS, S3, SFTP, Ruby, ActiveStorage"
---

# AWS S3

- SFTPサーバーとして動かすこともできる (SFTPプロトコルを喋れる)
- APIリファレンス (ruby)
  - https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/S3/Client.html
  - 公式実装例
    - [SDK for Ruby を使用した Amazon S3 の例 - AWS SDK Ruby の場合](https://docs.aws.amazon.com/ja_jp/sdk-for-ruby/v3/developer-guide/ruby_s3_code_examples.html)
- [ClinPeer Railsプロジェクトのオブザーバビリティ強化施策 - メドピア開発者ブログ](https://tech.medpeer.co.jp/entry/2025/03/25/123000)
  - > (イレギュラーな操作をすると) active_storage_blobs のレコードは物理削除されたが、S3バケット上にオブジェクトが残されると当該S3オブジェクトは迷子になってしまう
  - 対策として、ActiveStorageにモンキーパッチを当てて、実行時のコンテキストを格納しておいている
