/**
 * holcNeighborhoods.js
 *
 * IMPORTANT SCOPE NOTE: the 1937 HOLC map graded roughly 42 separate
 * areas across Baltimore. This is NOT a reproduction of the full map —
 * this sandbox couldn't safely obtain or verify the precise polygon
 * geometry for all 42 areas (see ARCHITECTURE.md for why). Instead,
 * this is a small, deliberately curated set of specific, well-documented
 * named neighborhoods whose historic HOLC grade is directly confirmed
 * by a citable secondary source — not an inference, not an estimate.
 *
 * Every entry below cites the specific source that states that specific
 * neighborhood's specific grade. If you can verify additional
 * neighborhoods against a real source, add them following the same
 * pattern — but don't add a grade here without a citation that states
 * it explicitly.
 */

const NEIGHBORHOODS = [
  {
    id: 'roland-park',
    name: 'Roland Park',
    grade: 'A',
    gradeColor: 'green',
    baltimoreOpenDataName: 'Roland Park',
    summary:
      "Baltimore's original planned 'garden suburb' (built starting 1893), whose developer wrote a whites-only occupancy restriction directly into every deed. Graded A ('Best') on the 1937 HOLC map.",
    citation: "Wikipedia, \"Roland Park, Baltimore\" (deed language); The Baltimore Story, \"1937: The Eugenics Color Map\" (grade)",
    url: 'https://www.thebaltimorestory.org/history-1/1937-the-eugenics-color-map',
  },
  {
    id: 'guilford',
    name: 'Guilford',
    grade: 'A',
    gradeColor: 'green',
    baltimoreOpenDataName: 'Guilford',
    summary:
      'Developed as a Roland Park Company extension starting in 1913, with the same racial deed restrictions and a physical wall separating it from neighboring Govans along York Road. Cited as an example of the highest HOLC grade.',
    citation: 'Maryland Center for History and Culture, "Baltimore\u2019s Pursuit of Fair Housing: A Brief History"',
    url: 'https://www.mdhistory.org/baltimores-pursuit-of-fair-housing-a-brief-history/',
  },
  {
    id: 'homeland',
    name: 'Homeland',
    grade: 'B',
    gradeColor: 'blue',
    baltimoreOpenDataName: 'Homeland',
    summary:
      "A planned, restricted North Baltimore neighborhood similar to Roland Park in character, but graded one step below it \u2014 'Still Desirable' rather than 'Best' \u2014 on the 1937 map.",
    citation: 'The Baltimore Story, "1937: The Eugenics Color Map"',
    url: 'https://www.thebaltimorestory.org/history-1/1937-the-eugenics-color-map',
  },
  {
    id: 'govans',
    name: 'Govans',
    grade: 'C',
    gradeColor: 'yellow',
    baltimoreOpenDataName: 'Govans',
    summary:
      "A mixed working- and middle-class area east of York Road, directly across from Guilford's wall. Partly graded C ('Definitely Declining') on the 1937 map.",
    citation: 'Loyola University Maryland, "Information on Redlining, Baltimore, and Subprime Loans" (course materials citing the 1937 HOLC map)',
    url: 'http://math.loyola.edu/~loberbro/Talks/RedliningInfo.html',
  },
  {
    id: 'sandtown-winchester',
    name: 'Sandtown-Winchester',
    grade: 'D',
    gradeColor: 'red',
    baltimoreOpenDataName: 'Sandtown-Winchester',
    summary:
      'A West Baltimore neighborhood graded D ("Hazardous") on the 1937 map. Zip code 21217, which includes Sandtown-Winchester, is still referenced in present-day public health research specifically because of that historic grade \u2014 this is the neighborhood where Freddie Gray lived before his 2015 death in police custody.',
    citation: 'PMC (NIH), "Examining the Influence of Historical Redlining on Firearm Injuries in Current Day Baltimore, Maryland"',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11230467/',
  },
];

const NeighborhoodsModule = { NEIGHBORHOODS };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NeighborhoodsModule;
}
if (typeof window !== 'undefined') {
  window.HolcNeighborhoods = NeighborhoodsModule;
}
