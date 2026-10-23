---
tags: "MRI, Ruby"
---

# MRIのメソッド呼び出し

- [Rubyの yield / Proc#call はどこのブロックを呼ぶのか - Qiita](https://qiita.com/k0kubun/items/c118a968065a48c1b873)
- [The Story of Method Lookup - Qiita](https://qiita.com/k0kubun/items/d1c1a868913d76f61073#vm_call_general%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88)
- [TracePointから学ぶRubyVM](http://joker1007.github.io/slides/toyama01/slides.html#1)
  - `send`命令
    - insns.defに定義あり
    - > `vm_sendish` -> `vm_call_general`に繋がりメソッド呼び出しが実行される
  - >最初に
  - > 自分でもRubyVMの動きを調べてみようと思う方へ
  - > `-O0`でコンパイルしたRubyを用意する
  - > `./configure --prefix=${INSTALL_DIR} optflags="-O0"`
  - > 簡単な機能だけでもgdbを使える様になっておく
  - > 正直gdbで止めて追っかけないと、相当詳しくない限りVMの処理を追うのは難しい。
- `rb_execution_context_t`
**vm_core.h**

```
struct rb_execution_context_struct {
    VALUE *vm_stack;		/* must free, must mark */
    size_t vm_stack_size;       /* size in word (byte size / sizeof(VALUE)) */
    rb_control_frame_t *cfp;
    struct rb_vm_tag *tag;
    ...

```

- メソッド探索は vm_insnhelper.c の `vm_search_method`で行われていそう
- YARVバイトコードのループをしている箇所
  - `GET_PC()`で得られる値が関数ポインタで、それを`ec`, `reg_cfp`で呼び出している
**vm_exec.c**

```
vm_exec_core(rb_execution_context_t *ec, VALUE initial)
   ...
    while (1) {
        reg_cfp = ((rb_insn_func_t) (*GET_PC()))(ec, reg_cfp); // ここ

```

- `ec`はグローバル変数で持っている？
**vm.c**

```
RB_THREAD_LOCAL_SPECIFIER rb_execution_context_t *ruby_current_ec;
```

- `GET_EC()`でgetしているのはこのグローバル変数っぽい
- send命令の処理
  - `vm_sendish`が主な処理
  - `vm_cc_call(cc)` で得た関数を`(ec, GET_CFP(), &calling)`で呼び出している
**vm_insnhelper.c**

```
vm_sendish(...) {
    VALUE val = Qundef;
    ...
    switch (method_explorer) {
      case mexp_search_method:
        calling.cc = cc = vm_search_method_fastpath((VALUE)reg_cfp->iseq, cd, CLASS_OF(recv));
        val = vm_cc_call(cc)(ec, GET_CFP(), &calling); // ここで呼び出している
        break;
    ...

```

- insns.defからコードを生成しているのは、`/ruby/tool/insns2vm.rb`
- `rb_define_method(rb_cMethod, "call", rb_method_call_pass_called_kw, -1)`を辿ると
  - vm_eval.cの`vm_call0_body`に行き着く
    - ここからvm_insnhelper.cの`vm_call_iseq_setup`を呼んでいる
      - `vm_call_iseq_setup_normal`か`vm_call_iseq_setup_tailcall`が呼ばれる
