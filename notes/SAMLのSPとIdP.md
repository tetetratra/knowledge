---
tags: "SAML, 認証, IDaaS, Okta"
---

# SAMLのSPとIdP

- SAML ログインには3者が登場する
  - SP（Service Provider）：ログインさせる側のサービス
  - IdP（Identity Provider）：ID とパスワードや多要素認証で本人を確かめる側
  - 利用者のブラウザ：SP と IdP は直接通信せず、ブラウザのリダイレクトとフォーム送信でメッセージを運ぶ
- ログインの流れ（SP の画面から始める場合）

```
 利用者のブラウザ              SP（サービス）            IdP（Entra ID など）
      |                            |                            |
      | (1) ログインしたい -------->|                            |
      |<-- (2) IdP へリダイレクト --|                            |
      |     URL のクエリに AuthnRequest（XML → Deflate → Base64）|
      |                                                         |
      | (3) リダイレクト先を開く ------------------------------->|
      |     （IdP の画面でパスワードや多要素認証）                |
      |<-- (4) 自動送信されるフォームを返す ----------------------|
      |     フォームの中身は SAMLResponse（署名付き XML → Base64）|
      |                            |                            |
      | (5) フォームを POST ------->|                            |
      |     SP は署名を確かめてログインさせる                     |
```

  - (2)〜(5) のメッセージは、どれも利用者のブラウザが運ぶ。SP と IdP は通信しない
  - SP が SAMLResponse を信用できるのは、IdP の署名を、事前にメタデータで受け取った IdP の証明書で確かめるから
- メッセージの運び方は向きで違う（[SAML 2.0 Bindings](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf)）
  - SP から IdP への認証の依頼（AuthnRequest）は、URL のクエリに載せてリダイレクトする（HTTP-Redirect バインディング）。URL の長さには制限があるので、XML を Deflate で圧縮してから Base64 にする
  - IdP から SP への署名付きの結果（SAMLResponse）は、自動で送信されるフォームから POST する（HTTP-POST バインディング）。本文は大きなデータを運べるので、Base64 にするだけで圧縮しない
- IdP の製品には2つの型がある
  - Google Workspace や Microsoft Entra ID は、メールやファイル共有に使う業務用のアカウントを、ほかのサービスへのログインにも使い回す
  - Okta はログインのためだけの製品（IDaaS）で、メールなどの機能はない。会社が社員1人に1つずつ Okta のアカウントを用意し、社員は Okta の画面から各サービスにシングルサインオンで入る
    - アカウントは、Active Directory や人事システムの社員情報を取り込み、入社や退職に合わせて作成や停止をする使い方がある（[HR-Driven IT Provisioning | Okta](https://www.okta.com/solutions/hr-driven-it-provisioning/)）
