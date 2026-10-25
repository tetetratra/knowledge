import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { tagRelations } from './tag-relations.mjs';

const catalog=JSON.parse(await readFile('dist/catalog.json','utf8'));
const base=new URL(catalog[0].url,'https://example.test').pathname.split('notes/')[0];
const fileFor=url=>path.join('dist',url.slice(base.length),url.endsWith('/')?'index.html':'');

test('全記事を出力し、記事・検索インデックス・生成物をGit管理しない',async()=>{
  const stats=JSON.parse(await readFile('dist/build-stats.json','utf8'));
  assert.equal(catalog.length,stats.articles);
  assert.equal(new Set(catalog.map(p=>p.id)).size,catalog.length);
  assert(existsSync('dist/search-text.json'));
  assert(existsSync('dist/semantic-worker.js'));
  assert(existsSync('dist/semantic/manifest.json'));
  const ignored=await readFile('.gitignore','utf8');assert(ignored.includes('dist/'));
});
test('全記事のローカルリンクと画像が存在し、関連一覧は自身を含まない',async()=>{
  for(const page of catalog){
    const html=await readFile(fileFor(page.url),'utf8');
    assert(html.includes('data-pagefind-body'));assert(!html.includes('<script>alert('));
    const related=html.split('class="related"')[1] || '';
    const recommendations=[...related.matchAll(/class="card-link" href="([^"]+)"/g)].map(m=>m[1]);
    assert(!recommendations.includes(page.url));
    assert(!html.includes('id="related-sort"'));
    for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
      const value=match[1].replaceAll('&amp;','&');
      if(/^(https?:|mailto:|tel:|#)/i.test(value))continue;
      const url=new URL(value,'https://example.test'+page.url);
      assert(url.pathname.startsWith(base),`${page.title}: ${value}`);
      const filename=decodeURIComponent(fileFor(url.pathname));
      assert(existsSync(filename),`${page.title}: ${filename}`);
      assert((await stat(filename)).isFile(),filename);
    }
  }
});

test('一覧と初期HTMLを更新が新しい順に揃え、ソートUIを出さない',async()=>{
  for(let i=0;i<catalog.length;i++){
    assert(Number.isFinite(catalog[i].updatedAt) && catalog[i].updatedAt>0);
    if(i)assert(catalog[i-1].updatedAt>=catalog[i].updatedAt);
  }
  const home=await readFile('dist/index.html','utf8');
  const first=home.match(/class="card-link" href="([^"]+)"/)[1];
  assert.equal(first,catalog[0].url);
  assert(!home.includes('id="sort"'));
  assert.equal([...home.matchAll(/class="card-link"/g)].length,Math.min(100,catalog.length));
});

test('タグは同名の実記事を優先し、未作成なら本文が空のページへ移動する',async()=>{
  const tags=JSON.parse(await readFile('dist/tag-pages.json','utf8'));
  const normalize=value=>value.normalize('NFKC').trim().toLowerCase();
  for(const [tag,url] of Object.entries(tags)){
    assert(!url.includes('?q='));
    const existing=catalog.filter(page=>normalize(page.title)===tag);
    if(existing.length) assert(existing.some(page=>page.url===url),tag);
    else {
      const html=await readFile(fileFor(url),'utf8');
      assert(html.includes('data-empty-page'),tag);
      assert(html.includes('<div class="prose"></div>'),tag);
      assert(!html.includes('data-pagefind-body'),tag);
    }
  }
});

test('親子を見出しのない一つの一覧にまとめ、重複を除き初期100件を表示する',async()=>{
  const tags=JSON.parse(await readFile('dist/tag-pages.json','utf8'));
  const byUrl=new Map(catalog.map(page=>[page.url,page]));
  for(const [title,url] of Object.entries(tags)) if(!byUrl.has(url)) {
    byUrl.set(url,{id:url.split('/').filter(Boolean).at(-1),title,url});
  }
  const pages=[...byUrl.values()];
  const relations=tagRelations(pages,tags);
  for(const page of pages){
    const html=await readFile(fileFor(page.url),'utf8');
    const group=html.split('data-related-group')[1] || '';
    const {parents,children}=relations.get(page.id);
    const expected=[...new Map([...parents,...children].map(target=>[target.id,target])).values()];
    const urls=[...group.matchAll(/class="card-link" href="([^"]+)"/g)].map(match=>match[1]);
    assert.deepEqual(urls,expected.map(target=>target.url),page.title);
    assert.equal(new Set(urls).size,urls.length);
    assert.equal([...group.matchAll(/<div hidden>/g)].length,Math.max(0,urls.length-100));
    assert(!group.includes('<h2'));
    assert(!group.includes('class="card-tags"'));
    assert(!group.includes('該当するノートはありません。'));
    assert(!group.includes('related-sort'));
  }
  const ruby=byUrl.get(tags.ruby);
  assert(relations.get(ruby.id).children.length>0);
});

test('トップ・記事・空ページ・404を含む全HTMLに検索掲載を拒否する指定がある',async()=>{
  const files=(await readdir('dist',{recursive:true})).filter(file=>file.endsWith('.html'));
  assert(files.length>catalog.length);
  for(const file of files){
    const html=await readFile(path.join('dist',file),'utf8');
    assert.match(html,/<meta name="robots" content="noindex, noimageindex">/,file);
  }
});
