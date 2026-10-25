// ビルド時とブラウザで同じ量子化済みテーブルからベクトルを作る。
export function embedTokens(ids, weights, scales, dimensions) {
  const vector = new Float32Array(dimensions);
  for (const id of ids) {
    if (id <= 3 || id >= 32701) continue;
    const offset = id * dimensions;
    for (let d = 0; d < dimensions; d++) vector[d] += weights[offset + d] * scales[id];
  }
  const norm = Math.hypot(...vector);
  if (norm) for (let d = 0; d < dimensions; d++) vector[d] /= norm;
  return vector;
}

export function semanticMatches(query, vectors, ids, dimensions, limit = 20, threshold = 0.3) {
  const scores = new Map();
  for (let i = 0; i < ids.length; i++) {
    let score = 0;
    for (let d = 0; d < dimensions; d++) score += query[d] * vectors[i * dimensions + d];
    scores.set(ids[i], Math.max(scores.get(ids[i]) ?? -1, score));
  }
  return [...scores].filter(([,score]) => score >= threshold)
    .sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0,limit).map(([id,score]) => ({id,score}));
}
