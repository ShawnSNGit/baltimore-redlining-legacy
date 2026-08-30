const { joinGradeAndVacancy, summarizeByGrade, showsClassicGradient } = require('../src/legacyAnalysis');

const SAMPLE_NEIGHBORHOODS = [
  { id: 'a1', name: 'Alpha', grade: 'A' },
  { id: 'a2', name: 'Alphaville', grade: 'A' },
  { id: 'b1', name: 'Beta', grade: 'B' },
  { id: 'd1', name: 'Delta', grade: 'D' },
];

describe('joinGradeAndVacancy', () => {
  test('attaches the matching vacancy count to each neighborhood by name', () => {
    const vacancyResults = [
      { neighborhood: 'Alpha', count: 2, error: null },
      { neighborhood: 'Alphaville', count: 4, error: null },
      { neighborhood: 'Beta', count: 10, error: null },
      { neighborhood: 'Delta', count: 50, error: null },
    ];
    const joined = joinGradeAndVacancy(SAMPLE_NEIGHBORHOODS, vacancyResults);
    expect(joined.find((n) => n.name === 'Delta').vacantNoticeCount).toBe(50);
  });

  test('marks a neighborhood with no matching vacancy result as having no data, without throwing', () => {
    const joined = joinGradeAndVacancy(SAMPLE_NEIGHBORHOODS, []);
    for (const n of joined) {
      expect(n.vacantNoticeCount).toBeNull();
      expect(n.vacancyError).toMatch(/No data returned/);
    }
  });

  test('preserves a per-neighborhood fetch error instead of silently dropping it', () => {
    const vacancyResults = [{ neighborhood: 'Alpha', count: null, error: 'timeout' }];
    const joined = joinGradeAndVacancy([SAMPLE_NEIGHBORHOODS[0]], vacancyResults);
    expect(joined[0].vacancyError).toBe('timeout');
  });
});

describe('summarizeByGrade', () => {
  test('groups by grade and computes totals/averages only from neighborhoods with valid counts', () => {
    const joined = [
      { ...SAMPLE_NEIGHBORHOODS[0], vacantNoticeCount: 2 },
      { ...SAMPLE_NEIGHBORHOODS[1], vacantNoticeCount: 4 },
      { ...SAMPLE_NEIGHBORHOODS[2], vacantNoticeCount: 10 },
      { ...SAMPLE_NEIGHBORHOODS[3], vacantNoticeCount: 50 },
    ];
    const summary = summarizeByGrade(joined);
    const gradeA = summary.find((s) => s.grade === 'A');
    expect(gradeA.neighborhoodCount).toBe(2);
    expect(gradeA.totalVacantNotices).toBe(6);
    expect(gradeA.avgVacantNoticesPerNeighborhood).toBe(3);
  });

  test('excludes neighborhoods with a null count from the average, but still counts them in neighborhoodCount', () => {
    const joined = [
      { ...SAMPLE_NEIGHBORHOODS[0], vacantNoticeCount: 10 },
      { ...SAMPLE_NEIGHBORHOODS[1], vacantNoticeCount: null },
    ];
    const summary = summarizeByGrade(joined);
    const gradeA = summary.find((s) => s.grade === 'A');
    expect(gradeA.neighborhoodCount).toBe(2);
    expect(gradeA.reportingNeighborhoodCount).toBe(1);
    expect(gradeA.avgVacantNoticesPerNeighborhood).toBe(10);
  });

  test('a grade with zero reporting neighborhoods gets null averages, not zero or NaN', () => {
    const joined = [{ ...SAMPLE_NEIGHBORHOODS[3], vacantNoticeCount: null }];
    const summary = summarizeByGrade(joined);
    const gradeD = summary.find((s) => s.grade === 'D');
    expect(gradeD.avgVacantNoticesPerNeighborhood).toBeNull();
    expect(Number.isNaN(gradeD.avgVacantNoticesPerNeighborhood)).toBe(false);
  });

  test('always reports all four grades A/B/C/D, even ones absent from the input, with zero counts', () => {
    const joined = [
      { ...SAMPLE_NEIGHBORHOODS[3], vacantNoticeCount: 50 },
      { ...SAMPLE_NEIGHBORHOODS[0], vacantNoticeCount: 2 },
      { ...SAMPLE_NEIGHBORHOODS[2], vacantNoticeCount: 10 },
    ];
    const summary = summarizeByGrade(joined);
    expect(summary.map((s) => s.grade)).toEqual(['A', 'B', 'C', 'D']);
    const gradeC = summary.find((s) => s.grade === 'C');
    expect(gradeC.neighborhoodCount).toBe(0);
    expect(gradeC.avgVacantNoticesPerNeighborhood).toBeNull();
  });
});

describe('showsClassicGradient', () => {
  test('returns true when average vacancy rises monotonically from A to D', () => {
    const summary = [
      { grade: 'A', avgVacantNoticesPerNeighborhood: 2 },
      { grade: 'B', avgVacantNoticesPerNeighborhood: 5 },
      { grade: 'D', avgVacantNoticesPerNeighborhood: 40 },
    ];
    expect(showsClassicGradient(summary)).toBe(true);
  });

  test('returns false when a later grade has lower average vacancy than an earlier one', () => {
    const summary = [
      { grade: 'A', avgVacantNoticesPerNeighborhood: 30 },
      { grade: 'D', avgVacantNoticesPerNeighborhood: 5 },
    ];
    expect(showsClassicGradient(summary)).toBe(false);
  });

  test('returns null (not true or false) when fewer than 2 grades have data', () => {
    const summary = [
      { grade: 'A', avgVacantNoticesPerNeighborhood: 30 },
      { grade: 'D', avgVacantNoticesPerNeighborhood: null },
    ];
    expect(showsClassicGradient(summary)).toBeNull();
  });
});
