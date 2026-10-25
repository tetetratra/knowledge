export function mountRelated() {
  for (const group of document.querySelectorAll('[data-related-group]')) {
    const more = group.querySelector('[data-related-more]');
    more.addEventListener('click', () => {
      const hidden = [...group.querySelectorAll('.related-grid > div[hidden]')];
      for (const card of hidden.slice(0, 100)) card.hidden = false;
      more.hidden = hidden.length <= 100;
    });
  }
}
