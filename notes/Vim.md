---
tags: "ctags, Neovim, Lua"
---

# Vim

- https://vim-jp.org/vimdoc-ja
  - クリップボード
    - `"*y`で、アスタリスクレジスタにヤンク出来て、これはクリップボードとつながっている。
  - `;`で正方向に繰り返し(`,`で負)
  - コマンドモード中で、`ctrl + r + "`で貼り付けが出来る
  - `@:`で直前のコマンド繰り返し
  - [Vim Surround inserts extra space around the word - Stack Overflow](https://stackoverflow.com/questions/9164405/vim-surround-inserts-extra-space-around-the-word)
    - `S(`だと空白ができてしまう`( space )`
    - `S)`は空白無し`(nospace)`
  - ctagsは昔に更新が止まっていて、universal-ctagsという新しいプロジェクトが今はある。のでそっちを使ったほうが良い
    - [universal-ctags/homebrew-universal-ctags: Homebrew Tap for Universal Ctags on OSX](https://github.com/universal-ctags/homebrew-universal-ctags)
      - `brew install --HEAD universal-ctags/universal-ctags/universal-ctags`
    - [universal-ctags で Vim からのコード参照を楽にする - Pon De Beach](https://mizukmb.hatenablog.com/entry/2016/05/04/082739)
    - `--help`でUniversal Ctagsって出ていれば大丈夫
  - [Big Sky :: Vim をモダンな IDE に変える LSP の設定](https://mattn.kaoriya.net/software/vim/20191231213507.htm)
  - LSPサーバーの不具合を調べたいときは
```vim
let lsp_log_verbose=1
let lsp_log_file = expand('~/lsp.log')
```

- rubyのlspサーバーは、rbenv global と .ruby-version のバージョンが食い違っているとexitedになるので注意
- [やっとNeovimの設定ファイルをinit.luaに移行した](https://zenn.dev/hisasann/articles/neovim-settings-to-lua)
- [Introduction - Commentary of Dotfiles](https://coralpink.github.io/commentary/index.html)
  - >このサイトでは、わたしが普段使っているWezTermとNeovimの設定例 (dotfiles) を紹介しています🤗
- [Vim Awesome](https://vimawesome.com/)
  - プラグインとその設定ファイルを物色できるサイト
- [nvim-lua-guide-ja/README.ja.md at master · willelz/nvim-lua-guide-ja · GitHub](https://github.com/willelz/nvim-lua-guide-ja/blob/master/README.ja.md)
  - >Neovimのファーストクラス言語としてのLuaはキラー機能の1つになりつつあります。 しかし、Luaでプラグインを書くための教材はVim script程多くありません。これは、Luaを始めるための基本的な情報を提供する試みです。
  - >vim変数で何かできるかを詳しく知りたい場合は、`:help lua-stdlib`と`:help lua-vim`が最適です。または、`:lua print(vim.inspect(vim))`を実行してすべてのモジュールのリストを取得できます。 API関数は、`:help api-global`にあります。
- xcodeでneovimを開けるプラグイン
  - https://github.com/mickael-menu/ShadowVim
  - firenvim的なツールだと思う
- [Tomita Masahiro / lsp_router · GitLab](https://gitlab.com/tmtms/lsp_router)
  - https://blog.tmtms.net/entry/202312-lsp_router
  - >じゃあ複数の LSP サーバーを束ねて一つの LSP サーバーのように振る舞うツールがどこかにあるんじゃないかな…と思って5分ほどググって探してみたけど見つからなかったので、自分で作ってみた。
- [rockerBOO/awesome-neovim: Collections of awesome neovim plugins.](https://github.com/rockerBOO/awesome-neovim)
- [NeovimでGitHub Copilot for Businessを有効活用しよう - LayerX エンジニアブログ](https://tech.layerx.co.jp/entry/2024/12/25/114758)
