---
tags: "GNU Privacy Guard, OpenPGP, 公開鍵暗号, gpg, 鍵束"
---

# gpg

- GNU Privacy Guard
  - https://ja.wikipedia.org/wiki/GNU_Privacy_Guard
    - >GNU Privacy Guard とは、Pretty Good Privacy の別実装として、GPL に基づいた暗号化ソフトである。
    - OpenPGPという規格の、GNUによる実装
  - どういうものか
    - 公開鍵・秘密鍵のペアを作る機能がある
    - sshと同じようなもの?
    - メールアドレスを入力するので、個人の証明になるのか？
    - 失効証明書というものも作ってくれる
      - 秘密鍵を失くしたときに公開するものらしい
    - 秘密鍵にパスフレーズを付ける機能もあるが、空でよさそう
  - 鍵束
    - 複数の公開鍵を入れておくファイルのこと
      - 他人の公開鍵も入っている
      - `.gnupg/pubring.kbx`
  - `gpg --list-keys`
    - 公開鍵一覧を表示
  - `gpg --list-secret-keys`
    - 秘密鍵一覧を表示?
  - githubで個人の証明(本当に本人のコミットであることを示す)をするためなどに使う
    - コミットに色がつく
  - `gpg --recipient name`
    - `--encrypt`コマンドのオプション(多分)
    - >Encrypt for user id name.
    - recipientは日本語で「受取人」
    - そもそもgpgが、ユーザーに対して
  - サブコマンドを指定しなかった場合は、オプションとかを見ていい感じにどのコマンドかを推測してくれる
    - > gpg may be run **with no commands**. In this case it will print a warning perform a reasonable action depending on the type of file it is given as input (an encrypted message is decrypted, a signature is verified, a file containing keys is listed, etc.).
  - コマンドも`--`で始まるから滅茶苦茶わかりにくい
    - `--encrypt`, `-e`
    - `--sign`, `-s`
    - `--decrypt`, `-d`
    - `--list-keys`
  - `--verbose`オプションがある
