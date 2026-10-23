---
tags: "Ruby, gem"
---

# thats_it

- https://github.com/hanachin/thats_it
- [rubyでgroovyやKotlinのitが使えるthats_it gemを作った - Qiita](https://qiita.com/hanachin_/items/8df68325142d46a7fb0b)
- >groovyやKotlinのitのようにブロックに渡された値をitで参照できる
- **実装を簡単にまとめると**
- TracePointを使って、yieldで呼ばれるブロックの実行直前のタイミングを `call`, `c_call` でフックして、そのブロックのiseqをちょっと書き換える。ブロック側の引数定義が0個だったときに、1個だったときのように振る舞うようにし、その1個目の引数にはyieldに渡した1番目の引数が入り、ブロック側では`it`メソッド呼び出しによりその1個目を取れるようにして実装している。
  - 処理系内部をハックしている箇所は次の2箇所
    - yieldに渡した引数のpush
    - ブロックのiseqのparam情報(`iseq->body->param`など)の書き換え
  - 書き換えている箇所
    - https://github.com/hanachin/thats_it/blob/8701c614e81a50255f4b4a39f923825a9f31dd11/ext/thats_it/thats_it.c#L85-L95
  - iseqの、`iseq->body->param`以外は書き換えられるのだろうか？
    - `iseq->body->iseq_encoded`というフィールドがあって、ここに命令列が入っていそう
    - デコードすればわかりやすいiseqの表現が得られそう
  - blockからASTは、`RubyVM::AbstractSyntaxTree.of`
  - ASTからRubyソースコードへの変換は、[osyo-manga/gem-rensei](https://github.com/osyo-manga/gem-rensei) gem
