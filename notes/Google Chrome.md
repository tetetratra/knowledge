---
tags: "ブラウザ, JavaScript, chrome remote, chrome_remote, gem, ferrum, Chrome DevTools, kiosk, Chrome"
---

# Google Chrome

- [- [ブックマークレットで Markdown 用のリンクテキストを自動生成  - Qiita](https://qiita.com/YokohamaHori/items/cc49607d6b005b414ff3)]
  - `document.execCommand("copy")`はブラウザ的に非推奨らしいからつかうのをやめる。代わりに`navigator.clipboard`を使えとのこと
```js
javascript:!function(){var e=document.createElement("textarea"),t=document.title.replace(/\[/g,"\\[").replace(/]/g,"\\]").replace(/\|/g,"\\|"),c=document.URL.replace(/\(/g,"%2528").replace(/\)/g,"%2529");e.textContent="["+t+"]("+c+")",document.querySelector("body").append(e),e.select(),document.execCommand("copy"),e.remove()}();
```

- が、普通に `navigator.clipboard.writeText` を使うと、documentにフォーカスが当たっていない場合はコピーできないという仕様があって拒まれてします
- なので、 https://stackoverflow.com/a/70386674 を参考にして改良版を作った↓
  - **なにか要素がfocusになったときに**、`navigator.clipboard`を実行するPromiseを仕込む方法
```javascript
function () {
    return new Promise((resolve, reject) => {
        const _asyncCopyFn = (async () => {
            try {
                const value = await navigator.clipboard.writeText(`[${document.title}](${window.location.href})`);
                resolve(value);
            } catch (e) {
                reject(e);
            }
            window.removeEventListener("focus", _asyncCopyFn);
        });
        window.addEventListener("focus", _asyncCopyFn);
    });
}();
```

- 1行版↓
```js
javascript:!function () { return new Promise((resolve, reject) => { const _asyncCopyFn = (async () => { try { const value = await navigator.clipboard.writeText(`[${document.title}](${window.location.href})`); resolve(value); } catch (e) { reject(e); } window.removeEventListener("focus", _asyncCopyFn); }); window.addEventListener("focus", _asyncCopyFn); }); }();
```

- scrapboxのurl版↓
```javascript
javascript:!function () { return new Promise((resolve, reject) => { const _asyncCopyFn = (async () => { try { const value = await navigator.clipboard.writeText(`[${document.title} ${window.location.href}]`); resolve(value); } catch (e) { reject(e); } window.removeEventListener("focus", _asyncCopyFn); }); window.addEventListener("focus", _asyncCopyFn); }); }();

```

- head lessモードに関するドキュメント
  - https://developer.chrome.com/docs/chromium/headless?hl=ja
- chrome remote
  - [chrome_remoteという選択（脱Selenium大作戦） – 株式会社ルーター](https://rooter.jp/web-crawling/chrome_remote/)
  - chrome_remoteというgemがある
    - [GitHub - cavalle/chrome_remote: DISCONTINUED - A client implementation of the Chrome DevTools Protocol in Ruby](https://github.com/cavalle/chrome_remote?tab=readme-ov-file)
      - 今はメンテが終わっていて、ferrumというgemになっている
        - [GitHub - rubycdp/ferrum: Headless Chrome Ruby API](https://github.com/rubycdp/ferrum)
    - chromeをdebbuging-port経由で操作する
      - debbuging-portとは
        - 指定したportでデバッグ系操作を受け付けるような機能がchromeにはある
    - 操作方法
      - Chrome DevTools Protocolというプロトコルで操作する
        - リファレンス：https://chromedevtools.github.io/devtools-protocol
      - jsを実行できるので、基本的にはjsで操作するのがやりやすい
**サンプルコード.rb**

```
js ="document.querySelector('.view-count').innerText" # 再生回数のCSSセレクタ
response = @chrome.send_cmd 'Runtime.evaluate', expression: js
p response #=> {"result"=>{"type"=>"string", "value"=>"2,637,941 回視聴"}}

```

- https://github.com/DefinitelyTyped/DefinitelyTyped に、ChromeのAPIの型とかも載っている
  - https://github.com/DefinitelyTyped/DefinitelyTyped/blob/10257268f20ed152074e715f6640608e89010fa1/types/chrome/index.d.ts#L473
- 全画面表示するには kioskモードを使う
  - [Google Chromeでキオスクモード使うときのオプション  - Qiita](https://qiita.com/tsuttsu305/items/be58817dbd2ef53bbcc9)
  - `--kiosk`
