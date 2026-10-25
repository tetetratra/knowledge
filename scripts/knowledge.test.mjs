import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTitle, literalMatches, appendSemantic } from '../site/knowledge.js';
const pages=[
  {id:'exact',title:'Ruby',tags:[],updatedAt:1},
  {id:'title',title:'Rubyのメモ',tags:[],updatedAt:2},
  {id:'tag',title:'オブジェクト',tags:['Ruby'],updatedAt:9},
  {id:'body',title:'言語',tags:[],updatedAt:30},
  {id:'semantic',title:'動的型付け',tags:[],updatedAt:50},
];
test('完全一致・タイトル部分一致・タグ・本文の順を更新日時より優先する',()=>{
  const result=literalMatches(pages,{body:'Rubyについて書いた本文'},'ＲＵＢＹ');
  assert.deepEqual(result.exact.map(p=>p.id),['exact']);
  assert.deepEqual(result.related.map(p=>p.id),['title','tag','body']);
});
test('本文は単語区切りに依存せず部分一致し、複数語はAND検索する',()=>{
  assert.deepEqual(literalMatches(pages,{body:'例外をキャッチする方法'},'キャッチす').related.map(p=>p.id),['body']);
  assert.equal(literalMatches(pages,{body:'Rubyで例外をキャッチする'},'Ruby 例外').related[0].id,'body');
  assert.equal(literalMatches(pages,{body:'Rubyについて'},'Ruby 例外').related.length,0);
});
test('意味検索は文字一致の後へ追加し、スコアの高さで先頭を入れ替えない',()=>{
  const literal=literalMatches(pages,{body:'Ruby'},'Ruby');
  const extra=appendSemantic(pages,literal,[{id:'exact'},{id:'body'},{id:'semantic'},{id:'semantic'},{id:'missing'}]);
  assert.deepEqual(extra.map(p=>p.id),['semantic']);
});
test('空欄は更新順に固定し、全角半角と英字の大小を正規化する',()=>{
  assert.equal(literalMatches(pages,{},'').related[0].id,'semantic');
  assert.equal(normalizeTitle(' Ｒｕｂｙ '),'ruby');
});
