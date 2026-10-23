---
tags: "Vue.js, JavaScript"
---

# Vue

- Vue.js
  - reactのprops.childrenは`<slot>`
    - 名前付きの`v-slot:名前`で渡したコンポーネントを`<slot name="名前">`で受け取れる
  - 書き方
    - Options API
      - Vue2からある
      - `<script>`の中で `data`と`medhods`を定義する
      - `this`でアクセス
    - Composition API
      - Vue3から
      - reactのuseState風に、Composableというものを定義することで、状態とその操作を切り出せる
        - 使う側では`import`して使う
        - 状態は `ref(0)` で作る
    - `<script setup>`
      - Composition APIスタイルであれば`setup`関数に渡したラムダ式内で初期化処理諸々をする必要があったところを、`<script setup>`と書けば最初から`setup`関数の中のような感じで書ける書き方
        - シンタックスシュガーのようなもので、実質的にライブラリの機能は変わっていない
        - [Vue3の<script setup>は選択肢のひとつだよね、という考察  - Qiita](https://qiita.com/fruitriin/items/81691ce68cf3678f3bda)
  - `const count = ref(0)` のように書いたとき、テンプレート内では普通に`count`を使うだけでOK (vueシステム側でunwrapしてくれる)
  - (vueに限らず) ブラウザの戻るボタンを押したとき、ブラウザのキャッシュの仕組みなのかvueの状態がリセット**されない**場合があり、↓のイベントをhookさせたりしてリセット処理を行う必要がある
    - [Window: pageshow イベント - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Window/pageshow_event)
