const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
const stop = new Set('する いる ある なる できる こと もの ため よう これ それ ここ その この から まで について として という また など 場合 the a an of to in for is and or it on with by as be not https http www com jp html'.split(' '));

export function words(text) {
  return Array.from(segmenter.segment(text.normalize('NFKC').toLowerCase()))
    .filter(x => x.isWordLike).map(x => x.segment)
    .filter(x => x.length > 1 && !stop.has(x) && !/^\d+$/.test(x));
}

export function relatedPages(pages, limit = 8) {
  const counts = pages.map(page => {
    const count = new Map();
    // URLや画像ハッシュ、コード断片で関連度が引っ張られることを避ける。
    const prose = page.text.replace(/https?:\/\/[^\s)]+/g, '').replace(/[a-f0-9]{32,}/g, '');
    for (const word of words(prose)) count.set(word, (count.get(word) || 0) + 1);
    for (const word of words(page.title)) count.set(word, (count.get(word) || 0) + 4);
    return count;
  });
  const df = new Map();
  for (const count of counts) for (const word of count.keys()) df.set(word, (df.get(word) || 0) + 1);
  const idf = word => Math.log((pages.length + 1) / ((df.get(word) || 0) + 1)) + 1;
  const vectors = counts.map(count => {
    const entries = Array.from(count, ([word, n]) => [word, (1 + Math.log(n)) * idf(word)])
      .sort((a, b) => b[1] - a[1]).slice(0, 600);
    const norm = Math.sqrt(entries.reduce((sum, [, n]) => sum + n * n, 0)) || 1;
    return new Map(entries.map(([w, n]) => [w, n / norm]));
  });
  const tagCounts = new Map();
  const tags = pages.map(page => new Set(page.tags.map(t => t.normalize('NFKC').toLowerCase())));
  for (const set of tags) for (const tag of set) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  return pages.map((page, i) => pages.flatMap((other, j) => {
    if (i === j) return [];
    let cosine = 0;
    for (const [word, n] of vectors[i]) cosine += n * (vectors[j].get(word) || 0);
    // 稀な共通タグを重視。無関係な本文に一般的なタグ1個だけでは推薦しない。
    let overlap = 0, union = 0;
    for (const tag of new Set([...tags[i], ...tags[j]])) {
      const weight = Math.log((pages.length + 1) / (tagCounts.get(tag) + 1)) + 1;
      union += weight;
      if (tags[i].has(tag) && tags[j].has(tag)) overlap += weight;
    }
    const score = 0.8 * cosine + 0.2 * (union ? overlap / union : 0);
    return score >= 0.09 ? [{ id: other.id, score, sharedTags: page.tags.filter(t => tags[j].has(t.normalize('NFKC').toLowerCase())).slice(0, 3) }] : [];
  }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit));
}
