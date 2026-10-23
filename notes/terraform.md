---
tags: "terraform_remote_state, tips"
---

# terraform

- terraformのドキュメント
  - https://developer.hashicorp.com/terraform/docs
- AWS Providerのドキュメント
  - https://registry.terraform.io/providers/hashicorp/aws/latest/docs
- HCLの文法
  - https://developer.hashicorp.com/terraform/language
- [シンプルでセキュアなRails on ECSのTerraformによる実装 - Qiita](https://qiita.com/reireias/items/df7905a1a25e6c11785e)
- Provider
  - プラグイン的なもの
  - Goで実装されている
  - クラウドサービス用のProviderを指定する
- State
  - stateファイル
  - 状態を保存しているファイル
  - terraform cloud側に保存されている
- Terraform Cloud
  - Plan/Applyの実行環境
  - (上述の)Stateの管理
  - Terraform Cloudを利用しなくてもTerraformは利用できるけれど、使えばTerraformを使うに当たって必要な機能をTerraform Cloud側が用意してくれて便利
- `terraform plan`
  - > 現在のコードをapplyすると、どんな変更が発生するか？ を表示するコマンド
- `terraform apply`
- 関数一覧
  - [Functions - Configuration Language | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/language/functions)
- 型
  - [【忘備】Terraform基本構文 ～変数とデータ型～ - Qiita](https://qiita.com/Yu-s/items/077245311e7b409d337f#%E3%83%87%E3%83%BC%E3%82%BF%E5%9E%8B)
  - プリミティブ型
    - string : Unicode文字列
    - number : 数値。整数と少数の両方を表現
    - bool : true/falseの２つ
  - 構造体型
    - object : キーバリュー型データ
    - tuple : 各列の方が決まっている配列
  - コレクション型
    - list : 特定の方で構成される配列
    - map : キーが文字列の配列
    - set : 値の重複がない配列
- `count`パラメータ
  - countに指定した個数だけ作られる
  - `hoge.fuga[0]`のようになる
- terraformのmoduleには`Gemfile`のようなものはあるが、`Gemfile.lock`のようなものは無い
  - あるモジュールに対して`version = "~> 2.1"`と書いたとき、`2.x`の範囲であればterraformが**自動で勝手に**バージョンを上げてくれる
- terraform_remote_state
  - [Terraformのremote_stateについておさらい](https://zenn.dev/nameless_gyoza/articles/terraform-remote-state)
  - とは
    - > あるリソースのoutputを別のリソースから参照できる（しかもリモートに格納されてる最新のやつを）
  - 用途
    - > TerraformのリソースはAとBとして別々に管理されているけれど、何らかの理由で「BからAのxxを参照したい」といったケース
  - 使い方
    - 値を渡す側
      - `output`で渡したい値を明示的に渡す
    - 値を使う側
      - `data "terraform_remote_state" "リソース名" { ... }`のように定義して、`data.terraform_remote_state.(リソース名.outputs.(変数名)`のように参照できる
  - 注意
    - `terraform_remote_state`dataリソースは、terraform側で**特別に名前に意味が与えられているdateリソース**で、定義するだけでterraformエンジン側で外部のリソースを読み込んでくれてそれを利用できるようになる
- resource と data の違い
  - resource
    - インフラを作る（または管理する）仕組み
  - data
    - データソース (Data Source)
    - 既存のインフラや外部情報を**読み取る**ための仕組み
    - たとえば下記コードは、`name`と`organization`のプロパティしか明示的には定義されていないが、プロバイダー側が定義してくれるおかげで`tfe_workspace.dev.name, tfe_workspace.dev.organization` 以外のプロパティも参照できるようになる
```tf
data "tfe_workspace" "dev" {
  name         = "my-dev-workspace"
  organization = "my-org"
}

# tfe_workspace.dev.full_names
```

- **ある意味関数呼び出し**のような感じで使える
- [tfe_workspace_ids | Data Sources | hashicorp/tfe | Terraform | Terraform Registry](https://registry.terraform.io/providers/hashicorp/tfe/latest/docs/data-sources/workspace_ids#argument-reference) にも、**Argument Reference, Attributes Reference** のように、ある意味引数と戻り値のような雰囲気で説明されている
- https://developer.hashicorp.com/terraform/language/attr-as-blocks
  - これらは同じ表現
```terraform
# Not recommended, but valid: a constant list-of-objects expression
example = [
  {
    foo = "bar"
  },
  {
    foo = "baz"
  },
]
```

```terraform
example {
  foo = "bar"
}
example {
  foo = "baz"
}
```

- 2個目だと `example` の型が見た目からじゃ判断つかないけれど、2個目の例の方が作法には則っているらしい
- 2個目の書き方だと、オプション引数のデフォルト値が割り当てられないらしい？？？(よくわからず)
- ↑ `terraform console` で `> type(hoge.fuga)` のようにやれば実際の型がわかるから、大半のケースではこれで済むはず
- `action[*].forward` のような記法は、プログラミング言語でいうところの `action.map(x => x.forward)` のようなもの
  - `[*].forward` でひとセットな感じ
- terraformは、**直下**のディレクトリにあるtfファイルのみを対象として動く
  - なので、子ディレクトリ内にtfファイルを置いても参照してくれない (= リソース作成されない)
  - 子ディレクトリという概念が現れるのは、モジュール機能とかを活用したりとか、なにか応用的なことをするとき
- [Terraform で変数を使う  - Qiita](https://qiita.com/ringo/items/3af1735cd833fb80da75)
  - 手順
    - variable ブロックで、渡したいterraform input変数 (`xxx`) を定義する
    - terraform plan時の環境変数で `TF_VAR_xxx=VALUE` を定義しておくと、variable ブロックで定義したterraform input変数に、その値が入る
      - terraform側でそういう仕組みを提供している
    - terraform側では `var.xxx # => VALUE` のように参照できるようになる
- resourceを書き換えたとき、changeされるかadd&destroyされるか
  - >リソースのIDや名前など、クラウド側でリソースを一意に識別する属性を変更すると、通常は再作成になります
    - リソースのIDや名前：`id`フィールドなどのこと
    - `tags = { Name = ... }` は単なるタグ（メタデータ）なので、これはリソースのIDや名前**ではない**ので注意
  - >各属性の ForceNew フラグ
    - > Terraformプロバイダーの各リソース属性には ForceNew というフラグが設定されている場合があります
    - >このフラグが true の属性を変更すると、リソースが再作成されます
