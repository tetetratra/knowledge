---
tags: "C言語, プログラミング言語, glibc, clib, bundler, npm, Clang"
---

# C

- [C言語リファレンス - cppreference.com](https://ja.cppreference.com/w/c)
  - wikipediaからリンクが張られていたサイト
- [C言語 外部ライブラリ？をincludeするまで](https://teratail.com/questions/213008)
  - C言語で外部ライブラリを取り込む一般的な方法について書かれていそう
- glibc公式
  - [The GNU C Library](https://www.gnu.org/software/libc/)
  - Get Started のページに、gblicを使う方法が書かれている
- clib
  - [clibs/clib:C package manager-ish](https://github.com/clibs/clib)
  - C言語のためのパッケージマネージャー
  - bundler, npmのようなもの
  - [Big Sky :: clib の使い勝手にマジ感動した](https://mattn.kaoriya.net/software/lang/c/20140627222830.htm)
  - clib以外にもパッケージマネージャは他にも色々あるらしい...?
- 指示付き初期化子
  - これのこと
  - (普通の変数のように)静的なメモリ確保のみできる文法っぽい? この記法で動的にメモリを確保するのは難しそう?
```c
*cfp = (const struct rb_control_frame_struct) {
    .pc         = pc,
    .sp         = sp,
    .iseq       = iseq,
    .self       = self,
    .ep         = sp - 1,
};

```

- Clangはクランと言うらしい
