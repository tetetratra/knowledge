---
tags: "Gem"
---

# Bundler

- 環境ごとにインストールするgemを分けれる
- [Bundlerでgemを実用的に扱うためのまとめ - Qiita](https://qiita.com/iguchi1124/items/3c17e1275b9bee4138d7)
  - `group :development do ~ end`
- `Bundler.require`で一括requireできる
  - setupというメソッドもあるけど違いは知らない
- `gem "gemname", github: "piyo/nyan"`のようにgithubを指定すると、`https://rubygems.org/`ではなく`https://github.com/`から落としてくるようになる。このとき、`Gemfile.lock`では`remote: https://github.com/`のようにhttpsが使われる。ここをgitプロトコルにしたいときは...?
  - [GemfileのgithubショートハンドでGemfile.lockのプロトコルが強制的にgitになる問題 - Qiita](https://qiita.com/toyoken/items/d5d1b52eed83571903dc)
  - `bundle config github.https true`
- `BUNDLED WITH`が更新されてしまう問題
  - [BUNDLED WITH で Gemfile.lock が更新されてしまう件 - Qiita](https://qiita.com/suu_g/items/2b1630b8015d51c5292e)
- `bundle update xxx`
  - 更新があればそのgemとその依存関係だけが更新される。Gemfile.lockも更新。
- 指定したgemのみ更新したいときには`bundle update --conservative xxx`とする
  - 10nin/bundle updateで特定のgemのみ更新する時に気をつけるべきポイント
  - [bundler-source-hack/README.md at master · chrismo/bundler-source-hack](https://github.com/chrismo/bundler-source-hack/blob/master/README.md#why-then-does-the-hack-sometimes-not-work)
  - [特定のgem1つだけupdateしたいとき - development log](https://makotottn.hatenablog.com/entry/2017/09/20/013404)
  - [Bundler: bundle update](https://bundler.io/man/bundle-update.1.html#OPTIONS)
    - >Use bundle install conservative update behavior and do not allow indirect dependencies to be updated.
  - `--conservative`をつけないと、依存関係を持ったgemも含めて更新するため
    - `xxx`が`yyy`に依存し、`yyy`が`zzz`に依存していて、`xxx`をupdateしても`yyy`はupdateされない状況のとき
      - `--conservative`無しだと、`yyy`のロックが（`xxx`同様に）外れるので、`zzz`のバージョンアップが起こりうる
      - `--conservative`を付けると、`yyy`のロックは外れないので`zzz`のバージョンアップは起きない
- グループ分け
**main.rb**

```
group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

```

- `Gemfile.lock`の解説
  - [ruby - Understanding the Gemfile.lock file - Stack Overflow](https://stackoverflow.com/questions/7517524/understanding-the-gemfile-lock-file#comment78362992_44980854)
  - `GEM`
    - `specs:`
      - >a list of dependencies, with their version number, and the constraints on any subdependencies
  - `PATH`
    - `remote:`
      - 場所
    - `specs:`
      - Gemの名前
  - `DEPENDENCIES`
    - >A list of the dependencies which are specified in the Gemfile, along with the version constraint specified there.
    - Gemfileに書いた、必要なGemが並んでいる
