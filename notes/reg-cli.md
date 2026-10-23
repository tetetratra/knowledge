---
tags: "テスト, リグレッション, Capybara, rspec"
---

# reg-cli

- [reg-viz/reg-cli: 📷 Visual regression test tool.](https://github.com/reg-viz/reg-cli)
- 画像でリグレッションを検知できるツール
  - Capybara のスクリーンショット機能と合わせて、rspecのテストに組み込むこととかもできる
    - CIは自前で構築する必要あり
    - 仕組み例 (社内別チームのリポジトリ参考)
      - 正となる画像をどこかのディレクトリに入れておく (git管理対象)
      - テスト時、撮ったスクショを↑の画像と比較する
        - ここでreg-cliを使う
    - tips
      - ローカルで走らせる場合、CSSを上書きしてフォントを統一すると差分が出にくくなる
      - 少し(5%くらい)の差分なら許容するのがよさそう
      - リグレッションテスト専用のtestディレクトリを切るのが良さそう
        - rspecなら `spec/system/visual_regression/` とか
