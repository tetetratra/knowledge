import { readFile, writeFile, readdir, mkdir, rm, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { relatedPages } from './related.mjs';

const start = performance.now();
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '') + '/';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) throw new Error('BASE_PATHが不正');
const esc = s => String(s).replace(/[&<>"']/g, x => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[x]));
const md = new MarkdownIt({ html: false, linkify: true, breaks: true, highlight: (code, lang) =>
  lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value : '' });
const files = (await readdir('notes')).filter(f => f.endsWith('.md')).sort((a,b) => a.localeCompare(b, 'ja'));
const pages = await Promise.all(files.map(async file => {
  const source = await readFile(`notes/${file}`, 'utf8');
  const match = source.match(/^---\ntags: (.+)\n---\s*\n# ([^\n]+)\n([\s\S]*)$/);
  if (!match) throw new Error(`記事形式が不正: ${file}`);
  const tags = JSON.parse(match[1]).split(',').map(t => t.trim()).filter(Boolean);
  const title = match[2].normalize('NFC'), body = match[3];
  const id = createHash('sha256').update(file.normalize('NFC')).digest('hex').slice(0, 16);
  const tokens = md.parse(body, {});
  const prose = tokens.flatMap(t => t.type === 'inline' ? (t.children || []).filter(c => ['text','code_inline'].includes(c.type)).map(c => c.content) : []).join(' ');
  return { id, title, tags, body, text: prose, excerpt: prose.replace(/https?:\/\/\S+/g, '').replace(/\s+/g,' ').trim().slice(0, 110), url: `${base}notes/${id}/`, file };
}));
if (new Set(pages.map(p => p.id)).size !== pages.length) throw new Error('記事IDが重複');
const byFile = new Map(pages.map(p => [p.file, p]));
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx], src = token.attrGet('src');
  if (!/^\.\.\/assets\/[a-f0-9]{64}\.[a-z]+$/.test(src)) throw new Error(`画像パスが不正: ${src}`);
  token.attrSet('src', base + src.slice(3)); token.attrSet('loading','lazy'); token.attrSet('decoding','async');
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
const tagUrl = tag => `${base}?tag=${encodeURIComponent(tag)}`;
const chip = (tag, filter = false) => `<a class="tag" href="${esc(tagUrl(tag))}"${filter ? ' data-pagefind-filter="tag"' : ''}>${esc(tag)}</a>`;
const card = (p, shared = []) => `<article class="note-card"><a class="card-link" href="${p.url}"><h3>${esc(p.title)}</h3><p>${esc(p.excerpt || 'タイトルからノートを開く')}</p></a><div class="card-tags">${(shared.length ? shared : p.tags).slice(0,3).map(t => chip(t)).join('')}</div></article>`;
function shell(title, content, article = false) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="技術と学びのノート。検索とタグから、関連する知識をたどる。"><title>${esc(title)}${title === 'Knowledge' ? '' : ' | Knowledge'}</title><link rel="icon" href="${base}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}site.css"><script type="module" src="${base}app.js"></script></head><body data-base="${base}"><a class="skip-link" href="#main">本文へ移動</a><header class="site-header"><div class="header-inner"><a class="brand" href="${base}" aria-label="Knowledge ホーム"><span class="brand-mark" aria-hidden="true">k.</span>Knowledge</a><span class="header-caption">学びをつなぐ、知識のノート</span>${article ? `<a class="header-search" href="${base}#q">検索 <kbd>/</kbd></a>` : '<span class="header-count">'+pages.length+' notes</span>'}</div></header>${content}<footer class="site-footer"><a href="${base}">Knowledge</a><span>知識を残す。つながりを見つける。</span><a href="#top">ページの先頭へ ↑</a></footer></body></html>`;
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist/notes', { recursive: true });
await cp('assets','dist/assets', { recursive: true });
await cp('site','dist', { recursive: true });
await cp('node_modules/highlight.js/styles/github.css','dist/code.css');
const relationStart = performance.now();
const related = relatedPages(pages);
const relationSeconds = (performance.now() - relationStart) / 1000;
const byId = new Map(pages.map(p => [p.id,p]));
for (const [index,page] of pages.entries()) {
  headingCount = 0;
  const rendered = md.render(page.body);
  const allTags = page.tags.slice(0,12).map(t => chip(t,true)).join('');
  const restTags = page.tags.length > 12 ? `<details class="more-tags"><summary>ほか${page.tags.length - 12}タグ</summary><div class="article-tags">${page.tags.slice(12).map(t => chip(t,true)).join('')}</div></details>` : '';
  const relatedCards = related[index].map(r => card(byId.get(r.id),r.sharedTags)).join('');
  const content = `<main id="main" class="article-main"><nav class="breadcrumb" aria-label="パンくず"><a href="${base}">ノート一覧</a><span aria-hidden="true">/</span><span>ノート</span></nav><article class="reading" data-pagefind-body><header class="article-header"><div class="eyebrow">KNOWLEDGE NOTE</div><h1 data-pagefind-meta="title">${esc(page.title)}</h1><div class="article-tags" data-pagefind-ignore>${allTags}${restTags}</div></header><div class="prose">${rendered}</div></article><section class="related" aria-labelledby="related-title"><div class="section-heading"><div><span class="eyebrow">KEEP EXPLORING</span><h2 id="related-title">関連するノート</h2></div><span class="muted">タグと本文から</span></div><div class="note-grid related-grid">${relatedCards || '<p class="muted">関連するノートはまだありません。</p>'}</div></section></main>`;
  const directory = `dist/notes/${page.id}`; await mkdir(directory);
  await writeFile(`${directory}/index.html`, shell(page.title, content, true));
}
const tagCounts = new Map();
for (const p of pages) for (const tag of p.tags) tagCounts.set(tag,(tagCounts.get(tag)||0)+1);
const tags = Array.from(tagCounts, ([tag,count]) => ({tag,count})).sort((a,b)=>b.count-a.count || a.tag.localeCompare(b.tag,'ja'));
const content = `<main id="main" class="library-main"><section class="intro" id="top"><div class="eyebrow">A PERSONAL KNOWLEDGE LIBRARY</div><h1>知識を、つないでいく。</h1><p>気になる言葉から探す。ひとつのノートから、次の学びへ。</p><form id="search-form" class="search-box" role="search"><span class="search-symbol" aria-hidden="true">⌕</span><label class="sr-only" for="q">ノートを全文検索</label><input id="q" name="q" type="search" placeholder="キーワードで検索" autocomplete="off"><button type="submit">検索 <span aria-hidden="true">↗</span></button></form><p class="search-hint">タイトル・本文を全文検索 <span><kbd>/</kbd> で検索へ</span></p></section><section class="library" aria-labelledby="list-title"><aside class="filters"><div class="filter-title"><h2>タグから探す</h2><button id="clear" class="text-button" type="button" hidden>解除</button></div><label for="tag" class="sr-only">タグを選択</label><select id="tag"><option value="">すべてのタグ</option>${tags.map(t=>`<option value="${esc(t.tag)}">${esc(t.tag)} (${t.count})</option>`).join('')}</select><div class="popular-tags">${tags.slice(0,14).map(t=>`<a href="${esc(tagUrl(t.tag))}" data-tag="${esc(t.tag)}"><span>${esc(t.tag)}</span><span class="tag-count">${t.count}</span></a>`).join('')}</div><p class="filter-note">タグを選んでから、<br>キーワードでも絞り込めます。</p></aside><div class="catalog"><div class="section-heading"><h2 id="list-title">すべてのノート</h2><span id="result-count" class="muted" role="status" aria-live="polite">${pages.length}件</span></div><p id="search-status" class="search-status" role="status" aria-live="polite"></p><div id="results" class="note-grid">${pages.slice(0,24).map(p=>card(p)).join('')}</div><button id="more" class="more-button" type="button">もっと見る</button><noscript><p>検索・タグ絞り込みにはJavaScriptが必要です。</p><details><summary>すべてのノートを表示</summary><ul>${pages.map(p=>`<li><a href="${p.url}">${esc(p.title)}</a></li>`).join('')}</ul></details></noscript></div></section></main>`;
await writeFile('dist/index.html', shell('Knowledge',content));
await writeFile('dist/catalog.json', JSON.stringify(pages.map(({id,title,tags,excerpt,url})=>({id,title,tags,excerpt,url}))));
await writeFile('dist/404.html',shell('ページが見つかりません',`<main id="main" class="article-main"><h1>ページが見つかりません</h1><p><a href="${base}">ノート一覧から探す →</a></p></main>`));
await writeFile('dist/.nojekyll','');
const stats = { articles: pages.length, relatedSeconds: +relationSeconds.toFixed(3), generationSeconds: +((performance.now()-start)/1000).toFixed(3) };
await writeFile('dist/build-stats.json', JSON.stringify(stats));
console.log('サイト生成:',stats);
