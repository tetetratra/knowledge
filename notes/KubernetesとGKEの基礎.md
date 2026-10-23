---
tags: "Kubernetes, K8s, GKE, Pod, ReplicaSet, Deployment"
---

# KubernetesとGKEの基礎

- day2
- [コンテナ・K8s研修【MIXI 26新卒技術研修】#2 - Speaker Deck](https://speakerdeck.com/mixi_engineers/2026_new_grad_training_container_gke)
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
