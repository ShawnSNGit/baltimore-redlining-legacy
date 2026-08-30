/**
 * vacancyApi.js
 *
 * Live client for Baltimore City DHCD's "Vacant Building Notice - Open"
 * layer — the same confirmed endpoint and field schema used in this
 * author's companion "Baltimore Vacant Property Watch" tool:
 *
 *   https://egisdata.baltimorecity.gov/egis/rest/services/Housing/
 *     DHCD_Open_Baltimore_Datasets/FeatureServer/1
 *   Confirmed fields: NoticeNum, DateNotice, DateCancel, DateAbate, NT,
 *     OWNER_ABBR, HousingMarketTypology2023, Council_District,
 *     Neighborhood, BLOCKLOT, Address
 *
 * Here it's queried per-neighborhood (a LIKE match on the confirmed
 * `Neighborhood` field) to count how many currently-open vacant
 * building notices exist in each of the specific historically-graded
 * neighborhoods in holcNeighborhoods.js.
 */

const BASE_URL =
  'https://egisdata.baltimorecity.gov/egis/rest/services/Housing/DHCD_Open_Baltimore_Datasets/FeatureServer/1/query';

function escapeSql(str) {
  return String(str).replace(/'/g, "''");
}

function buildNeighborhoodCountUrl(neighborhoodName) {
  const normalized = String(neighborhoodName || '').trim();
  if (!normalized) throw new Error('neighborhoodName must not be empty.');
  const params = new URLSearchParams({
    where: `UPPER(Neighborhood) LIKE '%${escapeSql(normalized.toUpperCase())}%'`,
    outFields: 'OBJECTID,Neighborhood,DateNotice',
    f: 'json',
    returnCountOnly: 'true',
  });
  return `${BASE_URL}?${params.toString()}`;
}

function assertNoApiError(json) {
  if (json && json.error) {
    throw new Error(`Baltimore open data API error: ${json.error.message || 'unknown error'}`);
  }
}

async function getFetch(options) {
  const hasExplicit = Object.prototype.hasOwnProperty.call(options, 'fetchImpl');
  const fetchImpl = hasExplicit ? options.fetchImpl : typeof fetch !== 'undefined' ? fetch : null;
  if (!fetchImpl) throw new Error('No fetch implementation available. Pass options.fetchImpl in this environment.');
  return fetchImpl;
}

/** Returns the count of currently-open vacant building notices whose
 * Neighborhood field matches (partial, case-insensitive) the given name. */
async function countVacantNoticesForNeighborhood(neighborhoodName, options = {}) {
  const fetchImpl = await getFetch(options);
  const url = buildNeighborhoodCountUrl(neighborhoodName);
  const res = await fetchImpl(url);
  if (!res.ok) throw new Error(`Request to Baltimore open data API failed with status ${res.status}`);
  const json = await res.json();
  assertNoApiError(json);
  if (typeof json.count !== 'number') {
    throw new Error('Unexpected response shape from the vacant building notice service (no count field).');
  }
  return json.count;
}

/** Fetches live counts for every neighborhood in a list, sequentially,
 * tolerating individual failures so one bad request doesn't sink the rest. */
async function countVacantNoticesForNeighborhoods(neighborhoodNames, options = {}) {
  const results = [];
  for (const name of neighborhoodNames) {
    try {
      const count = await countVacantNoticesForNeighborhood(name, options);
      results.push({ neighborhood: name, count, error: null });
    } catch (err) {
      results.push({ neighborhood: name, count: null, error: err.message });
    }
  }
  return results;
}

const VacancyApiModule = {
  BASE_URL,
  buildNeighborhoodCountUrl,
  assertNoApiError,
  countVacantNoticesForNeighborhood,
  countVacantNoticesForNeighborhoods,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VacancyApiModule;
}
if (typeof window !== 'undefined') {
  window.VacancyApi = VacancyApiModule;
}
