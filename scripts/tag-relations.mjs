import { normalizeTitle, sortNotes } from '../site/knowledge.js';

// タグのリンク先を親、その逆向きのリンク元を子とする。
export function tagRelations(pages, tagPages) {
  const byUrl = new Map(pages.map(page => [page.url, page]));
  const relations = new Map(pages.map(page => [page.id, {parents:[], children:[]}]));
  for (const page of pages) {
    const seen = new Set([page.id]);
    for (const tag of page.tags || []) {
      const parent = byUrl.get(tagPages[normalizeTitle(tag)]);
      if (!parent || seen.has(parent.id)) continue;
      seen.add(parent.id);
      relations.get(page.id).parents.push(parent);
      relations.get(parent.id).children.push(page);
    }
  }
  for (const relation of relations.values()) {
    relation.parents = sortNotes(relation.parents);
    relation.children = sortNotes(relation.children);
  }
  return relations;
}
