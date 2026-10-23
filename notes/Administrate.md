---
tags: "gem, Ruby_on_Rails, Administrate, ActiveAdmin"
---

# Administrate

- https://administrate-demo.herokuapp.com/customizing_dashboards
  - 管理画面用のgem
  - 同じ用途のgemに ActiveAdmin がある
    - こっちはRails標準?
  - URLとファイルパスの対応について
    - 対応
      - `GET /admin/HOGEs`
        - ちゃんとroutes.rbに載っている
      - `app/dashboards/HOGE_dashboard.rb`
      - `app/controllers/admin/HOGEs_controller.rb`
        - コントローラーは複数形(`HOGEs`)
    - URLとコントローラーの`/admin`は、administrateのキーワード的な扱い
  - アクションに対応する`dashboard`と`view`が両方あったとき、viewの方が優先される?
  - 画面→URL→Controller→Dashboard or View の順で調査すると良さそう
