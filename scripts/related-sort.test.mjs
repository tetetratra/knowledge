import test from 'node:test';
import assert from 'node:assert/strict';
import { sortRelated } from '../site/related.js';

test('関連記事は候補を変えず関連度順と更新順を切り替える',()=>{
  const pages=[{id:'close',score:.9,updatedAt:1},{id:'new',score:.2,updatedAt:9}];
  assert.equal(sortRelated(pages,'relevance')[0].id,'close');
  assert.equal(sortRelated(pages,'updated')[0].id,'new');
  assert.equal(pages[0].id,'close');
});
