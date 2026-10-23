---
tags: "gem, ruby, mri, cruby, thats_it, thats_it_gemの応用, MRI pcを増加させている箇所"
---

# ep, sp, pcを操作できるgem

- リポジトリ：https://github.com/tetetratra/ruby/tree/manipulate_ep_sp_pc (ブランチ名は仮)
  - したいこと
    - 現在のフレームのep, sp, pcの加減算
    - 該当箇所のスタックのrewrite
    - 強力なメタプロを実現するためのツールの土台を作りたい
  - 実装案
    - 「コードのフレーム→C定義関数のフレーム」という風にフレームは積まれるので、「C定義関数のフレーム」内で「コードのフレーム」のep, sp, pcを書き換えれば良いはず
  - とりあえずこれで動く
```c
VALUE rb_get_cfp(void)
{
    rb_control_frame_t* cfp = GET_EC()->cfp; // sizeof(rb_control_frame_t*) == sizeof(long) == 8
    return LONG2FIX(cfp);
}
VALUE cfp2ep(VALUE _self, VALUE ptr_rb)
{
    rb_control_frame_t* cfp = FIX2LONG(ptr_rb);
    return LONG2FIX(cfp->ep);
}
VALUE rb_access(VALUE _self, VALUE ptr_rb)
{
    VALUE* prt = FIX2LONG(ptr_rb);
    return *prt;
}
```

```ruby
x = 100
y = 200
FRAME_SIZE = 64 # == sizeof(rb_control_frame_t)
VALUE_SIZE = 8 # == sizeof(VALUE)
c = cfp!
p access(cfp2ep(c + FRAME_SIZE) - VALUE_SIZE * 4) # => 200
p access(cfp2ep(c + FRAME_SIZE) - VALUE_SIZE * 5) # => 100
binding.local_variables
# インターフェースを整えてこう書きたい
# p ((cfp + 1).ep - 4).to_rb # => 300

# こんなのもできるといい
# p ((cfp.cref_or_me - 1).ep - 4).to_rb # => 300

# これができたら嬉しい
sp = cfp.sp # コントロールフレームのスタックポインタを得る
do_something
jump!(sp) # 実質ループ

```

- MRI pcを増加させている箇所
  - インターフェース
    - グローバル関数
      - `current_control_frame!`
      - `goto!(Pointer ptr)`
        - 無理かも
    - `ControlFramePointer < Pointer`
      - `#pc`
      - `#sp`
      - `#ep`
      - `#self`
      - `#iseq`
      - `#cref_or_me`
      - `#@+`
      - `#@-`
      - `#pc=`
      - `#sp=`
      - `#ep=`
      - `#self=`
      - `#iseq=`
        - 要検討
    - `Pointer`
      - `#to_rb`
        - validかどうかを判断してから返したい
          - [function is_pointer_to_heap (Ruby 3.2 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/latest/function/is_pointer_to_heap.html) が使えそう
      - `#@+`
      - `#@-`
  - スタックフレームは`VALUE`の配列ではなく`VALUE*`の配列！！！
