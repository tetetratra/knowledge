---
tags: "Ruby_on_Rails, Ruby_on_Rails_view, webpack, css, scss"
---

# Webpacker

- https://railsguides.jp/webpacker.html
  - 仕組み概要
    - `app/javascript/packs/` ディレクトリがデフォルトで作られる
    - 「pack」という概念がある
      - pack: Webpackのビルドの「出発点」（エントリーポイント）
      - **packを起点にJS, CSS, 画像などを1つにまとめる**
    - `app/javascript/packs/{pack名}.js` というようにファイルを置くと、**pack**が作られる
    - packの使い方：`javascript_pack_tag "pack名"` で呼び出せるようになる
    - packの中に何を書くべきなのか
      - そのpackで使うJS, CSS, 画像など
    - どう書くべきなのか
      - js
        - `import './initializer.js'`
        - `import { SomeClass } from '@js/components/some_page/some_class'`
        - `import axios from 'axios'`
      - css
        - `import './styles.scss'`
        - `import '@js/assets/stylesheets/pages/some_page/responsive.scss'` (`@js = app/javascript`)
      - 画像
        - `import logoImage from '@js/assets/images/logo.png'`
          - `const img = document.createElement('img'); img.src = logoImage; document.body.appendChild(img)` のように使える
  - 疑問
    - packのtsファイルに直接ロジックを書くのはアリなの？
      - → yes. 非推奨
    - packの粒度はどの単位で作るとよいの？
      - → ページごとに1つのpackを作るのが一般的
      - → `packs/admin/common.ts` のように、 機能ごとで共通のpackを作るのもアリ
