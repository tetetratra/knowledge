---
tags: "メール, プロトコル, SendGrid"
---

# SMTP

- [SMTPサーバ（smtpd）とは - 意味をわかりやすく - IT用語辞典 e-Words](https://e-words.jp/w/SMTP%E3%82%B5%E3%83%BC%E3%83%90.html)
  - >SMTPサーバとは、SMTP（Simple Mail Transfer Protocol）と呼ばれる通信手順（プロトコル）で電子メール（eメール）を送信、転送するコンピュータのこと。メールソフトの設定画面などでは「送信サーバ」「メール送信サーバ」などと記載されていることもある。
- [How to Send an SMTP Email - ドキュメント | SendGrid](https://sendgrid.kke.co.jp/docs/API_Reference/SMTP_API/getting_started_smtp.html)
```telnet
> telnet smtp.sendgrid.net 587
220 SG ESMTP service ready at ismtpd0000xxxxxx.sendgrid.net
> EHLO kke.co.jp
250-smtp.sendgrid.net
250-8BITMIME
250-PIPELINING
250-SIZE 31457280
250-STARTTLS
250-AUTH PLAIN LOGIN
250 AUTH=PLAIN LOGIN
> AUTH LOGIN
334 VXNlcm5hbWU6 #「ユーザ名」
> YXBpa2V5       # 固定文字列「apikey」をBASE64エンコードした文字列を入力 
334 UGFzc3dvcmQ6 #「パスワード」
> ********       # APIキーをBASE64エンコードした文字列を入力
235 Authentication successful
> MAIL FROM: fromaddress@example.com
250 Sender address accepted
> RCPT TO: toaddress@example.com
250 Recipient address accepted
> DATA
354 Continue
> To: toaddress@example.com
> From: fromaddress@kke.co.jp
> Subject: test mail
>                              # 空行
> This is body of the message. # メール本文
> .                            # 最後にピリオド
250 Ok: queued as …
> QUIT
221 See you later
```

- ↑`VXNlcm5hbWU6`とかは、base64でエンコードされた`Username:`
- 220とかは多分独自のHTTPステータスコード
- SendGridは、SMTP方式によるメールサーバーを、サービスとして提供している
