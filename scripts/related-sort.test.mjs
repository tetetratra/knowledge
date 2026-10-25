import test from 'node:test';
import assert from 'node:assert/strict';
import { tagRelations } from './tag-relations.mjs';

test('タグを親、タグ付け元を子とし、自己参照と表記違いの重複を除く', () => {
  const pages = [
    {id:'a',url:'/a/',title:'A',tags:['Ｒｕｂｙ','ruby','A'],updatedAt:1},
    {id:'b',url:'/b/',title:'B',tags:['Ruby'],updatedAt:9},
    {id:'ruby',url:'/ruby/',title:'Ruby'},
    {id:'isolated',url:'/isolated/',title:'関係なし',tags:[]},
  ];
  const links = tagRelations(pages, {ruby:'/ruby/', a:'/a/'});
  assert.deepEqual(links.get('a').parents.map(p=>p.id), ['ruby']);
  assert.deepEqual(links.get('ruby').children.map(p=>p.id), ['b','a']);
  assert.deepEqual(links.get('ruby').parents, []);
  assert.deepEqual(links.get('isolated'), {parents:[],children:[]});
});
