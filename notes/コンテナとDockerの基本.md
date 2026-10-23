---
tags: "コンテナ, Docker, OCI"
---

# コンテナとDockerの基本

- day1
- [コンテナ・K8s研修【MIXI 26新卒技術研修】 - Speaker Deck](https://speakerdeck.com/mixi_engineers/2026_new_grad_training_container)
- OCI (Open Container Initiative)
- コンテナ技術ではlinuxの namespace, cgroups 機能を使っている
  - macOSにはこれらの機能が無い
  - ので、Docker Desktopでは、Hypervisor Frameworkというものを利用して内部でLinuxを起動している
- ![図](../assets/476d6c758eb02081bc29e0677f67b5710224b04fbff53ef715e14b8086eec0a9.png)
