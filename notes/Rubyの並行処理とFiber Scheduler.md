---
tags: "Ruby, Fiber, Fiber Scheduler, Ractor"
---

# Rubyの並行処理とFiber Scheduler

https://workingwithruby.com/
 >このサイトでは、Ruby プログラマーにシステム プログラミングを紹介することを目的とした 3 つの電子ブックに無料でアクセスできます。
 Unix[プロセス], [TCPソケット], Ruby[スレッド]

サービスクラス配下に`Service::Result::{Error,Success,PartialSuccess}`型を作って、戻り値を代数的データ型的に扱うと格好いいかもしれない
 おのおのは抽象クラス`Service::Result`を継承する感じ

Rubyで使える[並列処理]・[並行処理]の内部実装
 [Rubyの並行処理についてまとめてみる - ユニファ開発者ブログ https://tech.unifa-e.com/entry/2021/01/29/175021]
 (OS) [Thread]
 (OS) [Process]
 (Ruby) [Fiber]
  [class Fiber (Ruby 3.1 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/class/Fiber.html]
   > Thread と違いユーザレベルスレッドとして実装されています
  [ユーザレベルスレッド], [ユーザースレッド] とは
   [スレッド (コンピュータ) - Wikipedia https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89_(%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF)#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%81%A8%E3%82%AB%E3%83%BC%E3%83%8D%E3%83%AB%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89]
    > ユーザ空間で実装されたスレッド機構をユーザースレッド、特に仮想機械上で動くものをグリーンスレッドと呼ぶ。
    >しかし、ひとつのプロセス内の複数のスレッドは常に1つだけが動作していることになり、マルチプロセッサシステムの恩恵を受けられない。
  並列ではなくて平行なので、IOバウンドな場合に恩恵があるはず
  Fiber Schedulerに関しては下にまとめてある
 (Ruby) [Ractor]
  [Ruby 3.0 の Ractor を自慢したい - クックパッド開発者ブログ https://techlife.cookpad.com/entry/2020/12/26/131858]
  Ractorは1個以上の(ネイティブ)スレッドと紐付いている?

[Fiber Scheduler]
 [Fiber Schedulerの使い方 - マイペースなRailsおじさん https://ytnk531.hatenablog.com/entry/2020/10/24/183321]
  >Fiber Schedulerは、Ruby3で追加される予定の、Fiberの新機能です。IOを扱うファイバーを複数作って、これらを適切にコンテキストスイッチしてあげると、Threadを使うよりも高い並行性を得られるという話があります。**Fiber Schedulerは、このコンテキストスイッチを実装しやすくするための機能**で、もともとはAuto Fiberと呼ばれていました。
 Fiber Schedulerは日本語版ドキュメントにはまだ載っていないかも?
  英語版には`Fiber.schedule`が書かれている：[class Fiber - RDoc Documentation https://docs.ruby-lang.org/en/3.0/Fiber.html#method-c-schedule]
 Schedulerを作って登録して、`Fiber.schedule`を呼び出すと、IO処理ごとにSchedulerに定義したメソッドが呼ばれるので、そのメソッド内でfiberの切り替え処理を書けば、IOを並行に処理できるようになる
  従来みたく`Fiber#transfer`でfiberを切り替えるのに比べて、同じ処理(スケジューリング)を楽に書ける、という新機能らしい?
 ドキュメント：[ruby/fiber.md at master · ruby/ruby https://github.com/ruby/ruby/blob/master/doc/fiber.md#scheduler]
