const {
  buildNeighborhoodCountUrl,
  assertNoApiError,
  countVacantNoticesForNeighborhood,
  countVacantNoticesForNeighborhoods,
  BASE_URL,
} = require('../src/vacancyApi');

describe('buildNeighborhoodCountUrl', () => {
  test('targets the confirmed FeatureServer endpoint', () => {
    const url = buildNeighborhoodCountUrl('Sandtown-Winchester');
    expect(url.startsWith(BASE_URL + '?')).toBe(true);
  });

  test('uses a case-insensitive partial match and requests count-only', () => {
    const url = decodeURIComponent(buildNeighborhoodCountUrl('Sandtown-Winchester').replace(/\+/g, ' '));
    expect(url).toContain("UPPER(Neighborhood) LIKE '%SANDTOWN-WINCHESTER%'");
    expect(url).toContain('returnCountOnly=true');
  });

  test('escapes single quotes in the neighborhood name', () => {
    const url = decodeURIComponent(buildNeighborhoodCountUrl("O'Donnell Heights").replace(/\+/g, ' '));
    expect(url).toContain("O''DONNELL HEIGHTS");
  });

  test('throws on an empty name', () => {
    expect(() => buildNeighborhoodCountUrl('  ')).toThrow(/must not be empty/);
  });
});

describe('assertNoApiError', () => {
  test('throws on an API error payload', () => {
    expect(() => assertNoApiError({ error: { message: 'bad request' } })).toThrow(/Baltimore open data API error/);
  });
});

describe('countVacantNoticesForNeighborhood (mocked fetch)', () => {
  test('returns the count from a well-formed count-only response', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 42 }) });
    const count = await countVacantNoticesForNeighborhood('Sandtown-Winchester', { fetchImpl: mockFetch });
    expect(count).toBe(42);
  });

  test('handles a real "zero results" response correctly (not an error)', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 0 }) });
    const count = await countVacantNoticesForNeighborhood('Roland Park', { fetchImpl: mockFetch });
    expect(count).toBe(0);
  });

  test('throws a clear error if the response is missing the expected count field', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ features: [] }) });
    await expect(countVacantNoticesForNeighborhood('Roland Park', { fetchImpl: mockFetch })).rejects.toThrow(
      /Unexpected response shape/
    );
  });

  test('throws a clear error on a non-OK HTTP status', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 502 });
    await expect(countVacantNoticesForNeighborhood('Roland Park', { fetchImpl: mockFetch })).rejects.toThrow(/502/);
  });
});

describe('countVacantNoticesForNeighborhoods (mocked fetch, batch)', () => {
  test('fetches a count for each neighborhood independently', async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ count: 5 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ count: 90 }) });
    const results = await countVacantNoticesForNeighborhoods(['Roland Park', 'Sandtown-Winchester'], {
      fetchImpl: mockFetch,
    });
    expect(results).toEqual([
      { neighborhood: 'Roland Park', count: 5, error: null },
      { neighborhood: 'Sandtown-Winchester', count: 90, error: null },
    ]);
  });

  test('one failing neighborhood does not prevent the others from returning data', async () => {
    const mockFetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('network hiccup'))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ count: 12 }) });
    const results = await countVacantNoticesForNeighborhoods(['Broken Neighborhood', 'Working Neighborhood'], {
      fetchImpl: mockFetch,
    });
    expect(results[0].count).toBeNull();
    expect(results[0].error).toMatch(/network hiccup/);
    expect(results[1].count).toBe(12);
  });
});
