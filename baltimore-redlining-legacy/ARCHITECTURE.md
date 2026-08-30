# Architecture

## The central design constraint: don't fabricate history

This project touches a genuinely fraught, real history, and it would be
easy to accidentally overstate what's actually known and verifiable.
Every design decision below traces back to one rule: **a specific claim
needs a specific, checkable citation, or it doesn't go in the app.**

## Why this isn't a full map of the 1937 HOLC grades

The actual 1937 HOLC survey graded roughly 42 separate areas across
Baltimore (per the PLOS ONE study cited in `src/history.js`). A full,
faithful reproduction would need the real polygon geometry for all 42
areas, sourced from the University of Richmond's Mapping Inequality
project.

That project does publish real, public, appropriately-licensed
geodata (GeoParquet/PMTiles under CC BY-NC-SA 4.0, per
`source.coop/cboettig/mappinginequality`), and Baltimore's own open
data portal even hosts a copy of it. But this build's sandbox has no
network access to either `dsl.richmond.edu`, the `source.coop`/S3
bucket, or `data.baltimorecity.gov`'s hosted copy — every search result
available while building this surfaced landing/about pages, never a
live, queryable field schema for that specific layer, unlike the
DHCD vacancy layer this project also uses (which *was* independently
confirmed via its own live schema page in a companion project).

Rather than guess at that schema, or worse, invent approximate polygon
boundaries, this project uses a **curated table of five specific,
named neighborhoods** (`src/holcNeighborhoods.js`) where a real,
citable secondary source states that neighborhood's grade explicitly
by name — not inferred from a map image, not estimated. Every entry's
citation is checkable. This is a real, defensible dataset; it is just
explicitly not the whole map, and both the app and this document say
so rather than implying otherwise.

**If you want to extend this**: the correct way is either (a) add
another named neighborhood with its own explicit, checkable citation to
`holcNeighborhoods.js`, following the exact pattern already there, or
(b) if you can get real access to the Mapping Inequality geodata,
replace the curated table entirely with a proper polygon-based join
against DHCD's vacancy point data (which does carry lat/long, per the
companion Baltimore Vacant Property Watch tool) — that would be a
genuine architectural upgrade, not a patch.

## Why the live data uses the neighborhood a person already knows Baltimore by

The DHCD vacancy layer's confirmed `Neighborhood` field uses Baltimore's
everyday neighborhood names (Sandtown-Winchester, Roland Park, etc.) —
the same names this project's historical citations already use. That
made a name-based join the natural, low-risk choice here, versus (say)
joining on ZIP code or Community Statistical Area, which would need an
extra, separately-confirmed crosswalk.

## Module boundaries

```
src/history.js            data: cited timeline, no DOM/network
src/holcNeighborhoods.js  data: curated grade table, no DOM/network
src/vacancyApi.js         pure functions: live query building + count parsing
src/legacyAnalysis.js     pure functions: joins the two datasets above, no network
src/app.js                DOM wiring for index.html (the live dashboard)
src/historyPage.js        DOM wiring for history.html
src/sourcesPage.js        DOM wiring for sources.html
```

`legacyAnalysis.js` is the most heavily tested file in this repo,
deliberately: it's where a subtle bug (e.g., silently treating a failed
fetch as a zero count, which would fabricate data) would be easiest to
introduce and most damaging to the project's honesty. Every edge case
— a neighborhood with no live data, a grade with no reporting
neighborhoods, partial failures — has an explicit test asserting it
produces `null`, not a misleading number.

## Why "does this neighborhood have more vacancy" doesn't imply causation

`showsClassicGradient()` reports whether average vacancy rises
monotonically from grade A to D across the five neighborhoods with live
data — nothing more. It is deliberately not framed as a statistical
test, an r-value, or a causal claim. The actual peer-reviewed evidence
for a redlining/outcomes relationship is the cited literature in
`history.js`; this tool's job is to make one small, live, checkable
slice of that pattern visible and verifiable in real time, not to
generate new evidence of its own.

## Why this project doesn't need a data-freshness workflow

The companion "Federal Judiciary Watch" project in this tool family
uses a scheduled GitHub Action to flag when its current-events snapshot
goes stale. This project doesn't need that: the historical content
doesn't change (history doesn't get less true with time), and the
vacancy figures are already live on every page load, not a periodic
snapshot. The one thing that could genuinely go stale here is a
citation URL going dead — that's a normal repo-maintenance concern, not
a special mechanism.

## What's honestly unverified

Same caveat as the companion Baltimore/DC tools in this family: this
sandbox has no network access to `egisdata.baltimorecity.gov`, so the
DHCD vacancy query (reusing a schema independently confirmed in an
earlier session) wasn't re-tested against a live response here. Do one
real page load after deploying and sanity-check a count or two.
