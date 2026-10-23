---
tags: "Ruby on Rails, パフォーマンス, スケーリング, Puma, GVL, アムダールの法則, リトルの法則"
---

# RailsのGVLとPumaスレッド

- [Railsスケーリング（1）Puma、コンカレンシー、GVLのパフォーマンスへの影響を理解する（翻訳）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2025_06_09/151182)
  - Pumaがリクエストを処理するしくみ
    - リクエストはTCPソケット経由で届き、まずはTCPのqueueに入る
    - Pumaはそのqueueからリクエストを取り出す
  - RubyにはGVL（Global VM Lock）があるので、スレッドを（コア数まで）増やしても、CPUバウンドである限り早くはならない
    - スレッドが実行しているコードがIO操作をしたときにGVLを解放するので、IOバウンドについては早くなる
    - それとは別に、100ms経つと強制的に別のスレッドに切り替わる
  - [gvl-tracing: Get a timeline view of Global VM Lock usage in your Ruby app](https://github.com/ivoanjo/gvl-tracing) Gem でGVLを可視化できる
  - スレッド数を増やしすぎてもGVLの競合が大量に発生するのでよくない
