---
tags: "JavaScript, Yarn, パッケージマネージャー, npm, package.json, セマンティックバージョニング"
---

# yarn

- [Home page | Yarn](https://yarnpkg.com/)
  - ライブラリを最新に上げたいとき
    - `yarn upgrade ライブラリ名@latest`と打つ
      - もしくは`yarn upgrade ライブラリ名 --latest`
    - `@latest`を付けないと、`package.json`にかかれているバージョンが入ってしまい、最新に上げられない
  - (bundlerのGemfileは手動更新なのとは違って) yarnは`yarn add`や`yarn upgrade ライブラリ名@latest`によって、`package.json`が上がる
    - Gemfile と Gemfile.lock の両方の性質を持っているようなもの
  - `^1.0.0`と書いたら、「`1.0.0`以上かつ`1.x.x`」という意味
    - メジャー以外のバージョンであれば上げてOKという意味
