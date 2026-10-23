---
tags: "全知デバッグ, タイムトラベルデバッグ, Expositor, UndoDB, TOD"
---

# Expositor: Scriptable time-travel debugging with first-class traces

- タイムトラベルデバッグ
  - アブストラクト
    - >Expositorは、スクリプトとタイムトラベルデバッグを組み合わせた新しいデバッグ環境であり、プログラマが複雑なデバッグタスクを自動化することを可能にするものである。Expositorが提供する基本的な抽象化は実行トレースであり、これはプログラムの状態スナップショットの時間軸を持ったシーケンスである。プログラマは、トレースを単純なリストであるかのように、mapやfilterといった操作で操作することができます。Expositorは、トレースを遅延インターバルツリーとして効率的に実装しており、その内容は必要に応じて実体化されます。Expositorはまた、セット、マップ、マルチセット、マルチマップの遅延実装である編集ハッシュ配列マップトリエという新しいデータ構造を提供し、プログラマがデバッグスクリプトの効率を最大化することを可能にします。私たちはExpositorを使用して、スタックオーバーフローをデバッグし、Firefoxの微妙なデータ競合を解き明かしました。私たちは、Expositorが、複雑で理解しにくいバグを診断する技術を向上させるための重要な一歩であると確信しています。
  - >traces can be filtered, mapped, sliced, folded, and merged to create lightweight projections of the entire program execution.
    - >トレースをフィルタリンlグ、マッピング、スライス、フォールド、マージして、プログラム全体の軽量なプロジェクションを作成することができます。
    - トレースを用いたデバッグや分析
  - scripting debug
    - GDBみたいなもの？普通の対話式デバッガ？
    - >Marceau らは、プログラムをイベントジェネレータとして扱うことを提案
      - イベント: 関数呼び出し, メモリ参照
      - >スクリプトは関数型反応プログラミング (FRP) のスタイル
        - 非決定性(mallocが返すアドレスは不定)がある場合には問題
  - time-travel debug
  - ツール EXPOSITOR を提案
    - プログラムの状態のスナップショット
      - 全部のスナップショットを取るのは重い
      - 「`malloc`をしている箇所のみ」みたいな指定ができる
    - >タイムトラベルデバッガ UndoDB を使用して、必要に応じてスナップショットを作成し、不要になったら破棄します
  - RELATED WORK
    - タイムトラベルデバッガ
      - 全知全能デバッガ
        - TOD (ここの論文のやつ)
      - リプレイデバッガ
        - > In contrast, replay debuggers work by **logging the results of system calls** the program makes
        - > (as well as other sources of nondeterminism)
        - > and making intermediate checkpoints,
        - > so that the **debugger can reconstruct a requested program state**
        - > by starting at a checkpoint and replaying the program with the logged system calls.
          - >これに対して、リプレイデバッガはプログラムが実行したシステムコール (および他の非決定性の原因) の結果をログに記録し、中間チェックポイントを作成することで動作します。ログに記録されたシステムコールを使ってプログラムを再生することで、要求されたプログラムの状態を再構築することができます。
        - URDB
          - A.-M. Visan, K. Arya, G. Cooperman, and T. Denniston, “URDB: a universal reversible debugger based on decomposing debugging histories,” in PLOS, 2011.
        - UndoDB
          - Undo Software. About UndoDB. Online. Available: http://undo-software.com/product/undodb-overview
    - 高水準（非コールバック指向）デバッグスクリプト
