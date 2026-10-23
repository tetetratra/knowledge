---
tags: "Git"
---

# Git 研修【MIXI 26新卒技術研修】 - Speaker Deck

- [Git 研修【MIXI 26新卒技術研修】 - Speaker Deck](https://speakerdeck.com/mixi_engineers/2026_new_grad_training_git?slide=71)
- 72ページから、Gitの内部構造の紹介をしている
- ![図](../assets/8ae81d7e032a86b9e4fbd608100ec4e590bc1a02438a63b14eefd37afe6dd9dc.png)
- ![図](../assets/7f855ab4c6f94451104e390ea4a027f4822affdc8eb3a35edb96c31b31a56a19.png)
  - commitオブジェクト
    - `git cat-file ...` で中身見れる
    - ![図](../assets/7cd1bb205dafd625913f61511570c59d2ba439ac54f6085f8216614a7869ca23.png)
  - blobオブジェクト
    - 実際のファイルのバックアップ（差分ではなく全体を保持）
  - treeオブジェクト
    - バージョンごと(= 1回のコミットごと)に、git管理下のすべてのディレクトリに対応するtreeオブジェクトが(それぞれ)作成される
      - 1ディレクトリ：1treeオブジェクト の関係
      - treeという名前が若干ややこしい
    - 「パーミッション」「種類 (blobとか)」「Key」「ファイル名」のセットが沢山記録されている
    - ![図](../assets/11e64b99773f80bfae64c061d355291a58f27e48bda180dfe2125ff9c49d9838.png)
