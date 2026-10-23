---
tags: "MRI, YARV"
---

# YARVバイトコードの解析

- バイナリのフォーマットは compile.c に書かれている
  - https://github.com/ruby/ruby/blob/c6c7f5900f8664ec9cab0c300324f973aa911d9b/compile.c#L10949
  - 名前が`ibf_` (ISeq binary format) から始まるものバイナリ関連の関数
- `TS_VALUE`などについて
  - Ruby処理系のソースコードには定義されていない定数みたい
  - 謎...
- `#to_binary` の本体 `iseqw_to_binary` は `rb_iseq_ibf_dump(iseqw_check(self), opt)` を呼ぶ
  - selfから取り出したiseqを渡している
  - `opt`はオプション引数だから普通ははnil
  - ヘッダを書き込んだ後にiseqを書き込んでいる?
  - `ibf_dump_iseq_list(dump, &header)`
    - `st_foreach(dump->iseq_table, ibf_dump_iseq_list_i, (st_data_t)&args)`
      - `ibf_dump_iseq_each(args->dump, iseq)`
        - 長い... たくさん列挙されている
        - https://github.com/ruby/ruby/blob/c6c7f5900f8664ec9cab0c300324f973aa911d9b/compile.c#L11975-L12112
**compile.c**

```
struct ibf_header {
    char magic[4]; /* YARB */
    unsigned int major_version;
    unsigned int minor_version;
    unsigned int size;
    unsigned int extra_size;

    unsigned int iseq_list_size;
    unsigned int global_object_list_size;
    ibf_offset_t iseq_list_offset;
    ibf_offset_t global_object_list_offset;
};


```

**helloworld.rb**

```
iseq = RubyVM::InstructionSequence.compile('puts "Hello world"')
puts iseq.to_binary

```

**❯ od -t c helloworld.yarv**

```
        |    yarv       | major_version | minor_version | size          |
0000000 |  Y   A   R   B|003  \0  \0  \0|001  \0  \0  \0|320  \0  \0  \0|

        | extra_size    |iseq_list_size |g_obj_list_size|iseq_list_offset|
0000020 | \0  \0  \0  \0|001  \0  \0  \0|004  \0  \0  \0|220  \0  \0  \0 |

~~~ ここまでがヘッダー ~~~
        |
0000040  300  \0  \0  \0   a   r   m   6   4   -   d   a   r   w   i   n
0000060    2   1  \0   #   ) 005   c   u 003 001 003 003 003 001 003 001
0000100  001 003  \0 377 377 377 377 377 377 377 377 001 001 003 005 005
0000120   \a   ) 003 001 001 001  \r   E  \v 001 001 001 001 001 001 001
0000140  001   ; 001 003 003 003  \a  \a 003 001 003   %   ; 023  \t  \v
0000160  001  \v  \0 377 377 377 377 377 377 377 377 001  \0 377 377 377
0000200  377 377 377 377 377  \v 003 001 001 001 003 005 001 001  \0  \0
0000220    U  \0  \0  \0 361 021  \0  \0   E 005 025   <   c   o   m   p
0000240    i   l   e   d   >  \0  \0  \0   E 003 027   H   e   l   l   o
0000260        w   o   r   l   d  \0  \0 024 005  \t   p   u   t   s  \0
0000300  224  \0  \0  \0 230  \0  \0  \0 250  \0  \0  \0 270  \0  \0  \0
0000320   \n
0000321


```
