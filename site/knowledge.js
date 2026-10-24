export const normalizeTitle = value => value.normalize('NFKC').trim().toLowerCase();

export function sortNotes(pages, order = 'connections') {
  return [...pages].sort((a, b) =>
    (order === 'updated' ? 0 : b.connections - a.connections) ||
    b.updatedAt - a.updatedAt || a.title.localeCompare(b.title, 'ja'));
}

export function splitMatches(catalog, matched, term, order) {
  const exact = term.trim() ? catalog.filter(page => normalizeTitle(page.title) === normalizeTitle(term)) : [];
  const exactIds = new Set(exact.map(page => page.id));
  return { exact: sortNotes(exact, order), related: sortNotes(matched.filter(page => !exactIds.has(page.id)), order) };
}
