---
tags: "ruby, MRI, 末尾再帰, tail call, tail call optimization, MRIのメソッド呼び出し"
---

# MRIの末尾呼び出し最適化

- ruby
- MRI
- 末尾再帰
- tail call
- tail call optimization
  - 関数呼び出し後に他にやることがなければ、(途中結果を破棄できるので)最適化が効く
    - 逆に、やることがあるにもかかわらず最適化を書けてしまうと、バグる
- **コンパイル時**
  - ifは`branchunless`になる
    - 下の`0008`の行
```rb
if rand(2) == 0 then (p 10) end

== disasm: #<ISeq:<compiled>@<compiled>:1 (1,0)-(1,31)> (catch: FALSE)
0000 putself                                                          (   1)[Li]
0001 putobject                              2
0003 opt_send_without_block                 <calldata!mid:rand, argc:1, FCALL|ARGS_SIMPLE>
0005 putobject_INT2FIX_0_
0006 opt_eq                                 <calldata!mid:==, argc:1, ARGS_SIMPLE>[CcCr]
0008 branchunless                           16
0010 putself
0011 putobject                              10
0013 opt_send_without_block                 <calldata!mid:p, argc:1, FCALL|ARGS_SIMPLE>
0015 leave
0016 putnil
0017 leave

```

- `opt_aref_with`
  - `compile_call_precheck_freeze`
  - `obj["literal"] -> opt_aref_with(obj, "literal")`のように変換されるらしい
  - `[]`呼び出し
- `opt_aset_with`
  - `[]=`呼び出し
- `iseq_peephole_optimize`関数
  - 次がジャンプなsend命令に`VM_CALL_TAILCALL`フラグをつけている
- **実行時**
  - メソッドの流れ
  - →`vm_call_iseq_setup`
    - →`vm_callee_setup_arg`
      - →`CC_SET_FASTPATH`
        - この関数の引数に`vm_call_iseq_setup_tailcall_opt_start`関数を渡している。多分これが呼ばれる
        - →`vm_call_iseq_setup_tailcall_opt_start`
          - →`vm_call_iseq_setup_tailcall`
            - 実際の処理
            - `vm_pop_frame`や`vm_push_frame`をしている
- **環境のフレームを即座に破棄できないような場合はどうしているのか**
  - gからaを参照しているので、aは破棄できないはず
```rb
def f(a)
  g = ->{a*a; raise}
  g.()
end
f(100)
```

- `g.()`の呼び出しには`TAILCALL`が付く
```rb
0008 opt_send_without_block                 <calldata!mid:raise, argc:0, FCALL|VCALL|ARGS_SIMPLE>
```

- 実行時にはTCOはされていない
```text
❯ tcoruby tc.rb
<compiled>:2:in `block in f': unhandled exception
        from <compiled>:3:in `f'
        from <compiled>:5:in `<compiled>'
        from -e:1:in `eval'
        from -e:1:in `<main>'
```

- `g.()`の呼び出しでは`vm_call_iseq_setup_normal`も`vm_call_iseq_setup_tailcall`も通っていないみたい
  - `vm_push_frame`は呼ばれている
  - どこから`vm_push_frame`を呼んでいるんだ？
    - `vm_invoke_iseq_block`だった
    - (iseqの)ブロックが呼ばれるときは、そもそもTCOの条件分岐をしている箇所すら通らずに`vm_push_frame`されるらしい
