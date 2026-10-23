---
tags: "本, 暗号, 認証, ブルートフォース攻撃, OAuth, 共通鍵暗号, AES, 確率的アルゴリズム, 公開鍵暗号, 離散対数問題, OpenSSL, 署名, FIDO, TLS, HTTP, HTTPS, SSL, DNS, UDP, SMTP, VPN, SPDY, QUIC, 準同型暗号, ゼロ知識証明"
---

# TLS

## 暗号と認証のしくみと理論がこれ1冊でしっかりわかる教科書

- [図解即戦力 暗号と認証のしくみと理論がこれ1冊でしっかりわかる教科書：書籍案内｜技術評論社](https://gihyo.jp/book/2021/978-4-297-12307-9)

- **7章 TLS**
- **37 TLS**
  - 「TLS (Transport Layer Security)」
    - TLSによって暗号化されたHTTPがHTTPS
    - SSLがTLSに
    - 最新のTLSは1.3
- **38 認証付き暗号**
  - 「認証付き暗号AEAD (Authenticated Encryption with Associated Data)」
    - 暗号化（データの秘匿）と認証（データの正当性）を同時に満たす暗号方式
    - 共通鍵暗号 ＆ MAC
    - これは方法の名前
    - 実装には「AES-GCM」「AES-CCM」「ChaCha20-Ploy1305」などがある
  - TSL1.3ではAEADを使うことになっている
- **39 前方秘匿性**
  - 共通鍵暗号の秘密鍵が（通信途中に限らず）漏れると、それまで傍受はしていたが複合はできていなかった暗号化通信もすべて複合できる
    - 「前方秘匿性 FS (Forward Secrecy)」が無い
  - DH鍵共有で、毎回新しい鍵を生成することで、前方秘匿性を確保
