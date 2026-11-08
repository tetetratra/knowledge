---
tags: "AI, AIエージェント, Claude Code, Agent Skills, セキュリティ"
---

# Agent Skills

- スキルは `<name>/SKILL.md` というディレクトリ単位で、frontmatterの `name` と `description` で識別される
  - リポジトリの `skills/<name>/SKILL.md` に置けば、`npx skills`（vercel-labs/skills）でそのまま配布・インストールできる
  - `name` がないスキルは見つからない扱いになり、インストールされない
- `npx skills` でグローバルに入れたときの配置
  - 実体は共通の置き場 `~/.agents/skills/<name>` に1つだけ置かれる
  - Claude Codeは `~/.claude/skills/<name>` からその実体へのシンボリックリンクで参照する。Codexは `~/.agents/skills` を直接読む
  - GitHubなどから入れたものは管理対象として記録され、更新できる。ローカルパスから入れたものはコピーなので、元を編集しても反映されない
  - Gemfileのように「使うスキル」を宣言して復元する仕組みはプロジェクト単位だけで、グローバル向けにはない。そのため、使うスキルの一覧を設定ファイルに書き、それに合わせてインストールし直すスクリプトを自分で用意することになる
- 本文を外部URLから取ってきてその指示に従うだけの「中継スキル」は、中身を事前に検証できないため、セキュリティ監査で高リスクと判定される。公開元のスキルを直接インストールする方がよい

出典
- [vercel-labs/skills](https://github.com/vercel-labs/skills)、[docs/commands.md](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)、[docs/creating-skills.md](https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md)
- [skills.sh audits](https://skills.sh/audits)
