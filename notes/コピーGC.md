---
tags: "GC"
---

# コピーGC

- [compiler resume "Garbage Collection"](https://www.is.s.u-tokyo.ac.jp/vu/99/jugyo/processor/process/soft/compilerresume/gc/gc.html)
  - >ヒープを2等分して、 片方が埋まったところでGCを起動する
  - >コピー元のヒープを**fromspace**、コピー先のヒープを**tospace**と呼ぶ
- Cheney方式GC
  - mrsekut-p/Copying GC
    - >再帰的ではなく、反復的にコピーを行う
    - >COPIEDタグを使わずに、コピー済みかどうかを判断する
