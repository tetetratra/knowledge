---
tags: "AI, Claude Code, MCP, Playwright, Notion, Datadog, Slack, CircleCI, OAuth, JSON"
---

# MCP

- http方式（外部のサーバー宛に投げるもの）と、常駐プロセス方式（内部で立ち上げたサーバー宛に投げるもの）がある
  - playwrightとかは必然的に後者
  - notionとか、SaaSのようなものは前者のものもある
- 設定例
**.mcp.json**

```
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@0.0.74"]
    },
    "notion": {
      "type": "http",
      "url": "https://mcp.notion.com/mcp"
    },
    "datadog": {
      "type": "http",
      "url": "https://mcp.datadoghq.com/api/unstable/mcp-server/mcp"
    },
    "slack": {
      "type": "http",
      "url": "https://mcp.slack.com/mcp",
      "oauth": {
        "clientId": "your-slack-client-id",
        "callbackPort": 3118
      }
    },
    "circleci-mcp-server": {
      "command": "npx",
      "args": ["-y", "@circleci/mcp-server-circleci@0.15.1"],
      "env": {
        "CIRCLECI_TOKEN": "${CIRCLECI_TOKEN:-}"
      }
    }
  }
}

```

- ↑他に、sentry (エラー監視), databricks (データ閲覧), AWS あたりがあると便利そう?
- AWSとかはCLIを直接実行してもらうのと差があるのかないのか不明。
