---
tags: "Ruby, RBS, typeprof, Steep, rbs_collection.yaml"
---

# RBS

- Ruby用の型定義言語
- typeprofで生成してSteepで検査
  - 自作gemを作るときにはrbs_collection.yamlにこう書くべし
**rbs_collection.yaml**

```
- name: 自作gemの名前
  ignore: true

```

- [RubyからRBSを生成する各方法の特徴 - pockestrap](https://pocke.hatenablog.com/entry/2020/12/18/230235)
  - `rbs prototype rb`
    - 静的
  - `rbs prototype runtime -r hoge.rb`
    - 動的
    - `rbs prototype runtime -R lib/hoge.rb 'Hoge::*' Hoge > sig/hoge.rbs`
  - `typeprof hoge.rb`
    - 静的
    - 推論あり
    - エントリーファイル(とは?)を指定する必要がある
    - (typeprofをGemfileに書いた場合は) rbs_collection.yaml の ignore に typeprof を追加しないとエラーになる
