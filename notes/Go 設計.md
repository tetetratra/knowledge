---
tags: "Go, 設計"
---

# Go 設計

- Go言語のディレクトリ構成に関する資料
  - [Building API Server-side Architecture for beginners - Speaker Deck](https://speakerdeck.com/hgsgtk/building-api-server-side-architecture-for-beginners)
    - 最初から完璧なDDDを導入すると混乱を生む
      - もともとはPHP出身のBEが多かった現場
    - フェーズ1：シンプルなModel-Controller
    - フェーズ2：Model-Controller + DIP
    - フェーズ3(ゴール)：レイヤードアーキテクチャ + DIP
      - UI層 → アプリケーション層 → ドメイン層 ← インフラ層
  - [Goのpackage構成と開発のベタープラクティス | リクルート テックブログ](https://techblog.recruit.co.jp/article-1070/?utm_source=chatgpt.com)
    - DDD & レイヤードアーキテクチャ
```text
.
├── application
│   └── usecase
│       ├── xxx_usecase.go
│       └── yyy_usecase.go
├── domain
│   ├── model
│   ├── repository
│   │   └── xxx_repository.go
│   └── service
├── infrastructure
│   └── persistence
│       └── datastore
│           └── xxx_repository.go
├── interfaces
│   └── api
│       └── server
│           ├── auth
│           ├── handler
│           │   ├── app_handler.go
│           │   ├── xxx_handler.go
│           │   └── yyy_handler.go
│           ├── httputils
│           ├── middleware
│           └── router
└── registry
    └── registry.go

```

- [Go のアーキテクチャどうしてる？ ギフティで実際に試した構成パターンを紹介します - giftee Tech Blog](https://tech.giftee.co.jp/entry/2025/12/02/115256?utm_source=chatgpt.com)
  - パターン1：DDD × レイヤードアーキテクチャ
```text
internal/
├── domain/           # ドメイン層
├── handler/          # プレゼンテーション層（API ハンドラ）
├── infrastructure/   # インフラストラクチャ層
└── usecase/          # アプリケーションサービス層
```

- パターン2：MVC × ORM
```text
internal/
├── handler/                      # プレゼンテーション層（API ハンドラ）
├── model/                        # ドメインモデル・データベースアクセス
└── service/                      # ユースケース層
```

- model部分
```text
model/
├── task.go
├── user.go
└── ...
```

- service部分
```text
service/
├── task.go
├── user.go
└── ...

```

- [GoのWebアプリ開発でフラットパッケージにした話 | フューチャー技術ブログ](https://future-architect.github.io/articles/20201109/)
  - フラットな構成
```text
<projectroot>           # projectrootパッケージ
├── cmd
│   ├── lambda          # lambda用のmainパッケージ
|   |   └── main.go
│   └── server          # ローカル起動用のmainパッケージ
|   |   └── main.go
├── gen                 # 自動生成ファイル(go-swaggerの生成物)
│   ├── models
│   └── restapi
├── docs                # ドキュメント(Markdown, draw.io, PlantUML, etc)
├── testdata            # 単体テスト用のデータ
|
├── error.go                 # 共通コード
├── db.go                    # 共通コード
├── log.go                   # 共通コード
├── article_handler.go       # article機能の制御コード
├── article_handler_test.go  # テストコード
├── article_model.go         # article機能のモデルコード
├── article_model_test.go    # テストコード
├── article_db.go            # article機能の永続化コード
├── author_handler.go        # article機能の制御コード
├── author_handler_test.go   # テストコード
├── author_model.go          # article機能のモデルコード
├── author_model_test.go     # テストコード
├── author_db.go             # article機能の永続化コード
├── (省略)
├── device_handler.go        # device機能の制御コード
├── device_handler_test.go   # テストコード
├── device_model.go          # device機能のモデルコード
├── device_model_test.go     # テストコード
└── device_db.go             # device機能の永続化コード

```

- [ぼくのレイヤードアーキテクチャ  - Qiita](https://qiita.com/kawamou/items/a215c6ca4b24cf5b69ed?utm_source=chatgpt.com)
  - レイヤードアーキテクチャ
```text
.
├── application
│   ├── create_user_service.go
│   ├── find_user_service.go
│   ├── notification_adapter.go
│   └── ping_service.go
├── domain
│   ├── user.go
│   └── user_repository.go
├── handler
│   ├── create_user_handler.go
│   ├── find_user_handler.go
│   ├── ping_handler.go
│   └── shared.go
├── infra
│   ├── firestore.go
│   ├── slack_local_notifier.go
│   └── user_repository_impl.go
├── main.go
└── router.go


```
