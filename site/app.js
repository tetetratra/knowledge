const base = document.body.dataset.base;
const form = document.querySelector('#search-form');
const query = document.querySelector('#q');
document.addEventListener('keydown', event => {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable]')) return;
  event.preventDefault();
  if (query) query.focus(); else location.href = base + '#q';
});
if (form) {
  const tag = document.querySelector('#tag');
  const results = document.querySelector('#results');
  const count = document.querySelector('#result-count');
  const status = document.querySelector('#search-status');
  const heading = document.querySelector('#list-title');
  const more = document.querySelector('#more');
  const clear = document.querySelector('#clear');
  const catalogPromise = fetch(base + 'catalog.json').then(r => { if (!r.ok) throw new Error('一覧データを取得できません'); return r.json(); });
  let pagefindPromise, active = [], shown = 0, generation = 0, timer;
  const esc = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const tagHref = t => base + '?tag=' + encodeURIComponent(t);
  async function pagefind() {
    pagefindPromise ||= import(base + 'pagefind/pagefind.js').then(async module => {
      await module.options({ baseUrl: base, excerptLength: 28 }); return module;
    });
    return pagefindPromise;
  }
  query.addEventListener('focus', () => { pagefind().catch(() => {}); });
  function syncLocation(replace = true) {
    const url = new URL(location.href);
    url.search = ''; if (query.value.trim()) url.searchParams.set('q',query.value.trim());
    if (tag.value) url.searchParams.set('tag',tag.value);
    history[replace ? 'replaceState' : 'pushState']({},'',url);
  }
  function readLocation() {
    const params = new URLSearchParams(location.search); query.value = params.get('q') || '';
    tag.value = params.get('tag') || '';
    // タグが後から消えても、不正なフィルターを残さない。
    if (tag.selectedIndex < 0) tag.value = '';
  }
  async function showMore(version) {
    more.disabled = true;
    try {
      const slice = active.slice(shown,shown+24);
      const catalog = await catalogPromise;
      const data = await Promise.all(slice.map(async item => {
        if (!item.data) return { ...item, snippet: esc(item.excerpt) };
        const result = await item.data();
        const path = new URL(result.url,location.origin).pathname;
        const article = catalog.find(p => p.url === path);
        if (!article) throw new Error('検索結果と記事の対応を確認できません');
        return { ...article, snippet: result.excerpt };
      }));
      if (version !== generation) return;
      const html = data.map(item => `<article class="note-card"><a class="card-link" href="${esc(item.url)}"><h3>${esc(item.title)}</h3><p>${item.snippet || 'タイトルからノートを開く'}</p></a><div class="card-tags">${item.tags.slice(0,3).map(t=>`<a class="tag" href="${esc(tagHref(t))}">${esc(t)}</a>`).join('')}</div></article>`).join('');
      results.insertAdjacentHTML('beforeend',html); shown += data.length;
      more.hidden = shown >= active.length;
    } finally { if (version === generation) more.disabled = false; }
  }
  async function search() {
    const version = ++generation;
    more.disabled = true; more.hidden = true;
    results.replaceChildren(); count.textContent = ''; status.textContent = '読み込み中…';
    heading.textContent = query.value.trim() ? '検索結果' : tag.value ? tag.value + ' のノート' : 'すべてのノート';
    clear.hidden = !tag.value;
    document.querySelectorAll('[data-tag]').forEach(link=>link.classList.toggle('active',link.dataset.tag===tag.value));
    try {
      const term = query.value.trim(); const selectedTag = tag.value;
      let matches;
      if (term) {
        const engine = await pagefind();
        matches = (await engine.search(term, selectedTag ? { filters:{tag:selectedTag} } : {})).results;
      } else {
        matches = (await catalogPromise).filter(p=>!selectedTag || p.tags.includes(selectedTag));
      }
      if (version !== generation) return;
      active = matches; shown = 0; count.textContent = active.length + '件';
      status.textContent = active.length ? '' : '一致するノートがありません。別の言葉で検索するか、タグを解除してください。';
      await showMore(version);
    } catch (error) {
      if (version !== generation) return;
      status.textContent = '読み込めませんでした。通信状況を確認して再度検索してください。';
      console.error(error);
    }
  }
  form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);syncLocation();search();});
  query.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{syncLocation();search();},220);});
  tag.addEventListener('change',()=>{clearTimeout(timer);syncLocation(false);search();});
  clear.addEventListener('click',()=>{tag.value='';syncLocation(false);search();});
  more.addEventListener('click',()=>showMore(generation).catch(error=>{status.textContent='続きを読み込めませんでした。再度お試しください。';console.error(error);}));
  document.addEventListener('click',event=>{
    const link=event.target.closest('a'); if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url=new URL(link.href); if(url.pathname!==base || !url.searchParams.has('tag')) return;
    event.preventDefault();query.value='';tag.value=url.searchParams.get('tag');syncLocation(false);search();
  });
  window.addEventListener('popstate',()=>{readLocation();search();});
  readLocation();search();
  if(location.hash==='#q') query.focus();
}
