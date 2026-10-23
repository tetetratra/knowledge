---
tags: "ACM, ManLang"
---

# Debugging Native Extensions of Dynamic Languages

- ACM
- ManLang 2018
- [Debugging Native Extensions of Dynamic Languages](https://arxiv.org/abs/1808.00823)
- >RubyやPythonなどの多くの動的プログラミング言語では、CやC++などの静的コンパイル言語で実装されたネイティブ拡張と呼ばれるコードを使用することができます。しかし、これらの動的言語用のデバッガは、通常、これらのネイティブ拡張をデバッグするためのサポートが不足しています。GraalVMは、様々な動的プログラミング言語で実装されたプログラムを実行でき、LLVM-IRインタプリタSulongを使用することで、そのネイティブ拡張も実行することができます。GraalVMのデバッグフレームワークをベースに、LLVM-IRレベルのランタイムデバッグ情報をオリジナルのプログラムコードに関連付けることで、Sulongにソースレベルデバッグのサポートを追加しました。その結果、開発者はGraalVMを利用して、複数のLLVMベースのプログラミング言語で書かれたソースコードや、共通のデバッガーフロントエンドで呼び出す様々な動的言語で実装されたプログラムをデバッグできるようになった。
