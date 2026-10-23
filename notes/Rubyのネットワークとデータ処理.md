---
tags: "Ruby, Net::HTTP, OpenURI, CSV"
---

# Rubyのネットワークとデータ処理

- ネットアクセス
  - open-uriライブラリで、`URI.open`が追加される
    - `URI`モジュールのメソッド
      - httpヘッダ指定できない?
    - `OpenURI.open_uri`が追加
  - `open-uri`系か、`Net::HTTP`系がある
 [RubyのHTTPリクエストをできるだけシンプルに実装する - Qiita https://qiita.com/takano-h/items/dd10818eb7e09161bc29]
 [class Net::HTTP (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/class/Net=3a=3aHTTP.html]
 [library open-uri (Ruby 2.7.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/library/open=2duri.html]

`CSV`の`headers: true`オプションで、eachとかの返り値のクラスが`CSV::Row`になる
 [class CSV::Row (Ruby 3.0.0 リファレンスマニュアル) https://docs.ruby-lang.org/ja/latest/class/CSV=3a=3aRow.html#I_HEADER--3F]
 そのままだとarray
 これは、`row[column_name]`でアクセスできる
 カラムが無いときも、CSV上で空文字のときも`nil`になってしまうので注意!
 カラムがあるか調べるには`CSV::Row#header?`

`Proc#>>` にはproc以外にも渡せる
 >Proc、Method、もしくは任意の call メソッドを持ったオブジェクト。

ハッシュで、キーが無かったら更新したいとき
 [ActiveSupportを読む: Hash#reverse_merge | TECHSCORE BLOG https://www.techscore.com/blog/2013/02/14/activesupport%E3%82%92%E8%AA%AD%E3%82%80-hashreverse_merge/]
 ActiveSupportの`reverse_merge`

structの活用
 るりまより
```ruby
Customer = Struct.new(:name, :address) do
    def greeting
      "Hello #{name}!"
    end
  end
Customer.new("Dave", "123 Main").greeting # => "Hello Dave!"
```
