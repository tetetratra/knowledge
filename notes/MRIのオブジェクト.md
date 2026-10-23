---
tags: "Ruby, MRI"
---

# MRIのオブジェクト

- ruby
- MRI
  - 参考
    - Rubyのウラガワ
    - Ruby インタプリタで学ぶアルゴリズムとデータ構造
    - A Rubyist's Walk Along the C-side
  - `RVALUE`は、`VALUE`5個分
    - ヘッダ(`RBasic`構造体)で2個分、ボディーで3個
  - `VALUE`は64ビットCPUで8バイト
    - なので、1つのオブジェクトにつき40バイト必要
  - すべてのオブジェクトは`RBasic`を内包している
**include/ruby/internal/core/rbasic.h**

```
RBasic {
    VALUE flags;
    const VALUE klass;
    ...
```

- `RObject`
**include/ruby/internal/core/robject.h**

```
struct RObject {
    struct RBasic basic;
    union {
        struct {
            uint32_t numiv;
            VALUE *ivptr;
            struct st_table *iv_index_tbl; /* shortcut for RCLASS_IV_INDEX_TBL(rb_obj_class(obj)) */
        } heap;
        VALUE ary[ROBJECT_EMBED_LEN_MAX];
    } as;
};

```

- Cレベルでの型一覧
**include/ruby/internal/value_type.h**

```
ruby_value_type {
    RUBY_T_NONE     = 0x00, /**< Non-object (sweeped etc.) */

    RUBY_T_OBJECT   = 0x01, /**< @see struct ::RObject */
    RUBY_T_CLASS    = 0x02, /**< @see struct ::RClass and ::rb_cClass */
    RUBY_T_MODULE   = 0x03, /**< @see struct ::RClass and ::rb_cModule */
    RUBY_T_FLOAT    = 0x04, /**< @see struct ::RFloat */
    RUBY_T_STRING   = 0x05, /**< @see struct ::RString */
    RUBY_T_REGEXP   = 0x06, /**< @see struct ::RRegexp */
    RUBY_T_ARRAY    = 0x07, /**< @see struct ::RArray */
    RUBY_T_HASH     = 0x08, /**< @see struct ::RHash */
    RUBY_T_STRUCT   = 0x09, /**< @see struct ::RStruct */
    RUBY_T_BIGNUM   = 0x0a, /**< @see struct ::RBignum */
    RUBY_T_FILE     = 0x0b, /**< @see struct ::RFile */
    RUBY_T_DATA     = 0x0c, /**< @see struct ::RTypedData */
    RUBY_T_MATCH    = 0x0d, /**< @see struct ::RMatch */
    RUBY_T_COMPLEX  = 0x0e, /**< @see struct ::RComplex */
    RUBY_T_RATIONAL = 0x0f, /**< @see struct ::RRational */

    RUBY_T_NIL      = 0x11, /**< @see ::RUBY_Qnil */
    RUBY_T_TRUE     = 0x12, /**< @see ::RUBY_Qfalse */
    RUBY_T_FALSE    = 0x13, /**< @see ::RUBY_Qtrue */
    RUBY_T_SYMBOL   = 0x14, /**< @see struct ::RSymbol */
    RUBY_T_FIXNUM   = 0x15, /**< Integers formerly known as Fixnums. */
    RUBY_T_UNDEF    = 0x16, /**< @see ::RUBY_Qundef */

    RUBY_T_IMEMO    = 0x1a, /**< @see struct ::RIMemo */
    RUBY_T_NODE     = 0x1b, /**< @see struct ::RNode */
    RUBY_T_ICLASS   = 0x1c, /**< Hidden classes known as IClasses. */
    RUBY_T_ZOMBIE   = 0x1d, /**< @see struct ::RZombie */
    RUBY_T_MOVED    = 0x1e, /**< @see struct ::RMoved */

    RUBY_T_MASK     = 0x1f
};
```

- `RUBY_T_IMEMO`や`RUBY_T_ZOMBIE`あたりが謎用途
- 即値
**include/ruby/internal/special_consts.h**

```
ruby_special_consts {
  ...
    RUBY_Qfalse         = 0x00, /* ...0000 0000 */
    RUBY_Qtrue          = 0x14, /* ...0001 0100 */
    RUBY_Qnil           = 0x08, /* ...0000 1000 */
    RUBY_Qundef         = 0x34, /* ...0011 0100 */
    RUBY_IMMEDIATE_MASK = 0x07, /* ...0000 0111 */
    RUBY_FIXNUM_FLAG    = 0x01, /* ...xxxx xxx1 */
    RUBY_FLONUM_MASK    = 0x03, /* ...0000 0011 */
    RUBY_FLONUM_FLAG    = 0x02, /* ...xxxx xx10 */
    RUBY_SYMBOL_FLAG    = 0x0c, /* ...xxxx 1100 */
```

- ポインタ値は8の倍数だから、下位3ビットは必ず`000`になる。逆に、下位3ビットが`000`ではないなら、それはポインタではなく即値
- `0x08`というポインタはありえないからnilに割り当ていている
- `0x00`はポインタとしては小さすぎるから、falseに割り当てられている
  - システム側でポインタ0や8は禁止されているみたい
- `VALUE`のサイズは8バイト=64ビット
  - `Fixnum`は下位1ビットがフラグだから、残る63ビットで数値を表現できる
  - `Flonum`は下位2ビットがフラグだから、残る62ビットで数値を表現できる
  - ネットワークのIPの割り振りのクラスA,B,Cとビットの利用が似てる
- MRI上での型は`TYPE(obj)`で得れて、`T_FIXNUM`とかと比較する
  - [ruby/extension.ja.rdoc at master · ruby/ruby](https://github.com/ruby/ruby/blob/master/doc/extension.ja.rdoc#label-E3-83-87-E3-83-BC-E3-82-BF-E3-82-BF-E3-82-A4-E3-83-97)
- `RClass`
  - モジュールもクラスも同じ構造体を使っている
**internal/class.h**

```
struct rb_classext_struct {
    struct st_table *iv_index_tbl; // ID -> struct rb_iv_index_tbl_entry
    struct st_table *iv_tbl;
#if SIZEOF_SERIAL_T == SIZEOF_VALUE /* otherwise m_tbl is in struct RClass */
    struct rb_id_table *m_tbl;
#endif
    struct rb_id_table *const_tbl;
    struct rb_id_table *callable_m_tbl;
    struct rb_id_table *cc_tbl; /* ID -> [[ci, cc1], cc2, ...] */
    struct rb_subclass_entry *subclasses;
    struct rb_subclass_entry **parent_subclasses;
    /**
     * In the case that this is an `ICLASS`, `module_subclasses` points to the link
     * in the module's `subclasses` list that indicates that the klass has been
     * included. Hopefully that makes sense.
     */
    struct rb_subclass_entry **module_subclasses;
#if SIZEOF_SERIAL_T != SIZEOF_VALUE /* otherwise class_serial is in struct RClass */
    rb_serial_t class_serial;
#endif
    const VALUE origin_;
    const VALUE refined_class;
    rb_alloc_func_t allocator;
    const VALUE includer;
};

struct RClass {
    struct RBasic basic;
    VALUE super;
    struct rb_classext_struct *ptr;
#if SIZEOF_SERIAL_T == SIZEOF_VALUE
    /* Class serial is as wide as VALUE.  Place it here. */
    rb_serial_t class_serial;
#else
    /* Class serial does not fit into struct RClass. Place m_tbl instead. */
    struct rb_id_table *m_tbl;
#endif
};
```

- 詳しくはRubyのウラガワの連載を参照
- `RString`
**include/ruby/internal/core/rstring.h**

```
struct RString {
    struct RBasic basic;
    union {
        struct {
            long len;
            char *ptr;
            union {
                long capa;
                VALUE shared;
            } aux;
        } heap;
        char ary[RSTRING_EMBED_LEN_MAX + 1];
    } as;
};
```

- 詳しくはRubyのウラガワの連載を参照
- `RArray`
**include/ruby/internal/core/rarray.h**

```
struct RArray {
    struct RBasic basic;
    union {
        struct {
            long len;
            union {
                long capa;
                ...
                VALUE shared_root;
            } aux;
            const VALUE *ptr;
        } heap;
        const VALUE ary[RARRAY_EMBED_LEN_MAX];
    } as;
};
```

- 詳しくはRubyのウラガワの連載を参照
- `RHash`
**internal/hash.h**

```
struct RHash {
    struct RBasic basic;
    union {
        st_table *st;
        struct ar_table_struct *ar; /* possibly 0 */
    } as;
    const VALUE ifnone;
    union {
        ar_hint_t ary[RHASH_AR_TABLE_MAX_SIZE];
        VALUE word;
    } ar_hint;
};
```

- 詳しくはRubyのウラガワの連載を参照
- `RTypedData`
  - なんのデータだろう
    - `RData`というものもあるけれどこっちも不明
  - 作成時に、GC用にdmark, dfree関数などを要求している
**include/ruby/internal/core/rtypeddata.h**

```
struct rb_data_type_struct {
    const char *wrap_struct_name;
    struct {
        RUBY_DATA_FUNC dmark;
        RUBY_DATA_FUNC dfree;
        size_t (*dsize)(const void *);
        RUBY_DATA_FUNC dcompact;
        void *reserved[1]; /* For future extension.
                              This array *must* be filled with ZERO. */
    } function;
    const rb_data_type_t *parent;
    void *data;        /* This area can be used for any purpose
                          by a programmer who define the type. */
    VALUE flags;       /* RUBY_FL_WB_PROTECTED */
};

struct RTypedData {
    struct RBasic basic;
    const rb_data_type_t *type;
    VALUE typed_flag; /* 1 or not */
    void *data;
};

```

- `RData`
  - `RTypedData`との使い分けがあるのか、歴史的経緯で残っているのか...
**internal/core/rdata.h**

```
struct RData {
    struct RBasic basic;
    RUBY_DATA_FUNC dmark;
    RUBY_DATA_FUNC dfree;
    void *data;
};

```
