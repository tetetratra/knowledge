const version = new URL(import.meta.url).search;
const { normalizeTitle, splitMatches } = await import('./knowledge.js' + version);
const base = document.body.dataset.base;
const form = document.querySelector('#search-form');
const query = document.querySelector('#q');
document.addEventListener('keydown', event => {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable]')) return;
  event.preventDefault();
  if (query) query.focus(); else location.href = base + '#q';
});
if (form) {
  const results = document.querySelector('#results');
  const exactSection = document.querySelector('#exact-section');
  const exactResults = document.querySelector('#exact-results');
  const count = document.querySelector('#result-count');
  const status = document.querySelector('#search-status');
  const heading = document.querySelector('#list-title');
  const more = document.querySelector('#more');
  const loadJson = async file => {
    const response = await fetch(base + file, { cache: 'no-cache' });
    if (!response.ok) throw new Error('一覧データを取得できません');
    return response.json();
  };
  const catalogPromise = loadJson('catalog.json');
  const tagPagesPromise = loadJson('tag-pages.json');
  const fragments = new Map();
  let pagefindPromise, active = [], shown = 0, generation = 0, timer;
  const esc = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  async function pagefind() {
    pagefindPromise ||= import(base + 'pagefind/pagefind.js').then(async module => {
      await module.options({ baseUrl: base, excerptLength: 28 }); return module;
    });
    return pagefindPromise;
  }
  query.addEventListener('focus', () => { pagefind().catch(() => {}); });
  function syncLocation(push = false) {
    const url = new URL(location.href);
    url.search = ''; if (query.value.trim()) url.searchParams.set('q',query.value.trim());
    history[push ? 'pushState' : 'replaceState']({},'',url);
  }
  function readLocation() {
    const params = new URLSearchParams(location.search); query.value = params.get('q') || '';
  }
  function cards(pages, tagPages) {
    return pages.map(item => `<article class="note-card"><a class="card-link" href="${esc(item.url)}"><h3>${esc(item.title)}</h3><p>${item.snippet ?? esc(item.excerpt)}</p></a><div class="card-tags">${item.tags.slice(0,3).map(tag => `<a class="tag" href="${esc(tagPages[normalizeTitle(tag)])}">${esc(tag)}</a>`).join(' ')}</div></article>`).join('');
  }
  async function showMore(version) {
    more.disabled = true;
    try {
      const tags = await tagPagesPromise;
      if (version !== generation) return;
      const slice = active.slice(shown,shown+100);
      results.insertAdjacentHTML('beforeend',cards(slice,tags)); shown += slice.length;
      more.hidden = shown >= active.length;
    } finally { if (version === generation) more.disabled = false; }
  }
  async function matchingPages(term, catalog, version) {
    const engine = await pagefind();
    const hits = (await engine.search(term)).results;
    const byUrl = new Map(catalog.map(page => [page.url,page]));
    const matches = [];
    let index = 0;
    // 全結果を順位付けするためメタデータを読み、同時リクエスト数を制限する。
    await Promise.all(Array.from({length:Math.min(8,hits.length)},async()=>{
      while (index < hits.length && version === generation) {
        const searchRank = index++;
        const hit = hits[searchRank];
        if (!fragments.has(hit.id)) fragments.set(hit.id,hit.data().catch(error=>{fragments.delete(hit.id);throw error;}));
        const data = await fragments.get(hit.id);
        const page = byUrl.get(new URL(data.url,location.origin).pathname);
        if (!page) throw new Error('検索結果と記事の対応を確認できません');
        matches.push({...page,snippet:data.excerpt,searchRank});
      }
    }));
    return matches;
  }
  async function search() {
    const version = ++generation;
    const term = query.value.trim();
    more.disabled = true; more.hidden = true;
    results.replaceChildren(); exactResults.replaceChildren(); exactSection.hidden = true;
    count.textContent = ''; status.textContent = '読み込み中…';
    heading.textContent = term ? '関連' : 'すべてのノート';
    document.querySelector('#popular-tags').hidden = Boolean(term);
    try {
      const [catalog,tags] = await Promise.all([catalogPromise,tagPagesPromise]);
      if (version !== generation) return;
      const exact = splitMatches(catalog,[],term).exact;
      exactSection.hidden = !exact.length;
      exactResults.innerHTML = cards(exact,tags);
      const matches = term ? await matchingPages(term,catalog,version) : catalog;
      if (version !== generation) return;
      active = splitMatches(catalog,matches,term).related;
      shown = 0; count.textContent = active.length + '件';
      status.textContent = active.length ? '' : exact.length ? '関連するノートはありません。' : '一致するノートがありません。別の言葉で検索してください。';
      await showMore(version);
    } catch (error) {
      if (version !== generation) return;
      status.textContent = '読み込めませんでした。通信状況を確認して再度検索してください。';
      console.error(error);
    }
  }
  form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);syncLocation();search();});
  query.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{syncLocation();search();},220);});
  more.addEventListener('click',()=>showMore(generation).catch(error=>{status.textContent='続きを読み込めませんでした。再度お試しください。';console.error(error);}));
  window.addEventListener('popstate',()=>{readLocation();search();});
  readLocation();search();
  if(location.hash==='#q') query.focus();
}

import('./trail.js' + version).then(module => module.mountTrail(base)).catch(console.error);
import('./related.js' + version).then(module => module.mountRelated(base,version)).catch(console.error);
