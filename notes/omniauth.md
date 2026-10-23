---
tags: "認証, OAuth, gem, Ruby_on_Rails, devise, omniauth"
---

# omniauth

- [List of Strategies · omniauth/omniauth Wiki](https://github.com/omniauth/omniauth/wiki/List-of-Strategies#developer-strategies)
  - omniauthのページ
  - 色々な認証の方法が列挙されている
    - `omniauth-saml`, `omniauth-http-basic`, `omniauth-openid`のような、認証方法ごとのgemが載っている
- [OmniAuth: Overview · heartcombo/devise Wiki](https://github.com/heartcombo/devise/wiki/OmniAuth:-Overview)
  - Railsでdeviseと共にomniauthを使う方法が書いてある
  - usersテーブルには、どこから認証されたかを格納する`provider`カラムと、そのプロバイダにおけるIDの`uid`カラムを作る
  - email や name はプロバイダのものを引き継ぎ、パスワードは適当なものを入れる
```rb
def self.from_omniauth(auth)
  find_or_create_by(provider: auth.provider, uid: auth.uid) do |user|
    user.email = auth.info.email
    user.password = Devise.friendly_token[0, 20]
    user.name = auth.info.name   # assuming the user model has a name
    user.image = auth.info.image # assuming the user model has an image
    # If you are using confirmable and the provider(s) you use validate emails, 
    # uncomment the line below to skip the confirmation emails.
    # user.skip_confirmation!
  end
end

```

- デフォルトのコールバックURLは `/auth/twitter/callback`
  - [OmniAuthで認証やコールバックのURLを変える方法 - ぶろぐ。@はてな](https://tkawa.hatenadiary.org/entry/20111014/p1)
    - >Rails + OmniAuthで例えばTwitter認証をするとき、デフォルトで認証時のURLは `/auth/twitter` で、コールバックURLは `/auth/twitter/callback` になる。
