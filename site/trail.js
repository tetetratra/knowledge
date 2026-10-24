// 再読み込みでは追加せず、履歴へ戻った場合はその位置を再利用する。
export function visitTrail(state, page, historyId, newId) {
  let entries = [...state.entries];
  let cursor = entries.findIndex(item => item.id === historyId && item.url === page.url);
  if (cursor < 0) cursor = entries.findIndex(item => item.id === state.pendingId && item.url === page.url);
  if (cursor < 0 && entries[state.cursor]?.url === page.url) cursor = state.cursor;
  if (cursor < 0) {
    entries = entries.slice(0, state.cursor + 1);
    entries.push({ ...page, id: newId });
    cursor = entries.length - 1;
  } else entries[cursor] = { ...entries[cursor], title: page.title };
  const offset = Math.max(0, entries.length - 40);
  return { entries: entries.slice(offset), cursor: cursor - offset };
}

export function mountTrail(base) {
  const nav = document.querySelector('#visit-trail');
  if (!nav) return;
  const key = 'knowledge:trail:' + base;
  const notePattern = new RegExp('^' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 'notes/[a-f0-9]{16}/$');
  let fallback = { entries: [], cursor: -1 };
  function read() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(key));
      if (!stored || !Array.isArray(stored.entries)) return fallback;
      const entries = stored.entries.slice(-40).filter(item => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.url === 'string' && notePattern.test(item.url));
      const cursor = Number.isInteger(stored.cursor) ? Math.max(-1, Math.min(stored.cursor, entries.length - 1)) : entries.length - 1;
      return { entries, cursor, pendingId: stored.pendingId };
    } catch { return fallback; }
  }
  function save(state) {
    fallback = state;
    try { sessionStorage.setItem(key, JSON.stringify(state)); } catch { /* 保存不可でも閲覧は続ける。 */ }
  }
  function render(state) {
    nav.replaceChildren();
    const visible = state.entries.slice(Math.max(0, state.cursor - 9), state.cursor + 1);
    nav.hidden = !visible.length;
    if (!visible.length) return;
    const label = document.createElement('span'); label.className = 'trail-label'; label.textContent = '履歴';
    const list = document.createElement('ol');
    for (const item of visible) {
      const li = document.createElement('li');
      const current = item.url === location.pathname && item.id === state.entries[state.cursor]?.id;
      const element = document.createElement(current ? 'span' : 'a');
      element.textContent = item.title; element.title = item.title;
      if (current) element.setAttribute('aria-current', 'page');
      else { element.href = item.url; element.dataset.trailId = item.id; }
      li.append(element); list.append(li);
    }
    nav.append(label, list);
    list.scrollLeft = list.scrollWidth;
  }
  function refresh() {
    let state = read();
    const title = document.querySelector('.reading h1');
    if (title && notePattern.test(location.pathname)) {
      state = visitTrail(state, { url: location.pathname, title: title.textContent }, history.state?.knowledgeTrailId, crypto.randomUUID());
      save(state);
      try { history.replaceState({ ...history.state, knowledgeTrailId: state.entries[state.cursor].id }, ''); } catch { /* 履歴APIが制限されても本文は表示する。 */ }
    }
    render(state);
  }
  nav.addEventListener('click', event => {
    const link = event.target.closest('a[data-trail-id]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const state = read();
    const cursor = state.entries.findIndex(item => item.id === link.dataset.trailId);
    if (cursor >= 0) save({ ...state, cursor, pendingId: link.dataset.trailId });
  });
  window.addEventListener('pageshow', refresh);
  window.addEventListener('popstate', refresh);
  refresh();
}
