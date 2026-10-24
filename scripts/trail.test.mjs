import test from 'node:test';
import assert from 'node:assert/strict';
import { visitTrail } from '../site/trail.js';
const page = name => ({ url: '/knowledge/notes/' + name + '/', title: name });
const empty = () => ({ entries: [], cursor: -1 });

test('訪問順を記録し、再読み込みでは増やさない',()=>{
  let state=visitTrail(empty(),page('Ruby'),null,'a');
  state=visitTrail(state,page('言語'),null,'b');
  state=visitTrail(state,page('言語'),'b','unused');
  assert.deepEqual(state.entries.map(p=>p.title),['Ruby','言語']);
  assert.equal(state.cursor,1);
});
test('パンくずとブラウザ履歴で戻り、そこから別のページへ進む',()=>{
  let state=visitTrail(empty(),page('Ruby'),null,'a');
  state=visitTrail(state,page('言語'),null,'b');
  state=visitTrail(state,page('コンパイラ'),null,'c');
  state=visitTrail({...state,pendingId:'a'},page('Ruby'),null,'unused');
  assert.equal(state.cursor,0);
  const back=visitTrail(state,page('コンパイラ'),'c','unused');
  assert.equal(back.cursor,2);
  state=visitTrail(state,page('型'),null,'d');
  assert.deepEqual(state.entries.map(p=>p.title),['Ruby','型']);
});
test('同じページへの連続訪問をまとめ、古い履歴を制限する',()=>{
  let state=empty();
  for(let i=0;i<45;i++)state=visitTrail(state,page(String(i)),null,String(i));
  assert.equal(state.entries.length,40);assert.equal(state.cursor,39);
  const duplicate=visitTrail(state,page('44'),null,'another');
  assert.deepEqual(duplicate,state);
});
