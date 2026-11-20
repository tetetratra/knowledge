---
tags: "AI, 機械学習, 推論エンジン, ONNX, ONNX Runtime"
---

# ONNX

- ONNX（Open Neural Network Exchange）は、機械学習モデルの推論の計算を、共通の演算（MatMul、Addなど）をつないだグラフとして書く形式
  - 学習済みの重みは、グラフの中の定数（initializer）として同じファイル（`.onnx`）に入る
  - 学習に使ったフレームワークに依存しない。PyTorchなどで学習したモデルをONNXに書き出せば、本番にはそのフレームワークを持ち込まずに推論できる
  - `.onnx` ファイルはデータで、それだけでは動かない。動かすには、ファイルを読み込んで計算を実行するランタイムが要る
- ONNX Runtimeは、ONNXのファイルを読み込んで推論を実行するエンジン
  - 使う流れは「セッションを作る → 名前の付いた入力テンソルを渡して実行する → 出力テンソルを受け取る」
  - セッションの作成で、モデルの読み込みとグラフの最適化（定数だけで決まる部分の事前計算、不要なノードの削除、ノードの結合）を行う。作成は起動時に1回だけにして使い回す
  - グラフは入力から出力を計算する関数なので、前回の続きから推論するモデル（音声の逐次処理など）は、内部状態を入力で受け取り出力で返す。状態は呼び出し側が持つ
  - 実行先のハードウェアは、Execution Providerとして差し替える（CPU、CUDA、CoreMLなど）。呼び出すAPIは共通
  - CのAPIを公開しており、各言語のバインディングはこれを呼ぶ。ビルド時に共有ライブラリをリンクする方式と、実行時に動的ロードする方式があり、後者はビルド環境にライブラリが要らない
- CPUで実行するときのスレッドは2種類ある
  - intra-opは1つの演算の中の並列化で、既定は物理コア数
  - inter-opは演算どうしの並列化で、実行モードを並列にしたときだけ効く。既定は逐次実行
  - 多数の推論を同時に流すサーバーでは、推論どうしがCPUを奪い合わないよう、セッション内の並列化を1にして、並行性をセッションの数で確保する設計がある

出典
- [ONNX Concepts](https://onnx.ai/onnx/intro/concepts.html)
- [ONNX Runtime Graph optimizations](https://onnxruntime.ai/docs/performance/model-optimizations/graph-optimizations.html)
- [ONNX Runtime Execution Providers](https://onnxruntime.ai/docs/execution-providers/)
- [ONNX Runtime Thread management](https://onnxruntime.ai/docs/performance/tune-performance/threading.html)
