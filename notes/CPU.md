---
tags: "linux, docker, docker-compose, AMD, ARM, Intel Core i7, Apple M1"
---

# CPU

- 関連タグ
  - AMDとかARMとか
    - [「x86-64」「x64」「AMD64」これらは何が違うのか？ | 己で解決！泣かぬなら己で鳴こうホトトギス](https://onoredekaiketsu.com/x86-64-x64-amd64-what-is-the-difference-between-these/)
    - >「x86-64」も「x64」も「AMD64」も「Intel 64」も事実上同じ。
    - AMDかARMかの違いくらい
    - たとえば
      - Intel MacのCPUはIntel Core i7で、これはx86_64(つまりAMD)系アーキテクチャ互換のCPU
      - M1 MacのCPUはApple M1で、これはARM系アーキテクチャ
        - [Apple M1 - Wikipedia](https://ja.wikipedia.org/wiki/Apple_M1)
        - >AppleがMac及びiPad向けにARMアーキテクチャのライセンスを受けて設計したシステムオンチップ（SoC）である
  - 命令セットが言語で、その実装がマイクロアーキテクチャ
    - [命令セット - Wikipedia](https://ja.wikipedia.org/wiki/%E5%91%BD%E4%BB%A4%E3%82%BB%E3%83%83%E3%83%88)
      - >ISAに対してプロセッサ実装をおこなうことで、単一のISAに対して書かれたプログラムが様々なプロセッサで動作する。
    - 分岐予測とかスーパースカラーとかの用語はマイクロアーキテクチャの話
  - x86は可変長で、ARMやRISC-Vは固定長
  - 用語の整理
    - チップ名
      - Intel Core i9
      - Apple M1
    - アーキテクチャ
      - x86_64 = AMD64 = Intel 64
      - ARM
      - RISC-V
    - 命令セット
      - x86-64
      - ARM64 (AArch64)
      - RISC-V
    - マイクロアーキテクチャ
      - Zen
      - Skylake
      - Firestorm
      - Icestorm
    - CPUを作っている会社
      - AMD
      - Apple
      - ARM
**具体例**

| チップ(CPU)名 | Apple M1 | Apple A16 | Core i9 Skylake-X | Ryzen 7 | Graviton |
| --- | --- | --- | --- | --- | --- |
| 設計会社 | Apple | Apple | Intel | AMD | AWS |
| マイクロアーキテクチャ | Firestorm, Icestorm | Everest, Sawtooth | Skylake | Zen | AWS独自のなにか |
| 命令セット（ISA） | ARM64 (= AArch64) | ARM64 (= AArch64) | AMD64(= x86-64) | AMD64(= x86-64) | ARM |
| 工場 | TSMC | TSMC | Intel | AMD |  |

- [RISC-Vが面白くなってきたぞ](https://zenn.dev/tetsu_koba/articles/e176172371bf6a)
  - >RISC-V（リスク ファイブ）とはオープンソースライセンスで提供されている命令セットアーキテクチャ (ISA)です。
