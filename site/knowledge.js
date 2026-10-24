export const normalizeTitle = value => value.normalize('NFKC').trim().toLowerCase();

export function sortNotes(pages, order = 'connections') {
  return [...pages].sort((a, b) =>
    (order === 'updated' ? 0 : b.connections - a.connections) ||
    b.updatedAt - a.updatedAt || a.title.localeCompare(b.title, 'ja'));
}

function searchTier(page, term) {
  const words = normalizeTitle(term).split(/\s+/);
  const matches = text => words.every(word => normalizeTitle(text).includes(word));
  if (matches(page.title)) return 0;
  if (matches(page.tags.join(' '))) return 1;
  return 2;
}

export function splitMatches(catalog, matched, term, order) {
  if (!term.trim()) return { exact: [], related: sortNotes(catalog, order) };
  const exact = catalog.filter(page => normalizeTitle(page.title) === normalizeTitle(term));
  const exactIds = new Set(exact.map(page => page.id));
  const candidates = new Map(matched.map(page => [page.id, page]));
  // 検索エンジンが単語の区切りで落としたタイトル・タグの部分一致も拾う。
  for (const page of catalog) if (searchTier(page, term) < 2 && !candidates.has(page.id)) candidates.set(page.id, page);
  const related = [...candidates.values()].filter(page => !exactIds.has(page.id)).sort((a, b) =>
    searchTier(a, term) - searchTier(b, term) ||
    (a.searchRank ?? Number.MAX_SAFE_INTEGER) - (b.searchRank ?? Number.MAX_SAFE_INTEGER) ||
    a.title.localeCompare(b.title, 'ja'));
  return { exact: sortNotes(exact), related };
}
