const { LAST_REVIEWED, TIMELINE } = require('../src/history');

describe('history data integrity', () => {
  test('LAST_REVIEWED is a valid ISO date', () => {
    expect(/^\d{4}-\d{2}-\d{2}$/.test(LAST_REVIEWED)).toBe(true);
    expect(Number.isNaN(new Date(LAST_REVIEWED).getTime())).toBe(false);
  });

  test('every entry has a unique id', () => {
    const ids = TIMELINE.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every entry has a plausible year, non-empty title/body/citation, and a real https URL', () => {
    for (const entry of TIMELINE) {
      expect(entry.year).toBeGreaterThanOrEqual(1900);
      expect(entry.year).toBeLessThanOrEqual(2030);
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.body.length).toBeGreaterThan(0);
      expect(entry.citation.length).toBeGreaterThan(0);
      expect(entry.url.startsWith('https://')).toBe(true);
    }
  });

  test('the timeline is in chronological order', () => {
    for (let i = 1; i < TIMELINE.length; i++) {
      expect(TIMELINE[i].year).toBeGreaterThanOrEqual(TIMELINE[i - 1].year);
    }
  });

  test('no entry body reproduces a long verbatim quotation (copyright hygiene)', () => {
    // A crude but effective check: no run of 15+ consecutive words wrapped
    // in curly/straight quotes, which would indicate an extended verbatim
    // quotation rather than a short, properly-scoped phrase.
    const longQuotePattern = /["\u201c]([^"\u201d]{100,})["\u201d]/;
    for (const entry of TIMELINE) {
      const match = longQuotePattern.exec(entry.body);
      if (match) {
        const wordCount = match[1].trim().split(/\s+/).length;
        expect(wordCount).toBeLessThan(15);
      }
    }
  });

  test('covers the key milestones this project depends on', () => {
    const ids = TIMELINE.map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining(['ordinance-1910', 'buchanan-1917', 'holc-1937', 'legacy-today'])
    );
  });
});
