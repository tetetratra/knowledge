---
tags: "Ruby_on_Rails_test, Rspec, Gem, API, テスト"
---

# VCR

- 「正しく外部APIを叩いているか」を簡単にテストできるようにしてくれるgem
- [vcr/vcr: Record your test suite's HTTP interactions and replay them during future test runs for fast, deterministic, accurate tests.](https://github.com/vcr/vcr)
- [VCR documentation](https://benoittgt.github.io/vcr/#/)
  - リクエスト**body**を検証するときはオプション引数で指定する必要がある
    - `match_requests_on: %i[method uri body]`
    - デフォルトだとmethodとuriしかチェックしてくれない
