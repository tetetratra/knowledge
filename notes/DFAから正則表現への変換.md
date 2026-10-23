---
tags: "オートマトン, 決定性有限オートマトン, DFA, 正則表現, 正則言語"
---

# DFAから正則表現への変換

- オートマトン
    - あの状態遷移図みたいに表せるあれ
  - 決定性有限オートマトン(DFA (Deterministic Finite Automaton))
- $ M = (Q, \Sigma, \delta, p_0, F)$
- $ Q : 状態の有限集合$
- $ \Sigma : 入力アルファベット$
- $ \delta : Q \times \Sigma \rightarrow Q (状態遷移関数)$
- $ p_0 : 初期状態$
- $ F : 最終状態の集合$
  - 正則言語
    - あの状態遷移図みたいに表したあれが受け取れるもの
- オートマトンMが受理する言語
- $ L(M) = \{ w \in \Sigma^* | \delta(p_0, w) \in F \}$
  - 正則表現
- ![図](../assets/37925c3b0d9a740c0c97fd6bd71a4e983a0ec9295635c967a7ed813d656eb49c.png)
  - 正則表現のオートマトンへの変換
- ![図](../assets/c32e4ac3041a39c1ffe753cfe2bb9595a1bacf614c9f066cb62f04a2784091a5.png)
  - DFAの正則表現への変換
    - $ L(M) = L(e) となるような正則表現eを求めたい$
- $ R(i, j, k) = \{ w \in \Sigma^* | w は状態 p_i から状態 p_j に、\newline途中で状態 p_l (1 \le l \le k ) だけを通って至るパスのラベル \} とする。$
- $ R(i,j,k) = R(i,j,k-1) \cup R(i,k,k-1) (R(k,k,k-1))^* R(k,j,k-1)$
- のように帰納的に求められる。
- $ R(1, l_i, n) = L(p_{l_i})$
