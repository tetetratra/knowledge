---
tags: "AI, LLM, Transformer, Attention, 画像生成, マルチモーダル, RAG, AIエージェント"
---

# LLMとマルチモーダル

[AI研修(Day2)【MIXI 26新卒技術研修】 - Speaker Deck](https://speakerdeck.com/mixi_engineers/2026_new_grad_training_ai_day2)

- day2
  - 1. LLMの内部構造
    - 言語モデル、分散表現、トークン化
    - Attention機構とTransformer
      - RNN
        - 1文字ずつ生成する手法
        - GPUを活かせない
      - seq2seq with attention
        - RNNをベースに、重要な単語に重みを付ける
        - 依然として並列化できないのでGPUは活かせず
      - transformer
        - 論文「attention is all you need」(2017)
        - 全トークンを同時に処理する
          - ので、GPUを活用できる
        - 「主語述語関係」「装飾非装飾関係」「文脈的な依存」など、各種のattentionを並行実行する
        - トークン数Nに対してO(N^2)のメモリ消費
    - GPT、BERT、最新トレンド（MoE、CoT、推論モデル）
      - CoT (chain of thought)：思考過程を出力させることで論理的推論を可能にする
  - 2. 画像生成とマルチモーダル
    - 拡散モデルの仕組み
    - ViT、CLIP
    - テキスト・画像・音声の統合
      - マルチモーダル間でattentionをつけることで実現
      - たとえば画像のベクトル表現をベクトルDBに保存しておくことで、ユーザーが自然言語で画像を検索できるようになる
  - 3. LLMアプリケーション
    - API, Context, RAG
    - function calling、構造化出力
  - 4. Al Agent
    - workflow, agentic loop
    - ReAct, Plan and solve
      - ReAct：reasoning(推論)とaction(実行)
    - LLM-as-a-judge, Human-in-the-loop
      - Human-in-the-loop：重要な判断ポイントで人間の承認を挟む
      - LLMアプリケーションの評価
        - 出力の評価
          - 想定回答と実際の回答を比較してスコア化する
        - 出力までの過程の評価
          - 思考過程やツール呼び出しがうまくいっているか
