---
tags: "MRI, CRuby, Ruby, ep, sp, pcを操作できるgem, MRIのメソッド呼び出し"
---

# MRI pcを増加させている箇所

- ep, sp, pcを操作できるgemのために調査
- `cfp->pc = prev_pc;`のようなコードを書いてもコードの先頭にジャンプしないのは、
- 現在のバイトコードの実行後に、`pc = current_pc + 1`のような感じで更新をしているからという予想。
- 上書きしてもそれが更に上書きされるので意味がなくなっている、という予想。
- MRIのメソッド呼び出し をpcに着目しながら追えば見つかるかな...
  - tool/ruby_vm/views/_insn_entry.erb で `ADD_PC` というマクロが使われている
    - マクロの本体は vm_insnhelper.h にあるが、普通に足しているだけ
      - `#define ADD_PC(n) (SET_PC(VM_REG_PC + (n)))`
  - この部分テンプレートは tool/ruby_vm/views/vm.inc.erb で使われている
**vm.inc.erb**

```
#include "vm_insnhelper.h"
% RubyVM::BareInstructions.to_a.each do |insn|
<%= render 'insn_entry', locals: { insn: insn } -%>
% end
```

- 同じく`INC_SP`とかもしている
- pcを加算している処理では特別なことはしていなさそう。
- pcを使って次の命令をfetchしている処理はどうなっているんだろう。
- ...わかったかも
  - `SET_PC` は (vm_insnhelper.hではなく) vm_exec.c の `SET_PC` が呼ばれる
    - `reg_cfp->pc = VM_REG_PC = (x)` している
      - vm_exec.cの `VM_REG_PC` が更新される
  - `ADD_PC` は vm_insnhelper.h の `ADD_PC` が呼ばれる
    - `SET_PC(VM_REG_PC + (n))` している
    - (更新されていない) vm_insnhelper.hの`VM_REG_PC`を使っているので、`SET_PC` で更新したのが意味なくなってる?
  - ファイルが違うと `VM_REG_PC` も別物なのか?
**ログ.rb**

```
cfp: f7c73f90 (cfp2pc_assign)
pc: aaf97d50 (cfp2pc_assign)
pc: aaf97d50 (SET_PC before vm_exec.c) x: 0
pc:        0 (SET_PC after vm_exec.c) # vm_exec.cのpcは0になるが、vm_insnhelper.hの VM_REG_PC はそのまま
--- cfp2pc_assign finish ---
pc: aaf97d50 (ADD_PC before vm_insnhelper.h) n: 1
pc:        0 (SET_PC before vm_exec.c) x: aaf97d58 # ここのxが8であってほしいのにそうじゃない
pc: aaf97d58 (SET_PC after vm_exec.c)
pc: aaf97d58 (ADD_PC after vm_insnhelper.h)
```

`VM_REG_PC`について
 vm_exec.c
  `#define VM_REG_PC reg_pc`
  `#define RESTORE_REGS() { VM_REG_CFP = ec->cfp; reg_pc = reg_cfp->pc; }`
 vm_insnhelper.h
  `#define VM_REG_PC  (VM_REG_CFP->pc)`
  `#define VM_REG_CFP (reg_cfp)`
 マクロが呼ばれたときの`reg_cfp->pc`なので一致している
  となると、自分で`SET_PC`呼んだときの`reg_cfp`と、本来のiseqが呼ばれたときの`reg_cfp`が別物という可能性がある

本来のiseqが呼ばれたときの`reg_cfp`はどこで定義されたものを使っているのか？

vm_insnhelper.c:4768 の `RESTORE_REGS()` がなにか怪しいかもしれない
```cpp
if (val != Qundef) {
    return val; /* CFUNC normal return */
}
else {
    RESTORE_REGS(); /* CFP pushed in cc->call() */
}
```
`vm_sendish`で、戻り値`val`が`Qundef`だったとき(いつ？)に`RESTORE_REGS()`している
 コメントを見ると、`CFUNC normal return`じゃないときには`RESTORE_REGS()`が呼ばれて[_ いない]
 プリントデバッグしたら全部then節(`val != Qundef`)だった

vm_insnhelper.h の SET_PC を呼び出すことが大事なのではなくて、iseqを処理するときに実際に更新するpcを更新することが必要
 今は
  vm_exec.c 内で vm_exec.c の SET_PC を呼び出している
   呼び出したときに見えている `reg_cfp->pc` を更新
  vm_insnhelper.c 内で vm_insnhelper.h のSET_PC を呼び出している
   呼び出したときに見えている `reg_cfp-pc`を更新
  cfp には、cfp2pc_assign 内で引数から `cfp = FIX2LONG(ptr_rb)` で取り出したcfpを使っている
 iseqを処理するときに実際に(ADD_PCなどで)参照しているのはpcはどこのpc?
  ダイレクトスレッデッドコード？している箇所だと思う
  [YARV instruction dispatch - Qiita https://qiita.com/k0kubun/items/dbb2f0979f19f76eed26]
   >INSN_ENTRYの最後はEND_INSNが必ずついている
   >TC_DISPATCHは何をしているのか
   >さて先ほどチラと見たが、TC_DISPATCH (多分 threaded code dispatchの略) の定義はこうなっている。
```cpp
#define TC_DISPATCH(insn) \
 INSN_DISPATCH_SIG(insn); \
 goto *(void const *)GET_CURRENT_INSN(); \
 ;
```
   > reg_cfp は vm_exec_core 内で INSN_DISPATCH();よりも前で宣言されており、
```cpp
DECL_SC_REG(rb_control_frame_t *, cfp, "si");
```
 (テキトーなcfpではなくて) `vm_exec_core` 内の `reg_cfp` を更新する必要がありそう
  この関数は vm_exec.c にある
```cpp
#define RESTORE_REGS() \
{ \
    VM_REG_CFP = ec->cfp; \
    reg_pc  = reg_cfp->pc; \
}
```
  GET_ECとかで得たcfpを更新したあとで`RESTORE_REGS()`を呼ぶ必要があるのかもしれない...!

ぱっと見だとinsns.defから生成されたコード(tool/ruby_vm/views/_insn_entry.erb)に`reg_cfp`があるようには見えないのだが...
 生成されたコードは vm_exec_core 内で実行されているから見えているのだった！！！！！
`tool/ruby_vm/views/_insn_entry.erb`:
```c
printf("Function name: %s\n", __func__); // => vm_exec_core
if (leaf) ADD_PC(INSN_ATTR(width));
```
`vm_exec.c`:
```c
static VALUE
vm_exec_core(rb_execution_context_t *ec, VALUE initial)
{
...
/*****************/
 #include "vm.inc"
/*****************/
...
}
```
 ↑ここでincludeしているから、生成されたinsnsの定義の中で`reg_cfp`が見える
  詳しくは：[YARV instruction dispatch - Qiita https://qiita.com/k0kubun/items/dbb2f0979f19f76eed26#vmtcinc] を参照

じゃあ別の場所から`reg_cfp`を見るにはどうすればいいのか?

