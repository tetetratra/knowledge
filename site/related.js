export function sortRelated(pages, order) {
  return [...pages].sort((a,b) =>
    (order === 'updated' ? b.updatedAt - a.updatedAt : 0) ||
    b.score - a.score || a.id.localeCompare(b.id));
}

export async function mountRelated(base, version) {
  const section = document.querySelector('[data-related-id]');
  if (!section) return;
  const { normalizeTitle } = await import('./knowledge.js' + version);
  const select = section.querySelector('#related-sort');
  const results = section.querySelector('[data-related-results]');
  const more = section.querySelector('[data-related-more]');
  const status = section.querySelector('[data-related-status]');
  const esc = value => String(value).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  let data, shown = 8, generation = 0;
  const load = async file => {
    const response = await fetch(base + file, {cache:'no-cache'});
    if (!response.ok) throw new Error('関連記事を取得できません');
    return response.json();
  };
  function getData() {
    data ||= Promise.all([load('catalog.json'),load('tag-pages.json'),load(`related/${section.dataset.relatedId}.json`)])
      .then(([catalog,tags,links])=>{
        const byId = new Map(catalog.map(page=>[page.id,page]));
        return {tags,pages:links.map(link=>{
          const page = byId.get(link.id);
          if (!page) throw new Error('関連記事が見つかりません');
          return {...page,...link};
        })};
      }).catch(error=>{data=undefined;throw error;});
    return data;
  }
  async function render() {
    const request = ++generation;
    more.disabled = true;
    status.hidden = false; status.textContent = '読み込み中…';
    try {
      const {tags,pages} = await getData();
      if (request !== generation) return;
      const sorted = sortRelated(pages,select.value);
      results.innerHTML = sorted.slice(0,shown).map(page=>{
        const labels = page.sharedTags.length ? page.sharedTags : page.tags;
        return `<article class="note-card"><a class="card-link" href="${esc(page.url)}"><h3>${esc(page.title)}</h3><p>${esc(page.excerpt)}</p></a><div class="card-tags">${labels.slice(0,3).map(tag=>`<a class="tag" href="${esc(tags[normalizeTitle(tag)])}">${esc(tag)}</a>`).join(' ')}</div></article>`;
      }).join('') || '<p class="muted">関連するノートはまだありません。</p>';
      more.hidden = shown >= sorted.length;
      status.hidden = true;
    } catch(error) {
      if (request !== generation) return;
      status.textContent = '関連記事を読み込めませんでした。再度お試しください。';
      console.error(error);
    } finally {if (request === generation) more.disabled = false;}
  }
  select.addEventListener('change',()=>{shown=8;render();});
  more.addEventListener('click',()=>{shown+=8;render();});
  select.disabled = false;
  more.disabled = false;
}
