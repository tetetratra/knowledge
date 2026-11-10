---
tags: "Ruby, GVL, スレッド, 並行処理, 並列処理, Ractor, CRuby"
---

# RubyのGVLを消し去りたいあなたへ（翻訳）

- GVLはVMを守るための仕組みだが、`h[k] ||= v` のような競合しうるRubyコードやgemも、GVLのおかげで実害なく動いている
- 同じコードはJRubyやTruffleRubyではHashの内部でクラッシュすることがあり、ActiveRecordが `Hash` ではなく `Concurrent::Map` を使うのはこのためだ
- MRIからGVLを外すには、オブジェクトごとのアトミック操作か細かいロックが必要で、メモリ増加とシングルスレッド性能の低下が避けられない（PythonのGIL削除ではオブジェクトヘッダーが16Bから32Bに増える）
- UnicornやPitchforkのようなシングルスレッドのサーバーでも、statsd-instrumentのようなバックグラウンドスレッドがGVLを握ってリクエスト処理を待たせることがある
- Rubyのスレッドスケジューラは優先度のないFIFOなので、GVLを削除するよりスケジューラを改善するほうが割に合う
- Ruby 3.4からは、スレッドの切り替え間隔（quantum）を環境変数で100msより短くできる
- MatzはGVLの削除を望んでおらず、並列化の手段としてはRactorを採用している
