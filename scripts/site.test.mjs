import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const catalog=JSON.parse(await readFile('dist/catalog.json','utf8'));
const base=new URL(catalog[0].url,'https://example.test').pathname.split('notes/')[0];
const fileFor=url=>path.join('dist',url.slice(base.length),url.endsWith('/')?'index.html':'');

test('全記事を出力し、記事・検索インデックス・生成物をGit管理しない',async()=>{
  const stats=JSON.parse(await readFile('dist/build-stats.json','utf8'));
  assert.equal(catalog.length,stats.articles);
  assert.equal(new Set(catalog.map(p=>p.id)).size,catalog.length);
  assert(existsSync('dist/pagefind/pagefind.js'));
  const ignored=await readFile('.gitignore','utf8');assert(ignored.includes('dist/'));
});
test('全記事のローカルリンクと画像が存在し、関連記事は自身を含まず最大8件',async()=>{
  for(const page of catalog){
    const html=await readFile(fileFor(page.url),'utf8');
    assert(html.includes('data-pagefind-body'));assert(!html.includes('<script>alert('));
    const related=html.split('aria-labelledby="related-title"')[1];
    const recommendations=[...related.matchAll(/class="card-link" href="([^"]+)"/g)].map(m=>m[1]);
    assert(recommendations.length<=8);assert(!recommendations.includes(page.url));
    assert.equal(new Set(recommendations).size,recommendations.length);
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

test('一覧と初期HTMLをつながりが多い順に揃える',async()=>{
  for(let i=0;i<catalog.length;i++){
    assert(Number.isFinite(catalog[i].updatedAt) && catalog[i].updatedAt>0);
    assert(Number.isInteger(catalog[i].connections) && catalog[i].connections>=0);
    if(i)assert(catalog[i-1].connections>=catalog[i].connections);
  }
  const home=await readFile('dist/index.html','utf8');
  const first=home.match(/class="card-link" href="([^"]+)"/)[1];
  assert.equal(first,catalog[0].url);
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
