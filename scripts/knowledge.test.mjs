import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTitle, splitMatches } from '../site/knowledge.js';
const pages=[
  {id:'exact',title:'Ruby',tags:[],connections:1,updatedAt:1,searchRank:9},
  {id:'long',title:'Rubyの長いメモ',tags:[],connections:5,updatedAt:2,searchRank:8},
  {id:'body',title:'言語',tags:[],connections:20,updatedAt:3,searchRank:0},
  {id:'tag',title:'オブジェクト',tags:['Ruby'],connections:2,updatedAt:9,searchRank:1},
  {id:'title',title:'最近のRuby',tags:[],connections:1,updatedAt:1,searchRank:2},
];
test('完全一致を独立表示し、タイトル・タグ・本文の順に優先する',()=>{
  const result=splitMatches(pages,pages,'ＲＵＢＹ','connections');
  assert.deepEqual(result.exact.map(p=>p.id),['exact']);
  assert.deepEqual(result.related.map(p=>p.id),['title','long','tag','body']);
  assert.deepEqual(splitMatches(pages,pages,'ruby','updated'),result);
});
test('同じ一致箇所では検索エンジンの関連度を保ち、つながり数に左右されない',()=>{
  const matched=[pages[1],pages[4],pages[2]];
  const result=splitMatches(pages,matched,'Ruby','connections');
  assert(result.related.findIndex(p=>p.id==='title')<result.related.findIndex(p=>p.id==='long'));
  assert.equal(result.related.at(-1).id,'body');
});
test('タイトル・タグの部分一致を補い、重複を出さない',()=>{
  const result=splitMatches(pages,[pages[1]],'Rub','connections');
  assert(result.related.some(p=>p.id==='tag'));
  assert(result.related.some(p=>p.id==='exact'));
  assert.equal(result.related.filter(p=>p.id==='long').length,1);
  assert.equal(result.exact.length,0);
});
test('空欄の一覧は更新が新しい順に固定する',()=>{
  assert.equal(splitMatches(pages,[],'','connections').related[0].id,'tag');
  assert.equal(splitMatches(pages,[],'','updated').related[0].id,'tag');
  assert.equal(normalizeTitle(' Ｒｕｂｙ '),'ruby');
});
