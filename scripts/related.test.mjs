import test from 'node:test';
import assert from 'node:assert/strict';
import { words, relatedPages, connectionCounts } from './related.mjs';

test('日本語・英語を正規化し、機能語や数値を除く',()=>{
  const tokens=words('Rubyのメモリを調べるために、２０２６年に実行する');
  assert(tokens.includes('ruby')); assert(tokens.includes('メモリ'));
  assert(!tokens.includes('2026')); assert(!tokens.includes('ため'));
});
test('本文とタグの近い記事を推薦し、自分自身・無関係な記事を除く',()=>{
  const pages=[
    {id:'ruby',title:'Rubyのメモリ',tags:['Ruby'],text:'Rubyオブジェクトのメモリ使用量をObjectSpaceで計測する'},
    {id:'object',title:'ObjectSpace',tags:['Ruby'],text:'Rubyのオブジェクトを調べてメモリ使用量を計測する'},
    {id:'design',title:'配色',tags:['デザイン'],text:'色彩と配色で画面のデザインを改善する'},
    {id:'sql',title:'SQL',tags:['データベース'],text:'データベースのテーブルにSQLで問い合わせる'},
  ];
  const results=relatedPages(pages,2);
  assert.equal(results[0][0].id,'object');
  assert.deepEqual(results[0][0].sharedTags,['Ruby']);
  assert(!results[0].some(r=>r.id==='ruby'||r.id==='design'));
  assert(results.every(list=>list.length<=2));
  assert.deepEqual(results,relatedPages(pages,2));
});
test('空のコーパスと本文なしのページでも計算可能',()=>{
  assert.deepEqual(relatedPages([]),[]);
  assert.deepEqual(relatedPages([{id:'a',title:'A',tags:[],text:''}]),[[]]);
});

test('つながりは双方向の相手ページ数で数え、相互リンクを重複計上しない',()=>{
  const pages=['a','b','c','d'].map(id=>({id}));
  const links=[[{id:'b'},{id:'b'}],[{id:'a'}],[{id:'a'}],[]];
  assert.deepEqual(Array.from(connectionCounts(pages,links).values()),[2,1,1,0]);
});

test('未作成タグを同じ文書空間で評価し、空の本文でもタグ付き記事を返す',()=>{
  const pages=[
    {id:'ruby-note',title:'オブジェクトを調べる',text:'ObjectSpaceによるメモリの計測',tags:['Ruby']},
    {id:'other',title:'配色',text:'画面の配色を調整する',tags:['デザイン']},
  ];
  const query={id:'virtual-ruby',title:'Ruby',text:'',tags:['Ruby'],isTag:true};
  const result=relatedPages(pages,10,[query]);
  assert.equal(result[0][0].id,'ruby-note');
  assert(!result[0].some(link=>link.id==='other'));
});
