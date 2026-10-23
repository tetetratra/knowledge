---
tags: "gRPC, Protocol Buffers, エラーハンドリング"
---

# gRPC

- [Exception: GRPC::FailedPrecondition — Documentation for grpc (1.40.0)](https://rubydoc.info/gems/grpc/GRPC/FailedPrecondition#initialize-instance_method)
- エラーハンドリングについて
  - https://grpc.io/docs/guides/error/#standard-error-model
  - [gRPC status codeの一覧 - Qiita](https://qiita.com/Hiraku/items/0549e4cf7079d22b27e8)
    - HTTPステータスコードとの対応も書いてある
  - [gRPCでエラー詳細を渡す方法 - Carpe Diem](https://christina04.hatenablog.com/entry/grpc-error-details)
  - [Ruby で gRPC のエラーハンドリング をする際のTips - Qiita](https://qiita.com/nakaryooo/items/c0c270e65e4201f7dfe8)
- でかいエラーメッセージを送りたい場合はmetadataに埋め込むとhttpのヘッダ長制限とかに引っかかる
  - 普通のレスポンスとして送る
- [gRPCで使う.protoファイルの書き方まとめ - Qiita](https://qiita.com/Captain_Blue/items/b7a1f4a42f48559fac0c)
- protocol bufferのjsonへのシリアライズへの仕様は、その値がその型のデフォルト値の場合は**そのカラムごと消えてしまう**
  - https://github.com/protocolbuffers/protobuf/blob/master/ruby/ext/google/protobuf_c/message.c#L1044
- https://github.com/fullstorydev/grpcurl
- optionalは、grpc v3で一旦廃止されたけれども、v3.12で復活した
  - 実体はフィールド1個のoneof
  - v3.12 ～ v3.14 ではコマンドに `--experimental_allow_proto3_optional`を渡す必要がある
  - [protocol buffers - protobuf 3でオプションのフィールドを定義する方法](https://stackoverflow.com/questions/42622015/how-to-define-an-optional-field-in-protobuf-3)
    - そもそもprotobufではすべてのフィールドがオプション（値を入れなくてもok）らしい
      - grpc-rubyで生成された`_pb.rb`ファイルが、optionalフィールドじゃなくても`optional :count, :uint64, 1`のようになるのは、これが理由かも
