(function () {
  const { NEIGHBORHOODS } = window.HolcNeighborhoods;
  const { countVacantNoticesForNeighborhoods } = window.VacancyApi;
  const { joinGradeAndVacancy, summarizeByGrade, showsClassicGradient } = window.LegacyAnalysis;

  const loadStatus = document.getElementById('load-status');
  const cardsContainer = document.getElementById('neighborhood-cards');
  const summaryCard = document.getElementById('summary-card');
  const barsContainer = document.getElementById('grade-summary-bars');
  const gradientNote = document.getElementById('gradient-note');

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function renderLoadingCards() {
    cardsContainer.innerHTML = NEIGHBORHOODS.map(
      (n) => `
      <div class="neighborhood-card" id="card-${n.id}">
        <span class="grade-badge grade-${n.grade}">${n.grade}</span>
        <div>
          <p class="nb-name">${escapeHTML(n.name)}</p>
          <p class="nb-summary">${escapeHTML(n.summary)}</p>
          <p class="nb-live loading">Loading current vacant notice count\u2026</p>
          <p class="nb-citation">Grade source: <a href="${n.url}" target="_blank" rel="noopener">${escapeHTML(n.citation)}</a></p>
        </div>
      </div>
    `
    ).join('');
  }

  function updateCardLive(joined) {
    for (const n of joined) {
      const el = document.querySelector(`#card-${n.id} .nb-live`);
      if (!el) continue;
      el.classList.remove('loading');
      if (typeof n.vacantNoticeCount === 'number') {
        const cls = n.vacantNoticeCount >= 20 ? 'high' : n.vacantNoticeCount === 0 ? 'low' : '';
        el.className = `nb-live ${cls}`;
        el.textContent = `${n.vacantNoticeCount} open vacant building notice${n.vacantNoticeCount === 1 ? '' : 's'} right now`;
      } else {
        el.textContent = `Couldn't load live data: ${n.vacancyError}`;
      }
    }
  }

  function renderGradeSummary(gradeSummaries) {
    const maxAvg = Math.max(...gradeSummaries.map((g) => g.avgVacantNoticesPerNeighborhood || 0), 1);
    barsContainer.innerHTML = gradeSummaries
      .map((g) => {
        const pct = g.avgVacantNoticesPerNeighborhood ? (g.avgVacantNoticesPerNeighborhood / maxAvg) * 100 : 0;
        const label =
          g.avgVacantNoticesPerNeighborhood === null
            ? 'no data'
            : g.avgVacantNoticesPerNeighborhood.toFixed(1);
        return `
          <div class="grade-summary-row">
            <span class="grade-badge grade-${g.grade} gs-label">${g.grade}</span>
            <div class="gs-bar-track"><div class="gs-bar-fill grade-${g.grade}" style="width:${pct}%"></div></div>
            <span class="gs-value">${label}</span>
          </div>
        `;
      })
      .join('');

    const gradient = showsClassicGradient(gradeSummaries);
    if (gradient === true) {
      gradientNote.textContent =
        'In this sample, average vacancy rises from A to D \u2014 consistent with the pattern published research has found citywide.';
    } else if (gradient === false) {
      gradientNote.textContent =
        "In this small sample, the pattern isn't a clean A-to-D climb \u2014 five neighborhoods is a small sample, and this is exactly why the Sources page says not to treat this as citywide proof.";
    } else {
      gradientNote.textContent = 'Not enough live data returned to compare grades right now.';
    }
  }

  async function load() {
    renderLoadingCards();
    try {
      const names = NEIGHBORHOODS.map((n) => n.baltimoreOpenDataName);
      const vacancyResults = await countVacantNoticesForNeighborhoods(names);
      // vacancyResults are keyed by baltimoreOpenDataName; re-key to `name` for the join
      const rekeyed = vacancyResults.map((r, i) => ({ ...r, neighborhood: NEIGHBORHOODS[i].name }));
      const joined = joinGradeAndVacancy(NEIGHBORHOODS, rekeyed);
      updateCardLive(joined);

      const anySuccess = joined.some((n) => typeof n.vacantNoticeCount === 'number');
      loadStatus.textContent = anySuccess
        ? 'Live data loaded from Baltimore City.'
        : "Couldn't load live data from Baltimore City right now \u2014 showing historic information only.";

      if (anySuccess) {
        const gradeSummaries = summarizeByGrade(joined);
        renderGradeSummary(gradeSummaries);
        summaryCard.style.display = 'block';
      }
    } catch (err) {
      loadStatus.textContent = `Couldn't load live data: ${err.message}`;
    }
  }

  load();
})();
