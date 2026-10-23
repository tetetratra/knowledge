---
tags: "{i}\", システムコール, プロセス, ファイルシステム, Linux, FUSE, LXC, ACL, <File::Stat, define"
---

# Linux: コンテナとACL

| Linuxに限らずだけどソフトウェアを入れる時の用語について |  |
| [インストール - Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB) |  |
| >具体的なインストールの方法は以下の手順があるが、OSの種類や提供者の方針により方法が異なる。具体的には、 |  |
| >ソースコードをコンパイル、ビルド、メイクして組み込む。 |  |
| >OSのファイル管理システムを使い、他のマシンや媒体からハードディスクドライブ等に直接コピーする方法 |  |
| >インストーラと呼ばれるインストール専用のプログラムを前述の方法でコピーし実行する方法。 |  |
| >「ストア」などのアプリケーションから選択する方法。 |  |
| >目的のアプリケーションが入ったOSごとインストールする方法。 |  |
| > がある。 |  |
| [コンパイラ - Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%A9) |  |
| >コンピュータ・プログラミング言語の処理系（言語処理系）の一種で、高水準言語によるソースコードから、機械語あるいは元のプログラムよりも低い水準のコードに変換（コンパイル）するプログラムである。 |  |
| [リンケージエディタ - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%B3%E3%82%B1%E3%83%BC%E3%82%B8%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF) |  |
| 「リンカ」と言われているもの |  |
| >機械語のプログラムの断片を結合し実行可能なプログラムを作成するプログラムのことである。例として、C言語では、ソースファイルをコンパイルするとオブジェクトファイルが生成される。それに他のオブジェクトファイルやライブラリを結合して1つのプログラムが完成する。この結合（リンク）の際リンケージエディタが使われる。 |  |
| 静的リンク |  |
| >静的リンクは、リンク時に他のオブジェクトやライブラリをすべて1つのファイルに結合する方法。この方法では、出来上がったプログラムは、単独で動作することができる。 |  |
| 動的リンク |  |
| >動的リンクは、リンク時にライブラリの参照を名前のみで解決してプログラムを作る方法。出来上がったプログラムにはライブラリの部分のプログラムは含まれないのが特徴である。そのプログラム実行時に、ライブラリ空間上の実際のプログラムと結合し、実行する（この作業は通常ローダと呼ばれるプログラムが行う）。 |  |
| [make - Wikipedia](https://ja.wikipedia.org/wiki/Make) |  |
| 一応はスクリプト言語 |  |
| ビルド用のツール |  |
| 複雑に依存し合ったコンパイルとリンク作業、の自動化用 |  |
| [ビルド (ソフトウェア) - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%93%E3%83%AB%E3%83%89_(%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2)) |  |
| >プログラミング言語で書かれたソースコードファイルや各種リソースファイルを独立したソフトウェア生成物に変換するコンピュータ上で実行されるプロセス、またはその結果を指す。 |  |
| コンパイルとリンク作業を含めた、他にも必要な処理を自動で行うこと。 |  |
| [Rake (ソフトウェア) - Wikipedia](https://ja.wikipedia.org/wiki/Rake_(%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2)) |  |
| Rubyで書けるmakeのようなツール |  |
| Raisの`rake db:migrate`のアレ |  |
| [library rake (Ruby 2.7.0 リファレンスマニュアル)](https://docs.ruby-lang.org/ja/2.7.0/library/rake.html) |  |
| [Linux基礎(パッケージ管理について) - Qiita](https://qiita.com/kakkie/items/4c5e7670785d74d282b5) |  |
| C言語がどのようにシステムコールをラップしているか |  |
| [Man page of INTRO](https://linuxjm.osdn.jp/html/LDP_man-pages/man2/intro.2.html) |  |
| >システムコールは Linux カーネルへのエントリーポイントである。 |  |
| > 多くの場合、 C ライブラリのラッパー関数が行うのは以下のことだけである。 |  |
| > 引数と一意なシステムコール番号をカーネルが期待するレジスターにコピーする |  |
| > カーネルがシステムコールの実際の処理を行う時点でカーネルモードに入る |  |
| > カーネルが CPU をユーザーモードに返した際にシステムコールがエラー番号を返したいれば errno を設定する |  |
| FUSE |  |
| file system in user space |  |
| linux containers (LXC)からdockerに |  |
| [LXCで学ぶコンテナ入門 －軽量仮想化環境を実現する技術 記事一覧 \| gihyo.jp](https://gihyo.jp/list/group/LXC%E3%81%A7%E5%AD%A6%E3%81%B6%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E5%85%A5%E9%96%80-%E8%BB%BD%E9%87%8F%E4%BB%AE%E6%83%B3%E5%8C%96%E7%92%B0%E5%A2%83%E3%82%92%E5%AE%9F%E7%8F%BE%E3%81%99%E3%82%8B%E6%8A%80%E8%A1%93) |  |
| Docker for MacはVMの上のDockerなので遅い |  |
| ACL |  |
| access control list |  |
| `chmod 755`の制限とは別の制限を加えられる |  |
| `ls -le`で見れる |  |
| code:ls -le |  |
| drwx------+  726 username  staff  23232 12 26 11:44 .Trash/ |  |
| 0: group:everyone deny delete |  |
| [アクセス制御リスト - Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E5%88%B6%E5%BE%A1%E3%83%AA%E3%82%B9%E3%83%88) |  |
| [macOSでACL - 日々適当](https://blog.goo.ne.jp/m4g/e/866ad1f5a775c12548ca7d17f05f3561) |  |
| [macOS でよく見かける拡張属性や ACL - Qiita](https://qiita.com/reo/items/d68b41c807770b6ebb10) |  |
| fileのstatで得られる数字の、パーミッション以外の部分について |  |
| ファイルの種類が載っている |  |
| code:rb |  |
| ❯ ruby -e 'pp File.stat(".gitignore")' |  |
|  |  |
| dev=0x100000d, |  |
| ino=1012020, |  |
| mode=0100644 (file rw-r--r--), |  |
| nlink=1, |  |
| uid=502 (ユーザー), |  |
| gid=20 (staff), |  |
| rdev=0x0 (0, 0), |  |
| size=16, |  |
| blksize=4096, |  |
| blocks=8, |  |
| atime=2022-11-21 11:35:03.038070046 +0900 (1668998103), |  |
| mtime=2022-11-21 11:35:02.711715152 +0900 (1668998102), |  |
| ctime=2022-11-21 11:35:02.711715152 +0900 (1668998102)> |  |
| code:man 2 stat |  |
| `#define S_IFMT 0170000           /* type of file */` |  |
| `#define S_IFIFO  0010000  /* named pipe (fifo) */` |  |
| `#define S_IFCHR  0020000  /* character special */` |  |
| `#define S_IFDIR  0040000  /* directory */` |  |
| `#define S_IFBLK  0060000  /* block special */` |  |
| `#define S_IFREG  0100000  /* regular */` |  |
| `#define S_IFLNK  0120000  /* symbolic link */` |  |
| `#define S_IFSOCK 0140000  /* socket */` |  |
| `#define S_IFWHT  0160000  /* whiteout */` |  |
| [システムの負荷の原因を切り分ける方法 - Qiita](https://qiita.com/k0kubun/items/8ab1dfa7c0359d8e618d) |  |
| LVMスナップショットによるバックアップと別ホストへのリストア |  |
| https://rooter.jp/infra-ops/lvm-snapshot-backup-restore-to-another-host/ |  |
