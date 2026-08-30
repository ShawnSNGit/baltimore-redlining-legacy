# The Legacy of Redlining in Baltimore

The full, cited history of housing segregation in Baltimore — from the
country's first racial zoning ordinance in 1910 to today — paired with
a live look at whether the 1937 federal redlining grades still show up
in the City's own current housing data, for five specific,
well-documented neighborhoods.

## 🟢 Quick start (for anyone, no computer experience needed)

1. Open the live website (see "Deployment" below if you're setting it
   up, or ask whoever sent you this link).
2. The homepage loads automatically and shows five Baltimore
   neighborhoods, each with its 1937 grade (a colored circle) and how
   many vacant buildings the City currently has on file there.
3. At the top of the page, there are three tabs: **Live Data** (what
   you're looking at), **Full History** (the whole story, in order,
   with sources), and **Sources & Methods** (exactly what this project
   does and doesn't claim). Click any tab to switch pages.

Nothing to type, nothing to install.

**[Live demo →](#deployment)** (add your link here after deploying)

## Why this exists

In 1910, Baltimore passed the first law in the country making it
illegal for Black and white residents to live on the same block. When
the Supreme Court struck that down in 1917, the city and its developers
found other ways — code-enforcement harassment, racially restrictive
deeds, and in 1937, a federal map that graded Baltimore neighborhoods
by mortgage risk in a way that explicitly factored in race. That map is
where the word "redlining" comes from.

Multiple peer-reviewed studies have since found that neighborhoods
graded lower on that 1937 map have measurably worse outcomes today —
in life expectancy, environmental risk, even firearm injury rates. This
project makes one small piece of that pattern visible and checkable in
real time: for five specific, well-documented Baltimore neighborhoods,
it shows their 1937 grade next to their current vacant-building count,
live from the City's own data.

## What it does, technically

- **Home page**: live-queries Baltimore City's public vacant building
  notice data for five named neighborhoods, and shows each one next to
  its cited historic HOLC grade.
- **History page**: a full, chronological, cited timeline from 1910 to
  today.
- **Sources & Methods page**: exactly what this project does and does
  not show, and a full citation list for every historical claim on the
  site.
- Runs entirely in your browser — no backend, no API key.
- See [ARCHITECTURE.md](ARCHITECTURE.md) for why this covers five
  specific named neighborhoods rather than claiming to be the full
  1937 map (short version: this build's sandbox couldn't safely verify
  the full map's live data schema, so it uses only neighborhoods with
  an explicit, checkable citation for their grade — see the doc for
  exactly what that means and how to extend it correctly).

## Running the tests

```bash
npm install
npm test
```

33 tests cover: the historical timeline's data integrity (including a
check against reproducing long verbatim quotations), the curated
neighborhood grade table, the live API query logic (mocked, no network
needed), and — most carefully — the join/aggregation logic that
combines historic grades with live counts, including every edge case
where a naive implementation could accidentally fabricate or hide data.

## Deployment

1. Push this repo to your own GitHub account.
2. **Settings → Pages → Source**: select **GitHub Actions**.
3. Push to `main` (or run the "Deploy to GitHub Pages" workflow
   manually) — live at
   `https://<your-username>.github.io/baltimore-redlining-legacy/`.
4. Load the live homepage once and confirm the five neighborhood cards
   actually populate with live counts — see ARCHITECTURE.md for what
   to check if they don't.
5. Copy the live link into the "Live demo" line at the top of this
   README, and share that link — it's the whole product.

## Contributing a correction or an additional neighborhood

If you have a citable source for another named Baltimore neighborhood's
1937 HOLC grade, add it to `src/holcNeighborhoods.js` following the
exact pattern already there — every entry needs its own specific
citation and URL. See [ARCHITECTURE.md](ARCHITECTURE.md) for the full
reasoning behind that standard.

## Scope and limits

- Covers five specific, well-documented neighborhoods, not the full
  ~42-area 1937 map — see ARCHITECTURE.md for exactly why, and how to
  extend this correctly.
- The live/historic comparison on five neighborhoods illustrates a
  published pattern; it isn't new statistical evidence on its own.
- Not affiliated with the City of Baltimore or the University of
  Richmond's Mapping Inequality project.

## License

MIT — see [LICENSE](LICENSE). Historical facts and citations throughout
this project are drawn from and credited to the sources listed on the
Sources & Methods page; this repo's own code and writing are MIT
licensed, but please continue to credit the underlying sources (the
Mapping Inequality project in particular is CC BY-NC-SA licensed) if
you reuse the historical content itself.
