---
tags: "ACM, ManLang, Sista, JIT, 仮想マシン, スナップショット, 起動時間"
---

# Sista: Saving Optimized Code in Snapshots for Fast Start-Up

- ACM
-  2017
- [Sista | Proceedings of the 14th International Conference on Managed Languages and Runtimes](https://dl.acm.org/doi/10.1145/3132190.3132201)
- >Java HotSpot、Javascript V8、Python PyPyなどのオブジェクト指向言語用の最新の仮想マシンは、実行されたコードの最適化と最適化解除をその場で行うジャストインタイムコンパイル技術によって高い性能を実現している。これらの技術では、高度に最適化されたコードを生成するために、仮想マシンが実行するコードの情報を収集するためのウォームアップ時間が必要です。ピーク性能に達するまでに必要なこのウォームアップ時間は、かなりのものであり、問題となり得ます。本論文では、最適化されたコードをスナップショットの一部としてプラットフォームに依存しない表現で持続させるアプローチ、Sista (Speculative Inlining SmallTalk Architecture)を提案します。このアプローチについて説明した後、Sista仮想マシンが最適化コードを持続させたスナップショットを使用した場合、起動後ほぼ直ちにピーク性能に到達できることを大規模ベンチマークで示しました。
