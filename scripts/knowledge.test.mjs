import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTitle, splitMatches } from '../site/knowledge.js';
const pages=[
  {id:'exact',title:'Ruby',connections:1,updatedAt:1},
  {id:'long',title:'Rubyの長いメモ',connections:5,updatedAt:2},
  {id:'hub',title:'言語',connections:20,updatedAt:3},
  {id:'new',title:'最近のRuby',connections:2,updatedAt:9},
];
test('完全一致は独立表示し、関連から除いてつながり順・更新順で並べる',()=>{
  const connections=splitMatches(pages,pages,'ＲＵＢＹ','connections');
  assert.deepEqual(connections.exact.map(p=>p.id),['exact']);
  assert.deepEqual(connections.related.map(p=>p.id),['hub','long','new']);
  assert.deepEqual(splitMatches(pages,pages,'ruby','updated').related.map(p=>p.id),['new','hub','long']);
});
test('空欄では全件、部分一致だけでは完全一致セクションを表示しない',()=>{
  assert.equal(splitMatches(pages,pages,'','connections').exact.length,0);
  assert.equal(splitMatches(pages,pages,'Rub','connections').exact.length,0);
  assert.equal(splitMatches(pages,pages,'','connections').related.length,4);
  assert.equal(normalizeTitle(' Ｒｕｂｙ '),'ruby');
});
