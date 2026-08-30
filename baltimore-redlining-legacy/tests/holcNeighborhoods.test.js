const { NEIGHBORHOODS } = require('../src/holcNeighborhoods');

describe('holcNeighborhoods data integrity', () => {
  test('every neighborhood has a unique id and unique name', () => {
    const ids = NEIGHBORHOODS.map((n) => n.id);
    const names = NEIGHBORHOODS.map((n) => n.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });

  test('every grade is a valid HOLC letter grade', () => {
    for (const n of NEIGHBORHOODS) {
      expect(['A', 'B', 'C', 'D']).toContain(n.grade);
    }
  });

  test('gradeColor matches the standard HOLC color for its letter grade', () => {
    const expected = { A: 'green', B: 'blue', C: 'yellow', D: 'red' };
    for (const n of NEIGHBORHOODS) {
      expect(n.gradeColor).toBe(expected[n.grade]);
    }
  });

  test('every entry has a non-empty summary, citation, and a real, well-formed URL', () => {
    for (const n of NEIGHBORHOODS) {
      expect(n.summary.length).toBeGreaterThan(0);
      expect(n.citation.length).toBeGreaterThan(0);
      expect(/^https?:\/\//.test(n.url)).toBe(true);
    }
  });

  test('includes at least one neighborhood from each end of the grading scale (the actual point of this dataset)', () => {
    const grades = NEIGHBORHOODS.map((n) => n.grade);
    expect(grades).toContain('A');
    expect(grades).toContain('D');
  });

  test('baltimoreOpenDataName is present for every entry (needed to query the live vacancy data)', () => {
    for (const n of NEIGHBORHOODS) {
      expect(n.baltimoreOpenDataName.length).toBeGreaterThan(0);
    }
  });
});
