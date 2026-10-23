---
tags: "プログラミング言語, jsprimer, Volta, Beacon"
---

# JavaScript

- [JavaScript Primer - 迷わないための入門書 ](https://jsprimer.net/)
  - HTML返す
    - `return document.getElementsByTagName("html")[0].outerHTML`
  - `Array.from(hoge)` でtoArrayにできる
    - querySelectorAllとかで得れるのはNodeSetだから、配列のメソッド使いたいときはこうする
      - https://blog.sushi.money/entry/2017/04/19/114028
    - mapとかfilterとか使える
      - [Array - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array)
  - イベントの基本
    - 標準jsでのイベント登録方法はこんなかんじ [イベントハンドラ - とほほのWWW入門](http://www.tohoho-web.com/js/onevent.htm)
      - `<tagName onxxx="...">`
      - `object.onxxx = function`
      - `object.addEventListener(event, function)`
        - コレが一般的かも
      - `object.removeEventListener(type, listener[, options])`
    - 各種イベントハンドラ
      - クリック系
      - キー系
      - マウス系
      - ページのロード系
      - 要素にフォーカス系
      - フォームサブミット系
      - フォームの入力変更系
      - ウィンドウのサイズ系
  - HTML内scriptのjs呼び出しが、そのjsファイルの読み込み前に行われてしまうとき
    - Railsでは、`<%= javascript_include_tag 'application' %>`がbodyの一番下にある(`layout.html.erb`見るとわかる)。これは、headよりも早くjsを読み込ませるため。
      - でもこのせいで、viewの`<script>`内でのメソッド呼び出しが上手く行かない(ロード前にjsが呼ばれてエラーになる)
    - HTML側からjsを呼ぶのが間違っていて、js側でHTMLのDOMレンダリングのフックを登録するのが正しい
    - [Window: DOMContentLoaded イベント - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Window/DOMContentLoaded_event) を使ったらとりあえず大丈夫だった
      - >最初の HTML 文書の読み込みと解析が完了したとき、スタイルシート、画像、サブフレームの読み込みが完了するのを待たずに発生します。
  - テキストをnodeに変換して、それを指定位置にinsertするメソッド
    - [Element.insertAdjacentHTML() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)
    - `position_node.insertAdjacentHTML('afterbegin', target_node)`
    - ヒアドキュメントを使えば素のjsでもそれっぽく書ける
  - [JavaScriptのOptional ChainingとNullish Coalescing Operatorでnullやundefinedと戦う](https://sbfl.net/blog/2020/03/24/javascript-null-aware/)
  - Optional Chaining
    - `a?.b`のような書き方
    - >aがnullまたはundefinedの場合、そこで評価は打ち切られ値がundefined
    - `ojb?.[attr]?.[prop]`のようにも使える
  - Nullish Coalescing Operator
    - `||` ではなく `??`
    - >`||` は「左の値がFalsyのとき右の値を採用する」ですが、`??` は「左の値がnullかundefinedのときのみ右の値を採用」という挙動
    - falsyは、`false, undefined, null, 0, 0n, NaN`で、nullishは`null, undefined`
  - [PromiseによるJavaScript非同期処理レシピ集](https://sbfl.net/blog/2019/11/04/promise-cookbook/)
    - Promise
      - Promiseオブジェクトは、処理中（pending）、解決（fulfilled）、リジェクト（rejected）の3状態を持つ
      - 処理の終了やエラーをトリガーに、次の処理に移れる
      - 解決は`.then(result => ~ )`で、リジェクトは`.catch(err => ~ )`で受け取る。`.finally(()=> ~ )`もある
    - async, await
      - 関数の前にasyncとつけると、戻り値がPromiseで包まれる
      - 関数内部でawaitが使えるようになって、awaitでその関数内でできたPromiseオブジェクトの処理を待てる
      - awaitは何個でも書けて、実行された順から、以前のawaitが終わるまで待っている
    - `Promise.all(promiseArray)`
      - >「受け取ったPromiseの配列が全て解決するまで待つPromise」を生成します
      - 受け取ったPromiseのどれかが解決するまで待つ、みたいなのもある
    - setTimeoutのようなコールバック系の関数もあれば、fetchみたいなPromise返すやつもある
    - 返り値には解決された値が入る。分割代入もできる
      - https://qiita.com/xx2xyyy/items/797ad2928b541d372ce5
  - fetchAPI
    - [WindowOrWorkerGlobalScope.fetch() - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/WindowOrWorkerGlobalScope/fetch)
    - HTTPのエラーのレスポンスコードではPromiseのエラーにはならず、ネットワークのエラーの時のみエラーになる
      - `response.ok`で確認
    - PromiseでラップされたResponseオブジェクトを返す
      - [Response - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Response)
        - `body`でbodyを取れるけど、これはIO系オブジェクト(ストリームオブジェクト)なので、更に読み込みが必要
    - 簡単に使うならtext()やjson()
      - `fetch("https://developer.mozilla.org").then(res => res.text()).then(t => alert(t))`
  - 配列の便利操作
    - [JavaScriptの配列（Array）についてまとめてみた](https://sbfl.net/blog/2018/07/04/javascript-array/)
  - [JavaScript超基礎講座！イベント処理を学ぶ | Hypertext Candy](https://www.hypertextcandy.com/vanilla-javascript-event)
    - (ラムダじゃなくて)functionでコールバックを登録したイベントハンドラー内のthisは、addEventListnerのレシーバを指す
    - removeEventLister('click', func)で、同じ関数を指定すると、登録したイベントを消せる
    - onceオプションで、1度実行されたら登録削除にできる
```js
element.addEventListener('click', function(event) {
  // ...
}, { once: true });
```

- aタグが押されたが遷移したくない、formが送信されそうだがその前にバリデーションをしたい、というときに、`event.preventDefault();`とすると、デフォルトのイベントの挙動がキャンセルされる。
  - formは`event.currentTarget.submit();`で送信、ボタン(`type="submit"`)は`form.submit();`で送信
- イベントの伝播
  - HTMLの親子要素の両方にclickイベントを登録して、子を押したときに、子から親の順でイベントが発火される
  - `event.stopPropagation();`で、親への伝播をストップ
- ページが読み込まれる仕組み
  - >ブラウザから Web サーバーに、特定のページに対するリクエストを送信すると、まず HTML ファイルがレスポンスとして返ってきます。
  - >ブラウザはまずその HTML ファイルを DOM のなかに読み込んでいきます。
  - >上から順に読み込みながら、`<link>` や `<img>` など、さらに別のリソースが指定された要素を見つけると、対象のサーバにリクエストを発行します。
  - >必要なリソースが返ってくると、CSS や画像など、それぞれ処理します。
- documentオブジェクトの`DOMContentLoaded`イベント
  - HTML の内容だけは DOM に読み込まれたとき。基本コレ使う
- windowオブジェクトの`load`イベント
  - 依存リソースまですべて読み込んでページが完成したとき
- documentオブジェクトの`readyState`プロパティ
  - loading, interactive, complete の3つがある
- windownの`beforeunload`イベント
  - ページを離れる時がタイミングで、確認ダイアログを出す機能のみ。
- イベント処理の応用的なことについて
  - [JavaScript中級編！？カスタムイベントを使おう | Hypertext Candy](https://www.hypertextcandy.com/javascript-custom-events)
  - これも読もう[JavaScript超基礎講座の記事一覧 | Hypertext Candy](https://www.hypertextcandy.com/tags/vanilla-javascript-primer)
- 最近のjsで、プリミティブ型にBigIntとSymbolが追加された
  - BigIntは、数値の後ろにnをつける
  - `typeof`で変数のプリミティブ型を調べられる(でもnullはobject型になる)
- 普通のオブジェクトをオブジェクトのキーにしても、そのキーはstring化されて`"[object Object]"`になるから無意味だけど、SymbolはSymbolの文字にString化される
- nullはリテラルだけどundefinedはグローバル変数
- オブジェクトにメソッド追加
  - [関数と宣言 · JavaScript Primer ](https://jsprimer.net/basic/function-declaration/)
```js
const obj = {
    method: function() {
        return "this is method";
    }
};
console.log(obj.method()); // => "this is method"
```

- ↑のは、`method() {`でもOK
- オブジェクトへのアクセス
  - 基本はドット記法`obj.attr`
  - 変数を使いたいときや、ハイフン入りのプロパティのときはブラケット記法`obj[attr_name], ojb['attr-val']`
- ojb.mergeじゃなくて`Object.assign(obj1, obj2, ...)`
  - 第一引数が破壊的に変更されるから、第一引数は`{}`を指定すると良い
  - spread構文で書いたほうがよりよい`{...ojb1, ...ojb2}`
- jsの文字コードの話
  - [文字列とUnicode · JavaScript Primer ](https://jsprimer.net/basic/string-unicode/)
- 「巻き上げ(hoisting)」とは
  - スコープの一番上に宣言が移動すること
  - `function, var`で定義したものは巻き上げられる
  - varは、もっとも近い関数またはグローバルスコープに「宣言」は巻き上げられ、「代入」はそのままの場所に残る
    - ので、変数を参照はできるけど、undefinedになる
- thisについて
  - [関数とthis · JavaScript Primer ](https://jsprimer.net/basic/function-this/)
- `[] === [] //=> false`なので注意
  - 配列はオブジェクトなので
  - lodash`_isEqual`とかを使うと楽
    - https://lodash.com/docs/4.17.15#isEqual
- ChromeのデベロッパーツールのコンソールでJavaScriptのライブラリをちょこっと使いたいとき
  - [ChromeのデベロッパーツールのコンソールでJavaScriptのライブラリをちょこっと使いたいとき - Qiita](https://qiita.com/kyohei121877/items/b1f945b01b42176cde11)
- Formオブジェクトをjsで作って、それにバイナリデータをappendして送信すると、multipartのリクエストとして送られる
  - [FormData.append() - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/FormData/append)
```js
const form = new FormData()
form.append('json', JSON.stringify(data))

```

- fetchの`ok`がfalseのときに、rejectedなPromiseを返すには
  - https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91#gistcomment-3136343
```js
fetch(
  ...
).catch(r => {
  throw { error: 'ネットワークエラー' }
}).then(r =>
  r.ok ? r.json() : r.json().then(json => { throw json })
)

```

- 日本語用便利ライブラリ
  - [hakatashi/japanese.js: Util collection for Japanese text processing. Hiraganize, Katakanize, and Romanize.](https://github.com/hakatashi/japanese.js)
  - [terrierscript/historykana: Japanese furigana library](https://github.com/terrierscript/historykana)
- 一覧結果をフロントで絞るとページネーションが機能しなくなるので注意!
- ある特定のパッケージだけを更新するには、`yarn upgrade-interactive`
  - [yarn upgrade-interactive が超便利 - Qiita](https://qiita.com/terrierscript/items/98931b91d155348046c9)
- webpack
  - [モダンJavaScript概論 − Node, npm, ECMAScript, Babel, Webpack | Hypertext Candy](https://www.hypertextcandy.com/modern-javascript)
  - jsの依存関係を解決して、正しい順番で1つの大きなファイルにまとめるツール
  - これまでは、ファイル内でのimportの依存関係を、依存のみされているファイルを先にscriptタグで読み込む必要があったが、webpackでこの問題が解決
  - 画像とかもまとめられる
- npmでbundle exec相当のことをしたい
  - [npm で bundle exec 相当の使い方をしたい場合の設定とnpm本体の現状 - Qiita](https://qiita.com/tbpgr/items/2f4ca57307b77c187e0d)
  - `PATH=$PATH:./node_modules/.bin eslint --fix hoge.js`
  - 昔の記事だから今は別の手段あるかも?
    - →今は`npx`でいける
- [4.3. throwしないで、rejectしよう | JavaScript Promiseの本](https://azu.github.io/promises-book/#not-throw-use-reject)
  - >Promiseの中で throw による例外が発生した場合は自動的に try…​catch され、そのpromiseオブジェクトはRejectedとなります。
  - thenでもrejectする方法も載っている
- カリー化されたlodash
  - [FP Guide · lodash/lodash Wiki](https://github.com/lodash/lodash/wiki/FP-Guide)
- [npmパッケージのvulnerability対応フロー - Qiita](https://qiita.com/riversun/items/7f1679509f38b1ae8adb)
- 配列の初期化には`fill()`が必要
  - [JavaScriptのnew Array(n)をmapしたいとき fillをはさむ理由 - Javaエンジニア、React+Firebaseでアプリを作る](https://yucatio.hatenablog.com/entry/2019/04/07/110721)
- オブジェクトのプロパティをimmutableにとりのぞくには
  - [特定のプロパティを除外した新しいオブジェクトを作る（immutableなdelete） - rikubaのブログ](https://rikuba.hatenablog.com/entry/20180202/ecmascript_object_omit)
  - 分割代入で捨てるのが楽
- npmの「Try on RunKit」からブラウザ上でライブラリを試せる
- [JavaScript入門 - とほほのWWW入門](https://www.tohoho-web.com/js/what.htm)
  - >ECMAScript には次のようなバージョンがあります。ES6 からは、ES2015 のように表記するようになりました。
  - `ECMAScript 2015 = ES2015 = ES6`
  - `ES2020`の表記を使うのがわかりやすくて良さそう
- Volta
  - バージョン管理ツール
  - nodeの他にyarnとnpmのバージョンもこのツールで管理できる
```sh
❯ volta list
⚡️ Currently active tools:

    Node: v18.15.0 (default)
    Yarn: v4.0.0-rc.40 (default)
    Tool binaries available: NONE

```

- Beacon API
  - 公式のAPI
    - [Beacon API - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Beacon_API)
    - > Beacon API はウェブサーバーに非同期でブロッキングしないリクエストを送るのに使用されます。リクエストのレスポンスは求めません
    - > XMLHttpRequest や Fetch API により行われるリクエストとは違い、ブラウザーはビーコンのリクエストをページがアンロードされる前に開始し、完了するまで処理することを保証します。
  - 送れるのは`POST`のみ
    - それ以外は`fetch()`を使う
      - > リクエストを POST 以外のメソッドで送信したり、リクエストプロパティを変更したり、サーバーのレスポンスにアクセスしたりする必要がある用途では、fetch() メソッドに keepalive を設定したものを使用してください。
