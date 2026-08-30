(function () {
  const { TIMELINE } = window.History;
  const { NEIGHBORHOODS } = window.HolcNeighborhoods;

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  document.getElementById('neighborhood-sources').innerHTML = NEIGHBORHOODS.map(
    (n) => `
    <div class="source-entry">
      <a href="${n.url}" target="_blank" rel="noopener">${escapeHTML(n.name)} (Grade ${n.grade}) \u2014 ${escapeHTML(n.citation)}</a>
      <p>${escapeHTML(n.summary)}</p>
    </div>
  `
  ).join('');

  document.getElementById('history-sources').innerHTML = TIMELINE.map(
    (t) => `
    <div class="source-entry">
      <a href="${t.url}" target="_blank" rel="noopener">${t.year} \u2014 ${escapeHTML(t.title)}</a>
      <p>${escapeHTML(t.citation)}</p>
    </div>
  `
  ).join('');
})();
