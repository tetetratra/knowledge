import { readFile, writeFile, readdir, mkdir, rm, cp, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { relatedPages, connectionCounts } from './related.mjs';
import { noteUpdateTimes } from './note-dates.mjs';
import { normalizeTitle } from '../site/knowledge.js';

const start = performance.now();
const siteVersion = createHash('sha256').update(await readFile('site/app.js')).update(await readFile('site/site.css')).update(await readFile('site/trail.js')).update(await readFile('site/knowledge.js')).update(await readFile('site/related.js')).digest('hex').slice(0, 12);
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '') + '/';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) throw new Error('BASE_PATHが不正');
const esc = s => String(s).replace(/[&<>"']/g, x => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[x]));
const md = new MarkdownIt({ html: false, linkify: true, breaks: true, highlight: (code, lang) =>
  lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value : '' });
const files = (await readdir('notes')).filter(f => f.endsWith('.md')).sort((a,b) => a.localeCompare(b, 'ja'));
const updated = noteUpdateTimes();
const pages = await Promise.all(files.map(async file => {
  const source = await readFile(`notes/${file}`, 'utf8');
  const match = source.match(/^---\ntags: (.+)\n---\s*\n# ([^\n]+)\n([\s\S]*)$/);
  if (!match) throw new Error(`記事形式が不正: ${file}`);
  const tags = JSON.parse(match[1]).split(',').map(t => t.trim()).filter(Boolean);
  const title = match[2].normalize('NFC'), body = match[3];
  const id = createHash('sha256').update(file.normalize('NFC')).digest('hex').slice(0, 16);
  const tokens = md.parse(body, {});
  const prose = tokens.flatMap(t => t.type === 'inline' ? (t.children || []).filter(c => ['text','code_inline'].includes(c.type)).map(c => c.content) : []).join(' ');
  const updatedAt = updated.get(`notes/${file.normalize('NFC')}`) ?? Math.floor((await stat(`notes/${file}`)).mtimeMs / 1000);
  return { id, title, tags, body, updatedAt, text: prose, excerpt: prose.replace(/https?:\/\/\S+/g, '').replace(/\s+/g,' ').trim().slice(0, 110), url: `${base}notes/${id}/`, file };
}));
pages.sort((a, b) => b.updatedAt - a.updatedAt || a.title.localeCompare(b.title, 'ja'));
if (new Set(pages.map(p => p.id)).size !== pages.length) throw new Error('記事IDが重複');
const byFile = new Map(pages.map(p => [p.file, p]));
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx], src = token.attrGet('src');
  if (!/^\.\.\/assets\/[a-f0-9]{64}\.[a-z]+$/.test(src)) throw new Error(`画像パスが不正: ${src}`);
  token.attrSet('src', base + src.slice(3)); token.attrSet('alt', self.renderInlineAsText(token.children, options)); token.attrSet('loading','lazy'); token.attrSet('decoding','async');
  return self.renderToken(tokens, idx, options);
};
const linkOpen = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx], href = token.attrGet('href');
  if (href && !/^[a-z]+:|^#|^\//i.test(href)) {
    const [target, anchor] = href.split('#');
    const page = byFile.get(decodeURIComponent(target).replace(/^\.\//,''));
    if (page) token.attrSet('href', page.url + (anchor ? '#' + anchor : ''));
    else {
      // 原文の括弧書きがリンクとして解釈されても、存在しないページへ遷移させない。
      const close = tokens.slice(idx + 1).find(t => t.type === 'link_close');
      if (close) { close.type = 'text'; close.content = ''; }
      return '';
    }
  }
  if (/^https?:/.test(href || '')) token.attrSet('rel','noreferrer');
  return linkOpen(tokens, idx, options, env, self);
};
let headingCount = 0;
md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('id', `section-${++headingCount}`);
  return self.renderToken(tokens,idx,options);
};
const titles = new Map();
for (const page of pages) if (!titles.has(normalizeTitle(page.title))) titles.set(normalizeTitle(page.title), page);
const tagPages = Object.create(null);
const emptyPages = new Map();
for (const page of pages) for (const tag of page.tags) {
  const key = normalizeTitle(tag);
  if (Object.hasOwn(tagPages, key)) continue;
  let target = titles.get(key);
  if (!target) {
    const id = createHash('sha256').update('tag:' + key).digest('hex').slice(0, 16);
    target = { id, title: tag, url: `${base}notes/${id}/` };
    if (pages.some(page => page.id === id)) throw new Error('空ページのIDが既存記事と重複');
    emptyPages.set(id, target);
  }
  tagPages[key] = target.url;
}
const chip = tag => `<a class="tag" href="${esc(tagPages[normalizeTitle(tag)])}">${esc(tag)}</a>`;
const card = (p, shared = []) => `<article class="note-card"><a class="card-link" href="${p.url}"><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></a><div class="card-tags">${(shared.length ? shared : p.tags).slice(0,3).map(t => chip(t)).join(' ')}</div></article>`;
function shell(title, content, article = false) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Knowledge"><title>${esc(title)}${title === 'Knowledge' ? '' : ' | Knowledge'}</title><link rel="icon" href="${base}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}site.css?v=${siteVersion}"><script type="module" src="${base}app.js?v=${siteVersion}"></script></head><body data-base="${base}"><a class="skip-link" href="#main">本文へ移動</a><header class="site-header"><div class="header-inner"><a class="brand" href="${base}" aria-label="Knowledge ホーム"><span class="brand-mark" aria-hidden="true">k.</span>Knowledge</a>${article ? `<a class="header-search" href="${base}#q">検索 <kbd>/</kbd></a>` : '<span class="header-count">'+pages.length+' notes</span>'}</div></header><nav id="visit-trail" class="visit-trail" aria-label="閲覧履歴" data-pagefind-ignore hidden></nav>${content}<footer class="site-footer"><a href="${base}">Knowledge</a><a href="#top">ページの先頭へ ↑</a></footer></body></html>`;
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist/notes', { recursive: true });
await mkdir('dist/related', { recursive: true });
await cp('assets','dist/assets', { recursive: true });
await cp('site','dist', { recursive: true });
await cp('node_modules/highlight.js/styles/github.css','dist/code.css');
const relationStart = performance.now();
const queries = [...pages, ...Array.from(emptyPages.values(), page => ({...page, text:'', tags:[page.title], isTag:true}))];
const allRelated = relatedPages(pages, pages.length, queries);
const relatedById = new Map(queries.map((page, i) => [page.id, allRelated[i]]));
// 一覧のつながり数は従来どおり、実記事の上位8件から数える。
const related = allRelated.slice(0, pages.length).map(links => links.slice(0, 8));
const connections = connectionCounts(pages, related);
for (const page of pages) page.connections = connections.get(page.id);
const relationSeconds = (performance.now() - relationStart) / 1000;
const byId = new Map(pages.map(p => [p.id,p]));
function relatedSection(page) {
  const links = relatedById.get(page.id);
  const cards = links.slice(0,8).map(link => card(byId.get(link.id),link.sharedTags)).join('');
  return `<section class="related" data-related-id="${page.id}" aria-labelledby="related-title"><div class="section-heading"><h2 id="related-title">関連するノート</h2><div class="catalog-controls"><label class="sr-only" for="related-sort">関連記事の並び順</label><select id="related-sort" disabled><option value="relevance">関連度が高い順</option><option value="updated">更新が新しい順</option></select></div></div><p data-related-status class="search-status" role="status" hidden></p><div class="note-grid related-grid" data-related-results>${cards || '<p class="muted">関連するノートはまだありません。</p>'}</div><button type="button" class="more-button" data-related-more disabled${links.length <= 8 ? ' hidden' : ''}>もっと見る</button></section>`;
}
for (const page of queries) await writeFile(`dist/related/${page.id}.json`, JSON.stringify(relatedById.get(page.id)));
for (const page of pages) {
  headingCount = 0;
  const rendered = md.render(page.body);
  const allTags = page.tags.slice(0,12).map(t => chip(t)).join(' ');
  const restTags = page.tags.length > 12 ? `<details class="more-tags"><summary data-pagefind-ignore>ほか${page.tags.length - 12}タグ</summary><div class="article-tags">${page.tags.slice(12).map(t => chip(t)).join(' ')}</div></details>` : '';
  const content = `<main id="main" class="article-main"><nav class="breadcrumb" aria-label="パンくず"><a href="${base}">ノート一覧</a><span aria-hidden="true">/</span><span>ノート</span></nav><article class="reading" data-pagefind-body><header class="article-header"><h1 data-pagefind-meta="title">${esc(page.title)}</h1><div class="article-tags" data-pagefind-weight="2">${allTags}${restTags}</div></header><div class="prose">${rendered}</div></article>${relatedSection(page)}</main>`;
  const directory = `dist/notes/${page.id}`; await mkdir(directory);
  await writeFile(`${directory}/index.html`, shell(page.title, content, true));
}
for (const page of emptyPages.values()) {
  const directory = `dist/notes/${page.id}`;
  await mkdir(directory);
  const content = `<main id="main" class="article-main"><nav class="breadcrumb" aria-label="パンくず"><a href="${base}">ノート一覧</a></nav><article class="reading" data-empty-page><header class="article-header"><h1>${esc(page.title)}</h1></header><div class="prose"></div></article>${relatedSection(page)}</main>`;
  await writeFile(`${directory}/index.html`, shell(page.title, content, true));
}
await writeFile('dist/tag-pages.json', JSON.stringify(tagPages));
pages.sort((a, b) => b.connections - a.connections || b.updatedAt - a.updatedAt || a.title.localeCompare(b.title, 'ja'));
const content = `<main id="main" class="library-main"><section class="intro" id="top"><h1 class="sr-only">ノート検索</h1><form id="search-form" class="search-box" role="search"><span class="search-symbol" aria-hidden="true">⌕</span><label class="sr-only" for="q">タイトル・本文・タグを検索</label><input id="q" name="q" type="search" placeholder="キーワード・タグで検索" autocomplete="off"></form></section><section id="exact-section" class="exact-section" aria-labelledby="exact-title" hidden><div class="section-heading"><h2 id="exact-title">完全一致</h2></div><div id="exact-results" class="note-grid"></div></section><section class="library" aria-labelledby="list-title"><div class="catalog"><div class="section-heading"><h2 id="list-title">すべてのノート</h2><div class="catalog-controls"><label for="sort" class="sr-only">ノートの並び順</label><select id="sort"><option value="connections">つながりが多い順</option><option value="updated">更新が新しい順</option></select><span id="result-count" class="muted" role="status" aria-live="polite">${pages.length}件</span></div></div><p id="search-status" class="search-status" role="status" aria-live="polite"></p><div id="results" class="note-grid">${pages.slice(0,30).map(p=>card(p)).join('')}</div><button id="more" class="more-button" type="button">もっと見る</button><noscript><p>検索にはJavaScriptが必要です。</p><details><summary>すべてのノートを表示</summary><ul>${pages.map(p=>`<li><a href="${p.url}">${esc(p.title)}</a></li>`).join('')}</ul></details></noscript></div></section></main>`;
await writeFile('dist/index.html', shell('Knowledge',content));
await writeFile('dist/catalog.json', JSON.stringify(pages.map(({id,title,tags,excerpt,url,updatedAt,connections})=>({id,title,tags,excerpt,url,updatedAt,connections}))));
await writeFile('dist/404.html',shell('ページが見つかりません',`<main id="main" class="article-main"><h1>ページが見つかりません</h1><p><a href="${base}">ノート一覧から探す →</a></p></main>`));
await writeFile('dist/.nojekyll','');
const stats = { articles: pages.length, relatedSeconds: +relationSeconds.toFixed(3), generationSeconds: +((performance.now()-start)/1000).toFixed(3) };
await writeFile('dist/build-stats.json', JSON.stringify(stats));
console.log('サイト生成:',stats);
