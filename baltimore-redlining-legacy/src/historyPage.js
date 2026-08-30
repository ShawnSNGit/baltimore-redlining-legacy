(function () {
  const { TIMELINE } = window.History;
  const container = document.getElementById('timeline-container');

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  container.innerHTML = TIMELINE.map(
    (entry) => `
    <div class="timeline-entry">
      <p class="te-year">${entry.year}</p>
      <h3>${escapeHTML(entry.title)}</h3>
      <p>${escapeHTML(entry.body)}</p>
      <p class="te-citation">Source: <a href="${entry.url}" target="_blank" rel="noopener">${escapeHTML(entry.citation)}</a></p>
    </div>
  `
  ).join('');
})();
