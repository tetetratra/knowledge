---
tags: "MRI, CRuby, GC"
---

# imemo

- [Ruby Parser開発日誌 (8) - Universal Parserへの道 - かねこにっき](https://yui-knk.hatenablog.com/entry/2023/05/01/174828)
  - > imemoというのはCRubyの内部で使うデータをGCに管理させるための仕組みです。例えば文字列リテラルやheredoc、%記法のパースのために閉じ記号やinterpolationをするかどうかといったデータを管理する必要があり、それらはimemo_parser_strtermというデータ構造で管理しています。

**internal/imemo.h**

```c
enum imemo_type {
    imemo_env            =  0,
    imemo_cref           =  1, /*!< class reference */
    imemo_svar           =  2, /*!< special variable */
    imemo_throw_data     =  3,
    imemo_ifunc          =  4, /*!< iterator function */
    imemo_memo           =  5,
    imemo_ment           =  6,
    imemo_iseq           =  7,
    imemo_tmpbuf         =  8,
    imemo_ast            =  9,
    imemo_parser_strterm = 10,
    imemo_callinfo       = 11,
    imemo_callcache      = 12,
    imemo_constcache     = 13,
};
```

- `ep[-2]`に入っているのはcref(class reference)かment(method entry)のIMEMO
  - **vm_insnhelper.c**
    ```c
    // vm_push_frame
    *sp++ = cref_or_me; /* ep[-2] / Qnil or T_IMEMO(cref) or T_IMEMO(ment) */
    ```
  - svar (special variable)も入りうるのでは???
