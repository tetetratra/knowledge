---
tags: "GitHub, GitHub Actions, GitHub Apps, PAT"
---

# GitHub Appsトークン解体新書：GitHub ActionsからPATを駆逐する技術

- GitHub
- GitHub Actions
- GitHub Apps
- PAT
- https://zenn.dev/tmknom/articles/github-apps-token
- >GITHUB_TOKENで実行不可能な処理を自動化したいときです。このようなケースで使われるのがPATやGitHub Appsトークンです
- >**GitHub Appsトークン**
- > GitHub Appsトークンはその名のとおり、GitHub Appsを利用します。GitHub Appsには事前に秘密鍵を登録します。GitHub Appsではこの秘密鍵を使って、一時的に使用可能なトークンを払い出せます。Fine-grained PATと比較した場合、優位性は主に2つです。
- > GitHub Appsトークンは短命です。そのため万が一漏えいしても、影響は時限的です。「長命な秘密鍵」と「短命なトークン」という組み合わせは強力です。秘密鍵さえ守れば、インシデント発生時の被害はかなり小さくなります。これは長命なPATでは実現できない大きな魅力です。
- > 本番運用においては「秘密鍵を信頼できる相手にのみ渡す」ことがポイントになります。
