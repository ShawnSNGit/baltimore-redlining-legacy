/**
 * history.js
 *
 * A cited timeline of Baltimore's housing segregation history, from the
 * nation's first racial zoning ordinance through today. Written in our
 * own words from multiple primary and secondary sources — never copied
 * — with a citation on every entry. See ARCHITECTURE.md for the full
 * source list and how disputed or approximate facts are handled.
 *
 * This is reference content, not breaking news — it doesn't need a
 * freshness-check workflow the way current-events content would, since
 * the history itself doesn't change. What *can* change is scholarship
 * and newly digitized sources, so entries are still dated to when they
 * were last checked against a source.
 */

const LAST_REVIEWED = '2026-08-30';

const TIMELINE = [
  {
    id: 'ordinance-1910',
    year: 1910,
    title: "Baltimore passes the nation's first racial zoning ordinance",
    body:
      "In the summer of 1910, Black attorney W. Ashbie Hawkins bought a home on McCulloh Street in an all-white block and rented it to his law partner George McMechen, a Black Yale Law graduate. White neighbors organized in response, and in December 1910 the City Council passed Ordinance 610 (the 'West Plan'), barring Black residents from moving onto blocks that were majority white, and white residents from moving onto blocks that were majority Black. It was the first law of its kind in the country, and other cities soon copied it.",
    citation: 'Maryland Center for History and Culture, "Baltimore\u2019s Pursuit of Fair Housing: A Brief History"',
    url: 'https://www.mdhistory.org/baltimores-pursuit-of-fair-housing-a-brief-history/',
  },
  {
    id: 'covenants-1910s-40s',
    year: 1913,
    title: 'Restrictive covenants take over where zoning left off',
    body:
      "Private developers had already begun writing racial exclusion directly into property deeds even before the zoning ordinance was struck down, and covenants became the dominant tool afterward. The Roland Park Company's deeds for Roland Park and its Guilford extension barred occupancy by any person of Black descent, and the company physically walled off Guilford along York Road. Neighborhood associations citywide adopted similar covenants and worked with the city's Committee on Segregation to sue to evict Black families who bought in violation of one.",
    citation: 'Johns Hopkins News-Letter, "Roland Park bears legacy of racial exclusion"; Wikipedia, "Roland Park, Baltimore" (sourced to Roland Park Co. deed records)',
    url: 'https://www.jhunewsletter.com/article/2016/11/roland-park-bears-legacy-of-racial-exclusion/',
  },
  {
    id: 'buchanan-1917',
    year: 1917,
    title: 'Buchanan v. Warley strikes down explicit racial zoning \u2014 but the city adapts',
    body:
      "The U.S. Supreme Court struck down racial zoning ordinances like Baltimore's, but on narrow grounds: it held they violated a white property owner's right to sell to whomever he chose, not that segregation itself was unconstitutional. Baltimore's mayor responded by directing city building and health inspectors to cite code violations against any owner who sold or rented to a Black family in a white neighborhood, and later formalized this through an official Committee on Segregation.",
    citation: 'Economic Policy Institute, "From Ferguson to Baltimore: The Fruits of Government-Sponsored Segregation"',
    url: 'https://www.epi.org/blog/from-ferguson-to-baltimore-the-fruits-of-government-sponsored-segregation/',
  },
  {
    id: 'holc-1937',
    year: 1937,
    title: "The HOLC grades Baltimore's neighborhoods \u2014 and coins redlining",
    body:
      "The federal Home Owners' Loan Corporation published a 'Residential Security Map' of Baltimore, grading neighborhoods A ('Best', green) through D ('Hazardous', red) for mortgage risk, based on input from local lenders and real estate agents. The grading criteria explicitly factored in the race and immigrant status of an area's residents. Overwhelmingly white, affluent areas like Roland Park and Guilford were graded A; many of the city's Black neighborhoods, concentrated in East and West Baltimore, were graded D \u2014 \u2018redlined\u2019 \u2014 which choked off conventional mortgage credit there for decades.",
    citation: 'Mapping Inequality: Redlining in New Deal America (Nelson, Winling, Marciano, Connolly, et al., Digital Scholarship Lab, University of Richmond)',
    url: 'https://dsl.richmond.edu/panorama/redlining/map/MD/Baltimore/context',
  },
  {
    id: 'shelley-1948',
    year: 1948,
    title: 'Shelley v. Kraemer ends court enforcement of racial covenants',
    body:
      'The Supreme Court held that while private parties could still sign racially restrictive covenants, courts could no longer enforce them \u2014 doing so would make the state a party to the discrimination. Baltimore covenants like Roland Park\u2019s were no longer legally enforceable, though segregation in those neighborhoods persisted for decades through informal practice.',
    citation: 'Maryland Center for History and Culture, "Baltimore\u2019s Pursuit of Fair Housing: A Brief History"',
    url: 'https://www.mdhistory.org/baltimores-pursuit-of-fair-housing-a-brief-history/',
  },
  {
    id: 'urban-renewal-1950s',
    year: 1950,
    title: "Urban renewal and highway construction reroute the damage, not undo it",
    body:
      "Postwar 'slum clearance' and highway projects \u2014 including what's now called the 'Highway to Nowhere' through West Baltimore \u2014 demolished thousands of homes in Black neighborhoods, displacing residents into high-rise public housing built, in the government's own words at the time, to 'block the Negro from encroaching upon white territory' rather than to relieve overcrowding.",
    citation: 'Wikipedia, "Roland Park, Baltimore" (citing period government housing project records)',
    url: 'https://en.wikipedia.org/wiki/Roland_Park,_Baltimore',
  },
  {
    id: 'legacy-today',
    year: 2022,
    title: "The legacy shows up in health, safety, and environment data today",
    body:
      "Multiple peer-reviewed studies have found that neighborhoods graded lower by the 1930s HOLC maps have measurably worse present-day outcomes: a Baltimore-focused study found historic HOLC grade associated with present-day life expectancy and mortality; a Federal Reserve study found formerly redlined areas have significantly higher present-day flood and heat exposure; and a Baltimore hospital-data study found a strong association between historic redlining and present-day firearm injury rates. None of these show redlining as the sole cause of today's disparities \u2014 but they show its fingerprints are still measurable, nearly a century later.",
    citation:
      'PLOS ONE, "Association of historic redlining and present-day health in Baltimore" (2022); Federal Reserve Bank of Richmond, "Long-Term Effects of Redlining on Environmental Risk Exposure"; PMC, "Examining the Influence of Historical Redlining on Firearm Injuries in Current Day Baltimore, Maryland"',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0261028',
  },
];

const HistoryModule = { LAST_REVIEWED, TIMELINE };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HistoryModule;
}
if (typeof window !== 'undefined') {
  window.History = HistoryModule;
}
