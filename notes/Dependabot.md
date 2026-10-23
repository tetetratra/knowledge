---
tags: "gem, Github_Actions, bundler, ライブラリアップデート"
---

# Dependabot

- https://github.com/r7kamura/dependabot-bundler-conservative
  - >Dependabot が更新のプルリクエストを作成するとGemfile.lock、通常は直接依存関係と間接依存関係の両方が更新されます。これにより、変更が大きくなり、レビューが困難になる可能性があります。
  - > Gemfile.lock間接的な依存関係への変更が最小限に抑えられるように提案された diff を調整することで、結果として生じる変更が小さくなり、各プル リクエストのレビューと承認が容易になります。
- `bundle update --conservative` でbundle updateをしてくれるaciton
