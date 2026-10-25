const version = new URL(import.meta.url).search;
const { normalizeTitle, literalMatches, appendSemantic } = await import('./knowledge.js'+version);
const base = document.body.dataset.base;
const form = document.querySelector('#search-form');
const query = document.querySelector('#q');
document.addEventListener('keydown',event=>{
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable]')) return;
  event.preventDefault();if (query) query.focus();else location.href=base+'#q';
});
if (form) {
  const results=document.querySelector('#results'),exactSection=document.querySelector('#exact-section'),exactResults=document.querySelector('#exact-results');
  const count=document.querySelector('#result-count'),status=document.querySelector('#search-status'),semanticStatus=document.querySelector('#semantic-status');
  const heading=document.querySelector('#list-title'),more=document.querySelector('#more');
  const loadJson=async file=>{
    const response=await fetch(base+file,{cache:'no-cache'});
    if (!response.ok) throw new Error('検索データを取得できません');
    return response.json();
  };
  const catalogPromise=loadJson('catalog.json'),tagsPromise=loadJson('tag-pages.json');
  let bodiesPromise,active=[],shown=0,generation=0,timer;
  const esc=value=>String(value).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const cards=(pages,tags)=>pages.map(page=>`<article class="note-card"><a class="card-link" href="${esc(page.url)}"><h3>${esc(page.title)}</h3><p>${esc(page.excerpt)}</p></a><div class="card-tags">${page.tags.slice(0,3).map(tag=>`<a class="tag" href="${esc(tags[normalizeTitle(tag)])}">${esc(tag)}</a>`).join(' ')}</div></article>`).join('');
  function syncLocation() {
    const url=new URL(location.href);url.search='';
    if (query.value.trim()) url.searchParams.set('q',query.value.trim());
    history.replaceState({},'',url);
  }
  function readLocation() {query.value=new URLSearchParams(location.search).get('q') || '';}
  function updateCount() {count.textContent=active.length+'件';more.hidden=shown>=active.length;}
  async function showMore(request) {
    more.disabled=true;
    try {
      const tags=await tagsPromise;
      if (request!==generation) return;
      const slice=active.slice(shown,shown+100);
      results.insertAdjacentHTML('beforeend',cards(slice,tags));shown+=slice.length;updateCount();
    } finally {if (request===generation) more.disabled=false;}
  }
  async function addSemantic(term,catalog,literal,request) {
    semanticStatus.textContent='意味が近いノートも検索中…';
    try {
      const {searchSemantic}=await import('./semantic.js'+version);
      if (request!==generation) return;
      const matches=await searchSemantic(term,version);
      if (request!==generation) return;
      const extra=appendSemantic(catalog,literal,matches);
      active.push(...extra);
      // 表示済みの文字一致結果を保ち、余っている表示枠にだけ追加する。
      if (shown<100) {
        const tags=await tagsPromise;
        if (request!==generation) return;
        const slice=active.slice(shown,100);results.insertAdjacentHTML('beforeend',cards(slice,tags));shown+=slice.length;
      }
      updateCount();
      if (active.length) status.textContent='';
      semanticStatus.textContent='';
    } catch {
      if (request===generation) semanticStatus.textContent='意味が近いノートを検索できませんでした。文字一致の結果を表示しています。';
    }
  }
  async function search() {
    const request=++generation,term=query.value.trim();
    more.hidden=true;more.disabled=true;active=[];shown=0;
    results.replaceChildren();exactResults.replaceChildren();exactSection.hidden=true;
    status.textContent='読み込み中…';semanticStatus.textContent='';count.textContent='';
    heading.textContent=term ? '関連' : 'すべてのノート';document.querySelector('#popular-tags').hidden=Boolean(term);
    try {
      const [catalog,tags]=await Promise.all([catalogPromise,tagsPromise]);
      if (request!==generation) return;
      const initial=literalMatches(catalog,{},term);
      exactSection.hidden=!initial.exact.length;exactResults.innerHTML=cards(initial.exact,tags);
      active=initial.related;await showMore(request);
      if (request!==generation) return;
      let literal=initial;
      if (term) {
        bodiesPromise ||= loadJson('search-text.json').catch(error=>{bodiesPromise=undefined;throw error;});
        const bodies=await bodiesPromise;
        if (request!==generation) return;
        literal=literalMatches(catalog,bodies,term);
        active=literal.related;
        // タイトル・タグの一致は先頭のまま、本文一致を続けて表示する。
        const slice=active.slice(shown,100);results.insertAdjacentHTML('beforeend',cards(slice,tags));shown+=slice.length;
        updateCount();
      }
      status.textContent=active.length || literal.exact.length ? '' : '一致するノートがありません。';
      if (term) void addSemantic(term,catalog,literal,request);
    } catch {
      if (request===generation) status.textContent='読み込めませんでした。通信状況を確認して再度検索してください。';
    }
  }
  function cancelPendingSearch() {clearTimeout(timer);generation++;semanticStatus.textContent='';}
  form.addEventListener('submit',event=>{event.preventDefault();cancelPendingSearch();syncLocation();search();});
  query.addEventListener('input',()=>{cancelPendingSearch();timer=setTimeout(()=>{syncLocation();search();},220);});
  more.addEventListener('click',()=>showMore(generation).catch(()=>{status.textContent='続きを表示できませんでした。';}));
  window.addEventListener('popstate',()=>{cancelPendingSearch();readLocation();search();});
  readLocation();search();if(location.hash==='#q') query.focus();
}
import('./trail.js'+version).then(module=>module.mountTrail(base)).catch(console.error);
import('./related.js'+version).then(module=>module.mountRelated(base,version)).catch(console.error);
