---
tags: "Ruby, ObjectSpace, メモリ"
---

# rubyの1オブジェクトから辿れるオブジェクトを列挙

```rb
require 'objspace'
require 'set'

EXCLUDE_CLASSES = [
  ObjectSpace::InternalObjectWrapper,
  Module
]

def all_reachable_objects(
  obj,
  searchable_objects: Set.new,
  searched_objects: Set.new,
  cnt: 0 # デバッグ用
)
  reachable_objects = ObjectSpace.reachable_objects_from(obj)
                        .to_a # 空のときはnilが返るため
                        .reject { |o| EXCLUDE_CLASSES.any? { |c| o.is_a?(c) } }
                        .to_set
  new_searchable_objects = searchable_objects + (reachable_objects - searched_objects)

  # return if cnt == 3 # デバッグ用
  return searched_objects if new_searchable_objects.empty?

  next_obj = new_searchable_objects.first
  next_searchable_objects = new_searchable_objects - Set.new([next_obj])
  next_searched_objects = searched_objects + Set.new([obj])
  next_cnt = cnt + 1

  all_reachable_objects(
    next_obj,
    searchable_objects: next_searchable_objects,
    searched_objects: next_searched_objects,
    cnt: next_cnt
  )
end

alias ar all_reachable_objects

`(ar(hoge) - ar(fuga)).sum { ObjectSpace.memsize_of(it) }` のようにして、似たような2オブジェクト間の差分を取ることで、純粋にその1オブジェクトのオブジェクトサイズがわかる(はず)

```
