---
tags: "ACM, SIGPLAN, CPS, tail_call, tail_call_optimization, 末尾再帰"
---

# Proper tail recursion and space efficiency

- 1998
- https://dl.acm.org/doi/10.1145/277652.277719
- >SchemeのIEEE/ANSI規格は、実装が適切に末尾再帰的であることを要求しています。これにより、移植可能なコードは、継続パッシングスタイルや他のイディオムの空間効率に依存することができます。表面上は、適切な末尾再帰性は末尾コンテキストで発生する手続き呼び出しの効率に関係する。よく見ると、適切な末尾再帰性は、ガベージコレクションがAlgolのようなスタック配置よりも漸近的に空間効率が良くなるという事実にも依存している。本論文では、Schemeのための適切な末尾再帰の形式的かつ実装に依存しない定義を提供する。本論文では、Schemeの適切な末尾再帰の定義を、形式的かつ実装に依存せずに行う。また、関連する安全空間特性を特徴付けるために、参照実装群全体をどのように利用できるかを示し、それらの間で成立する漸近不等式を証明する。
- **3 The Essence of Proper Tail Recursion**
- >In Scheme, it is perfectly feasible to write large programs in which no procedure ever returns, and all calls are tail call. This is pure continuation-passing style. Proper tail recursion guarantees that implementations will use only a bounded amount of storage to implement all of the calls that are performed by a program written in this style.
- >Schemeでは、どの手続きも決して戻らず、すべての呼び出しが末尾再帰で あるような大規模なプログラムを書くことが完全に可能である。適切な末尾再帰は、このスタイルで書かれたプログラムが実行するすべての呼び出しを実装するために、限られた量のストレージしか使用しないことを保証する。
- >To make this precise, we need a proper model of space consumption. This model should allow us to reason about the space needed to run a program, independent of imple- mentation. For this to be tractable, the space model should take the form of an asymptotic upper bound on the space consumed by an implementation.
- >これを正確にするためには、空間消費に関する適切なモデルが必要である。このモデルによって、実装に依存しないプログラムの実行に必要なスペースについて推論できるようになるはずです。これを扱いやすくするために、空間モデルは実装によって消費される空間の漸近的な上限という形をとる必要があります。
- >Proper tail recursion constrains but does not determine the space model. To obtain a complete model, we must also model the space consumed by variables and data, and spec- ify the roots that a garbage collector would use to determine whether a variable or datum is reachable. Garbage collec- tion then completes the model. With a reasonable garbage collector, the asymptotic space required for variables and data is O(N), where N is the largest number of words oc- cupied by reachable variables and data at any point in the program (App92).
- >適切な末尾再帰は、空間モデルを制約するが、決定するわけではない。完全なモデルを得るためには、変数やデータによって消費される空間もモデル化し、ガベージコレクタが変数やデータに到達可能かどうかを判断するために使用する根を指定する必要があります。そして、ガベージコレクションがモデルを完成させる。妥当なガベージコレクタを用いると、変数とデータに必要な漸近的空間は O(N) であり、ここで N はプログラム中の任意の時点で到達可能な変数とデータによって占められる最大の語数です (App92)．
