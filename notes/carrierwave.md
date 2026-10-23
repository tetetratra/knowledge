---
tags: "Gem, Ruby_on_Rails"
---

# carrierwave

- [carrierwave で新しいリサイズのバージョンを既存の画像ファイルに適用させる(Rails) - Qiita](https://qiita.com/hirotakasasaki/items/91d017c43e0f7493d48a)
  - 普通のアイコンに加えてサムネイル用の縮小したアイコンも保存、のような使い方ができる
  - アップローダーの中で定義する
    - `mount_uploader :icon, IconUploader` のように
  - `version :thumbnail do`のようにしたら、`user.icon.thumbnail`のようにアクセスできるようになる
