---
tags: "本, Ruby, MRI, Bison, LALR, YARV, $ \\sube"
---

# Rubyのしくみ：コード実行とスタック

- Ruby under a microscope
  - https://github.com/ruby/ruby
- Ruby2.0の実装を解説している
- **3章 Rubyはどのようにコードを実行するか**
  - YARVスタックと制御スタックフレームの2つのスタック
    - YARVスタックはYARV命令のスタック
    - 制御スタックは`rb_control_frame_t`構造体のスタック
  - 登場人物は、「Rubyコード」「YARV命令列」「YARVスタック」「制御スタック」
  - コールスタック(制御スタック)のための`rb_control_frame_t`構造体
    - スタックポインタ(sp)
      - YARVスタックの現在の場所を指している
    - プログラムカウンタ(pc)
    - 環境ポインタ(ep)
    - self変数の値とかも保持している(self)
    - https://github.com/ruby/ruby/blob/a53aab1273729c10b7e675ce8fd1a711d22c0cd0/vm_core.h#L823-L837
```c
typedef struct rb_control_frame_struct {
    const VALUE *pc;		/* cfp[0] */
    VALUE *sp;			/* cfp[1] */
    const rb_iseq_t *iseq;	/* cfp[2] */
    VALUE self;			/* cfp[3] / block[0] */
    const VALUE *ep;		/* cfp[4] / block[1] */
    const void *block_code;     /* cfp[5] / block[2] */ /* iseq or ifunc or forwarded block handler */
    VALUE *__bp__;              /* cfp[6] */ /* outside vm_push_frame, use vm_base_ptr instead. */

#if VM_DEBUG_BP_CHECK
    VALUE *bp_check;		/* cfp[7] */
#endif
} rb_control_frame_t;
```

- `setlocal x, y`YARV命令
  - y個下のコールスタックフレームのepのx個下の箇所に、YARVスタックの頂点の値をコピーする
```text
- Each instructions are in following format:

  DEFINE_INSN
  instruction_name
  (type operand, type operand, ..)
  (pop_values, ..)
  (return values ..)
  // attr type name contents..
  {
    .. // insn body
  }
```

```c
/* Set a local variable (pointed to by 'idx') as val.
     'level' indicates the nesting depth from the current block.
 */
DEFINE_INSN
setlocal
(lindex_t idx, rb_num_t level)
(VALUE val)
()
{
    vm_env_write(vm_get_ep(GET_EP(), level), -(int)idx, val);
    RB_DEBUG_COUNTER_INC(lvar_set);
    (void)RB_DEBUG_COUNTER_INC_IF(lvar_set_dynamic, level > 0);
}

```

- `getlocal x, y`YARV命令
  - y個下のコールスタックフレームのepのx個下の箇所の値を、YARVスタックの頂点にコピーする
  - https://github.com/ruby/ruby/blob/a53aab1273729c10b7e675ce8fd1a711d22c0cd0/insns.def#L73-L99
    - YARV命令は`insns.def`にＣ言語(もどき)で書かれていて、それがC言語コードに変換されてYARV処理系になる(`vm.inc`になる)
```c
/* Get local variable (pointed by `idx' and `level').
     'level' indicates the nesting depth from the current block.
 */
DEFINE_INSN
getlocal
(lindex_t idx, rb_num_t level)
()
(VALUE val)
{
    val = *(vm_get_ep(GET_EP(), level) - idx);
    RB_DEBUG_COUNTER_INC(lvar_get);
    (void)RB_DEBUG_COUNTER_INC_IF(lvar_get_dynamic, level > 0);
}

/* Set a local variable (pointed to by 'idx') as val.
     'level' indicates the nesting depth from the current block.
 */
DEFINE_INSN
setlocal
(lindex_t idx, rb_num_t level)
(VALUE val)
()
{
    vm_env_write(vm_get_ep(GET_EP(), level), -(int)idx, val);
    RB_DEBUG_COUNTER_INC(lvar_set);
    (void)RB_DEBUG_COUNTER_INC_IF(lvar_set_dynamic, level > 0);
}
```

- `ep`が指すYARVスタックの箇所には、`special`
- `ep-1`が指す箇所には、`svar/cref`
  - `svar/cref`はspecial variable, class referenceの略
- ブロックの呼び出し
  - 新しい制御スタックフレームの`rb_block_t`構造体ができる
  - YARVスタックにも新しい`special`や`svar/cref`の値がpushされ、`special`の値は上の`rb_block_t`へのポインタとなる
  - 更にYARVスタックに新しい`special`, `svar/cref`の値がpushされ、epはこの`special`を指すようになり、この`special`の値は1つ前のepへのポインタとなる。
  - ブロック内でブロック外の変数を見つけるときは、最期にpushした方の`special`の値を辿ってepをたどる。
- 特殊変数の一部(ラストマッチ`$&`とか)は、`$`がついているけれどもグローバルではない。
- `svar/cref`とは、同じep-1の箇所だけれども、特殊変数のために使われるときか、クラス参照のために使われるかのどちらか、という意味
  - ブロックスコープのときは`cref`の役割になる
- `svar`は、「そのスタックでの特殊変数の値を保持しているセット」への参照となっている
- `cref`は、レキシカルスコープのために使われる
