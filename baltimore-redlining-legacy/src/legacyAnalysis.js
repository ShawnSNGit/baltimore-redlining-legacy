/**
 * legacyAnalysis.js
 *
 * Pure join/aggregation logic connecting the curated historic HOLC
 * grade table (holcNeighborhoods.js) to live present-day vacant
 * building notice counts (vacancyApi.js). No network access here —
 * this just combines data already fetched, so it's fully unit-testable
 * with hand-built fixtures.
 */

const GRADE_ORDER = ['A', 'B', 'C', 'D'];

/**
 * @param {Array} neighborhoods - entries from holcNeighborhoods.NEIGHBORHOODS
 * @param {Array} vacancyResults - entries from vacancyApi.countVacantNoticesForNeighborhoods
 * @returns {Array} neighborhoods enriched with their live vacancy count
 */
function joinGradeAndVacancy(neighborhoods, vacancyResults) {
  const byName = new Map(vacancyResults.map((r) => [r.neighborhood, r]));
  return neighborhoods.map((n) => {
    const match = byName.get(n.name);
    return {
      ...n,
      vacantNoticeCount: match ? match.count : null,
      vacancyError: match ? match.error : 'No data returned for this neighborhood.',
    };
  });
}

/**
 * Groups joined records by HOLC grade and computes, for each grade, the
 * total and average vacant notice count among neighborhoods that
 * returned a valid (non-null) count.
 */
function summarizeByGrade(joinedRecords) {
  const groups = new Map(GRADE_ORDER.map((g) => [g, []]));
  for (const r of joinedRecords) {
    if (!groups.has(r.grade)) groups.set(r.grade, []);
    groups.get(r.grade).push(r);
  }

  return GRADE_ORDER.filter((g) => groups.has(g)).map((grade) => {
    const records = groups.get(grade);
    const withCounts = records.filter((r) => typeof r.vacantNoticeCount === 'number');
    const total = withCounts.reduce((sum, r) => sum + r.vacantNoticeCount, 0);
    return {
      grade,
      neighborhoodCount: records.length,
      reportingNeighborhoodCount: withCounts.length,
      totalVacantNotices: withCounts.length ? total : null,
      avgVacantNoticesPerNeighborhood: withCounts.length ? total / withCounts.length : null,
    };
  });
}

/**
 * True if the grade-level averages are monotonically non-decreasing
 * from A to D (i.e., the classic redlining pattern: worse historic
 * grade, more present-day vacancy) among grades with reporting data.
 * Returns null if fewer than 2 grades have data to compare.
 */
function showsClassicGradient(gradeSummaries) {
  const withData = gradeSummaries.filter((g) => g.avgVacantNoticesPerNeighborhood !== null);
  if (withData.length < 2) return null;
  for (let i = 1; i < withData.length; i++) {
    if (withData[i].avgVacantNoticesPerNeighborhood < withData[i - 1].avgVacantNoticesPerNeighborhood) {
      return false;
    }
  }
  return true;
}

const LegacyAnalysisModule = { GRADE_ORDER, joinGradeAndVacancy, summarizeByGrade, showsClassicGradient };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LegacyAnalysisModule;
}
if (typeof window !== 'undefined') {
  window.LegacyAnalysis = LegacyAnalysisModule;
}
