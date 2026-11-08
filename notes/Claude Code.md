---
tags: "Claude Code, AI, AIエージェント, MCP"
---

# Claude Code

- 非対話実行（`claude -p`）での承認の仕組み
  - 承認が必要な操作は、誰も承認しなければ拒否される。承認する役は外部に任せられる
  - CLIの場合：`--permission-prompt-tool` にMCPツールを指定する
    - そのMCPサーバーは `--mcp-config` に書いておけば、claudeが実行ごとにstdioで起動するので、常駐させる必要はない
    - ツールにはツール名と入力が届き、`{"behavior":"allow", ...}` か `{"behavior":"deny", ...}` を返す。返事を待たせている間、claudeは止まって待つ
    - そのため、承認を人間に中継したい場合（チャットや音声で聞くなど）は、問い合わせを本体へ転送して返事を待つだけの薄いMCPサーバーを挟む構成になる
  - Agent SDKの場合：`canUseTool` コールバックで同じことが同じプロセス内でできるため、中継役のMCPサーバーは要らない
  - 自動で許可されたツールや、拒否ルールに当たったツールでは、どちらの方式も呼ばれない
- セッションの置き場所
  - 会話は `~/.claude/projects/<作業ディレクトリのパスを変換した名前>/<session-id>.jsonl` に保存される
  - `-p` の結果JSONに入る `session_id` を `--resume` に渡すと、非対話のままでも、あとから対話で開いても、同じ文脈で続けられる
  - JSONLの形式は内部向けで、リリースごとに変わりうるので、スクリプトから直接読まない方がよい
  - クラウド（claude.ai/code）のセッションはローカルのJSONLにない
    - `--resume` の一覧には出ず、Agent SDK の `listSessions` もローカルのディレクトリを読むだけ
    - 一覧や中身を取る公開APIはない。`--teleport` は対話用で、スクリプトからは使えない
    - 規約上、claude.ai の認証情報やセッショントークンを第三者のツールが集めたり仲介したりすることは禁止されている。CLIの内部APIを直接呼ぶ方法は避ける

出典
- [CLI reference](https://code.claude.com/docs/en/cli-reference)、[Headless](https://code.claude.com/docs/en/headless)
- [Agent SDK: Handle approvals and user input](https://code.claude.com/docs/en/agent-sdk/user-input)、[Agent SDK: Permissions](https://code.claude.com/docs/en/agent-sdk/permissions)
- [Sessions](https://code.claude.com/docs/en/sessions)
- [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)、[Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance)
