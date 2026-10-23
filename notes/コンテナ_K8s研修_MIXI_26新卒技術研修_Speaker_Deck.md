---
tags: "コンテナ, Docker, OCI, Kubernetes, K8s, GKE"
---

# コンテナ・K8s研修【MIXI 26新卒技術研修】 - Speaker Deck

- [コンテナ・K8s研修【MIXI 26新卒技術研修】 - Speaker Deck](https://speakerdeck.com/mixi_engineers/2026_new_grad_training_container)
- [コンテナ・K8s研修【MIXI 26新卒技術研修】 - Speaker Deck](https://speakerdeck.com/mixi_engineers/2026_new_grad_training_container_gke)
- day1
- ![図](../assets/476d6c758eb02081bc29e0677f67b5710224b04fbff53ef715e14b8086eec0a9.png)
  - OCI (Open Container Initiative)
  - コンテナ技術ではlinuxの namespace, cgroups 機能を使っている
    - macOSにはこれらの機能が無い
      - ので、Docker Desktopでは、Hypervisor Frameworkというものを利用して内部でLinuxを起動している
- day2
  - k8s
    - コンテナオーケストレーションツール
    - 使う理由
      - リソース管理を隠す
        - kube-schedulerを使ってコンテナを指定したノードに効率よく配置
      - 障害の自動復旧
      - 可用性（各種分散のしくみがあるため可用性が高い）
    - GKE (google kubernetes engine)
      - マネージドなk8s
      - 一部手動な箇所もある
- ![図](../assets/8658a2545a6b3f383686daffadc8deac34b5c42028444747c5915326968d5ecd.png)
- ![図](../assets/286bb1a3afa26500921d6e8d987947ba0a548e1d3cff11c6e2af2ba88f5d6591.png)
- ![図](../assets/d03ef63ec670657576783d10e77af5e65d3fbe6f183b01b29923e2a1ce9ab7f5.png)
