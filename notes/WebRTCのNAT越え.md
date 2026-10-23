---
tags: "WebRTC, NAT, STUN, TURN"
---

# WebRTCのNAT越え

- [連載 | WebRTC入門2016 | HTML5Experts.jp](https://html5experts.jp/series/webrtc2016/)

- そして壁の向こうへ。
  - NAT越え
    - NATを越えてPeer-to-Peer通信を行うには、シグナリング処理でお互いに自分の知らないグローバルの情報（自身のグローバルIPアドレスや、グローバルUDPポート）を交換する必要がある
      - → STUNに問い合わせて知る
  - STUN (Session Traversal Utilities for NATs)
    - STUNサーバー：NATで変換されたIPアドレス/ポートを教えあげるサーバー（仕組みはシンプル）
      - Googleが公開してくれている (`stun.l.google.com:19302` など)
    - ![図](../assets/1093191704c7e6062b0f53f79b0faeba187ffafd70952c3496e0e223b6095caf.png)
  - TURN (Traversal Using Relays around NAT)
    - NAT超えができたところで、Peer-to-Peer通信に使う自身のポート自体が、自身のファイアウォールに塞がれている可能性がある（特に企業ネットワークなど）
    - TURNというしくみを使うことで、それを解決できる
      - TURNサーバーが、パケットをそのまま転送するしくみ
        - `80/TCP` ポートを使うように設定することで、ファイアウォールに阻まれずに済む
    - ![図](../assets/ee6988d1759be6d14d5addf7aedb361d202cf65a7a61eebcaef69cf5f2b0352e.png)
