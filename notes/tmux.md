---
tags: "ターミナルマルチプレクサ"
---

# tmux

- ドキュメント
  - https://man7.org/linux/man-pages/man1/tmux.1.html
- window-status-formatでtmuxの設定値を計算したいとき
  - tmux内で`tmux`コマンドを打つと、現在の設定値が手に入る
  - `tmux display-message -p '#I'`のように
  - これをシェルで計算して、結果を使えばよい`#(tmux display-message -p '#I' | rr 'to_i.next')`
- 色一覧
  - https://blog.anderiens.com/entry/tmux-color-palette
- [![図](../assets/6d5dcfeb8d24fef6f452b9c72d109651b74a6e3ef8fb2c506a8375dea272dcfe.png)]
