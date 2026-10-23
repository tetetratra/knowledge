---
tags: "AI, DSPy, 大規模言語モデル, Python"
---

# DSPy

- https://github.com/stanfordnlp/dspy
- > DSPy: Programming—not prompting—Foundation Models
- 「プロンプトを書き散らす」のではなく、コードとしてLM(大規模言語モデル)を設計→評価→自動最適化するためのフレームワーク
- (AIによる)コード例：
```py
import dspy

# Signatureは型のようなもの
class Summarize(dspy.Signature):
    """与えられた本文を3文以内で要約してください。重要点を落とさないこと。"""
    # ↑docstringは必ずしも書く必要はない (書いたほうが付加情報としてdspyに渡るので丁寧)
    # フィールド名 `summary` (= 「要約」) がdspyに渡るので、dspyはそれを元に、自身が何をすればよいか判断できる
    text: str
    summary: str

class CheckSummary(dspy.Signature):
    """要約が原文の主張を歪めていないか判定し、"ok" または "revise" を返す。"""
    text: str
    summary: str
    verdict: str  # "ok" / "revise"

# Moduleは実装のようなもの
# 小さいModule(= 最小単位はPredict)を組み合わせて大きいModuleを作る
class SummarizeWithCheck(dspy.Module):
    def __init__(self):
        self.summarize = dspy.Predict(Summarize) # Predict : 与えられたSignatureをそのまま解釈して実行するModuleを作るもの
        self.check = dspy.Predict(CheckSummary)

    def forward(self, text: str):
        y = self.summarize(text=text).summary
        v = self.check(text=text, summary=y).verdict
        if v != "ok":
            y = self.summarize(text=f"より厳密に要約: {text}").summary
        return dspy.Prediction(summary=y, verdict=v)

```

- ↑ここまでは特にDSPy固有の機能ではない。
- DSPy特有のコンセプトとして、正解データを与えることで、自動でプロンプトの最適化をしてくれるところ
  - 一旦ある意味コンパイル的なことをして、コンパイルの成果物として、チューニングされたプロンプトが得られるイメージ
  - 最適化アルゴリズムは色々あって、選べる



- [AI Agent時代における「使えば使うほど賢くなるAI機能」の開発 - LayerX エンジニアブログ](https://tech.layerx.co.jp/entry/2025/10/23/222742)
