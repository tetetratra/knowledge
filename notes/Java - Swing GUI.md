---
tags: "プログラミング言語, オートボクシング"
---

# Java: Swing GUI

- **GUI**
- **swing**
- awtが元からあって、拡張する形でswingが追加された
- `import javax.swing.*;`
  - `JTextField`クラス
    - [JTextField (Java Platform SE 8 )](https://docs.oracle.com/javase/jp/8/docs/api/javax/swing/JTextField.html)
    - >1行のテキストの編集を可能にする軽量コンポーネントです
    - `actionPerformed(ActionEvent e)`
    - `addActionListener(ActionListener l)`
      - ActionListenerはインターフェース
  - `JFrame`クラス
    - [JFrame (Java Platform SE 8 )](https://docs.oracle.com/javase/jp/8/docs/api/javax/swing/JFrame.html)
    - 継承と実装がたくさん
      - `public class JFrame extends Frame implements WindowConstants, Accessible, RootPaneContainer`
    - `setLayout(LayoutManager manager)`
      - LayoutManagerはインターフェース
        - GridLayoutが実装しているから、これのインスタンスを渡すとよい
        - [GridLayout (Java Platform SE 8 )](https://docs.oracle.com/javase/jp/8/docs/api/java/awt/GridLayout.html)
    - `add( ?? )`
      - どのインターフェースから実装されているのか不明
      - オーバーロードもたくさんされていそう
      - 引数にはコンポーネントを渡す
        - コンポーネントは`new JLabel("16")`とかがある
  - `Timer`クラス
    - ` timer = new Timer(1000, this);`のあと、`timer.start();`で、1000ミリ秒ごとに引数thisの `actionPerformed(ActionEvent e)`メソッドが呼ばれる
  - コンポーネント
  - ここで入門できそう [Swingを使ってみよう | JavaDrive](https://www.javadrive.jp/tutorial/)
