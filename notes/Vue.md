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
  - `nextTick` は、状態の変更が DOM に反映されたあとに処理を動かすための関数（[nextTick() - Vue.js](https://ja.vuejs.org/api/general.html#nexttick)）
    - Vue は状態を変えてもすぐには DOM を書き換えない。同じ tick の中の変更をためておき、あとでまとめて1回だけ描画し直す
    - そのため、状態を変えた直後に DOM を読むと、まだ古い DOM が見える
    - `await nextTick()`（または `nextTick(() => { ... })`）のあとなら、書き換え後の DOM を読める
    - 例：要素を表示する状態に変えてから、その要素にフォーカスを当てる・位置や大きさを測る
  - `v-for` の `:key` が変わると、Vue はその要素を使い回さず、中のコンポーネントごと捨てて作り直す（[key 属性 - Vue.js](https://ja.vuejs.org/api/built-in-special-attributes.html#key)）
    - 例：空の行で選択肢を選ぶと、key にしている識別子が空から値に変わり、その行が作り直される
    - 作り直される前のコンポーネントが次の描画（`nextTick`）に処理を予約していると、その処理は捨てられたあとに動く
      - たとえば body 直下に出したドロップダウンの位置合わせは、元の入力欄を参照する。入力欄はもう消えているので参照が `null` になり、`Cannot read properties of null (reading 'nodeName')` が出る
      - 画面の操作は止まらないので気づきにくく、エラー監視にだけ届く
