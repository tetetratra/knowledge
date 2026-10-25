export const normalizeTitle = value => value.normalize('NFKC').trim().toLowerCase();
export function sortNotes(pages) {
  return [...pages].sort((a,b)=>(b.updatedAt || 0)-(a.updatedAt || 0) || a.title.localeCompare(b.title,'ja'));
}

export function literalMatches(catalog, bodies, term) {
  const query=normalizeTitle(term);
  if (!query) return {exact:[],related:sortNotes(catalog)};
  const words=query.split(/\s+/);
  const matches=text=>words.every(word=>normalizeTitle(text).includes(word));
  const tier=page=>normalizeTitle(page.title)===query ? 0 : matches(page.title) ? 1 : matches(page.tags.join(' ')) ? 2 : matches(bodies[page.id] || '') ? 3 : 4;
  const ranked=catalog.map(page=>({page,tier:tier(page)})).filter(item=>item.tier<4)
    .sort((a,b)=>a.tier-b.tier || (b.page.updatedAt || 0)-(a.page.updatedAt || 0) || a.page.title.localeCompare(b.page.title,'ja'));
  return {exact:ranked.filter(item=>item.tier===0).map(item=>item.page),related:ranked.filter(item=>item.tier>0).map(item=>item.page)};
}

export function appendSemantic(catalog, literal, semantic) {
  const seen=new Set([...literal.exact,...literal.related].map(page=>page.id));
  const byId=new Map(catalog.map(page=>[page.id,page]));
  return semantic.flatMap(({id})=>{
    if (seen.has(id) || !byId.has(id)) return [];
    seen.add(id);return [byId.get(id)];
  });
}
