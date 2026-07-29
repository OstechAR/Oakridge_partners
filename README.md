# Oakridge Partners

A static, data-driven site that matches visitors to financial products
(credit, credit cards, insurance, mortgages, loans, banking, business
services) based on a short questionnaire. Built to run on GitHub Pages
with no backend, database, or build step.

## Structure

```
index.html            Landing page
questionnaire.html     Multi-step questionnaire (renders from data/questionnaire.json)
results.html            Shows matched products (renders from data/products.json + categories.json)
learn.html               Hub linking to educational articles
about.html               Company info
disclosure.html          Affiliate disclosure + educational disclaimer
privacy.html             Privacy policy
404.html                 GitHub Pages error page

css/style.css            Global styles: nav, footer, buttons, typography
css/questionnaire.css    Questionnaire-only styles (ring progress indicator)
css/cards.css            Reusable product card styles

js/main.js               Runs on every page (mobile nav, active link, footer year)
js/questionnaire.js      Renders questions, validates, saves answers
js/results.js            Reads saved answers, matches categories, renders results
js/products.js           Loads products.json, builds product card markup
js/utils.js              formatDate, capitalize, getQueryParameter, shuffleArray, loadJSON

data/products.json       Every listed product — the file you'll edit most
data/questionnaire.json  The questions themselves — add a question here, no JS changes needed
data/categories.json     Maps a questionnaire answer to one or more product categories

images/logo.svg
images/products/         Product logos (falls back to placeholder-product.svg if missing)
```

## Editing regularly

Day to day, you'll mostly touch three things:

- **`data/products.json`** — add, remove, or update affiliate products.
- **`images/products/`** — drop in a product's logo, then reference it by filename in `products.json`.
- **`learn.html`** (and eventually a `/learn/` folder of article pages) — publish new educational content.

To add a new questionnaire question, add an entry to `data/questionnaire.json`
and add matching entries to `data/categories.json` for each of its options.
No JavaScript changes needed for either.

## Running locally

This is a static site — no build step. From the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Opening the HTML files directly via
`file://` will work for layout, but `fetch()` calls to the JSON files in
`data/` require an actual server due to browser CORS rules.)

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo settings, under **Pages**, set the source to the `main`
   branch (root).
3. If using a custom domain, add a `CNAME` file at the project root
   containing just the domain (e.g. `oakridgepartners.com`) and configure
   your DNS accordingly.

## Notes on data flow

Questionnaire answers are saved to the browser's `localStorage` under the
key `oakridge_answers` when the last question is submitted, then read back
on `results.html`. Nothing is sent to a server — this keeps the whole
thing static and hostable on GitHub Pages with zero backend.

## Not included (by design, for the MVP)

User accounts, a backend, a database, an admin panel, authentication,
and payment processing. Everything here is static; product data is
managed by hand-editing the JSON files in `data/`.
