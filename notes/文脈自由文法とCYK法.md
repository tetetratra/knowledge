---
tags: "文脈自由文法, チョムスキー階層, チョムスキー標準形, CYK法, 動的計画法"
---

# 文脈自由文法とCYK法

- チョムスキー階層
**チョムスキー階層**

| 制限の無い文法(句構造文法) | チューリング機械 |
| --- | --- |
| 文脈依存文法 | 線形拘束オートマトン |
| 文脈自由文法 | プッシュダウン・オートマトン |
| 正則文法 | オートマトン |

- 上の方ほど高計算能力
  - 文脈自由文法 (Context-free Grammar)
- $ G = (N, \Sigma, P, S)$
- $ N: 非終端アルファベット$
- $ \Sigma: 終端アルファベット$
- $ P: A\rightarrow \alpha (A \in N, \alpha \in (\Sigma \cup N)^* ) の形をした生成規則の有限集合$
- $ S: 開始記号(S \in N)$
- $ 生成規則 \alpha \rightarrow \beta \in P に対して x = u \alpha v, y = u \beta v と書けるとき、 x \Rightarrow y と書く。$
  - この式だとxやyに代入していてややこしいけれど、$ u \alpha v \Rightarrow u \beta v というだけのこと$
  - Gによって生成される言語
- $ L(G) = \{ w \in \Sigma^* | S \Rightarrow^* w \}$
  - チョムスキー標準形
    - 文脈自由文法のPが次を満たすとき
  - $ P: A \rightarrow BC, A \rightarrow a (A,B,C \in N, a \in \Sigma) の形をした生成規則の有限集合$
    - 文脈自由文法はチョムスキー標準形にできる
  - 文脈自由文法の認識問題
    - 文字列が受理されるかどうか判定する問題
    - 導出過程は、、、DPしにくい
    - 導出木だとDPできる
  - [CYK法 - Wikipedia](https://ja.wikipedia.org/wiki/CYK%E6%B3%95)
```CKY
# 資料とはi,jを逆にする。その方がわかりやすいし。

w : 受理するか調べたい文字列
C(i, l) : w[i..(i+l)] を生成する非終端記号、の集合

C(i, 1) = { X ∈ N | X -> w[i] ∈ P }
C(i, l) = { X ∈ N |
  X -> YZ ∈ P,
  Y ∈ C(i, k),
  Z ∈ C(i+k, l-k),
  k = 1..(l-1)
}
i, l, k のループで、O(n^3)
数直線 1...i...(i+k)...l...n
長さ   |___|___k___|l-k|___|


```
