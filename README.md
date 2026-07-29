# Oakridge Partners — Astro Rebuild

This is an architectural refactor of the original static-HTML Oakridge
Partners MVP into an Astro site driven by Content Collections. The goal was
**not** a redesign — visual appearance, layout, colors, and copy are
preserved as closely as possible. What changed is *how the site is built*:
hardcoded HTML/JS became Markdown content that automatically flows into
pages.

> ⚠️ **This project was written without network access and has not been
> built or run.** Please run `npm install && npm run build` locally as the
> real test. If you hit errors, share them and I'll fix them.

---

## 1. Quick start

```bash
npm install
npm run dev       # http://localhost:4321/Oakridge_partners/
npm run build     # outputs static site into ./docs
npm run preview   # preview the production build locally
```

## 2. Deploying to GitHub Pages (manual build, no CI)

The build is configured to output directly into `docs/` at the repo root,
in flat-file form (`credit.html`, not `credit/index.html`) so URLs match
the original site exactly.

1. `npm run build`
2. Commit the `docs/` folder and push.
3. In the repo: **Settings → Pages → Source → Deploy from a branch → `main` / `docs`**.

That's it — no GitHub Actions workflow required. Every time you add or edit
content, repeat steps 1–2.

If you'd rather deploy from the repo root instead of `/docs`, remove the
`outDir: './docs'` line in `astro.config.mjs` (it'll default to `dist/`)
and copy `dist/*` into the repo root before committing.

**Before your first deploy**, double check `astro.config.mjs`:
- `site` — your GitHub Pages domain
- `base` — must match your repo name exactly (currently `/Oakridge_partners`)

---

## 3. What "no HTML editing" means in practice

| To do this...                          | ...add this file                                  |
|-----------------------------------------|----------------------------------------------------|
| Add a new affiliate offer               | `src/content/marketplace/your-offer.md`            |
| Add a new partner/provider              | `src/content/providers/your-provider.md`           |
| Add a new educational article           | `src/content/articles/your-article.md`             |
| Add a new topic/category page           | `src/content/categories/your-category.md`          |

Every one of these automatically:
- Gets its own detail page (offers, providers, and articles get one; category
  pages are generated from `[category].astro`).
- Shows up on its category page under "Partner Options To Explore" /
  "Related Articles".
- Becomes eligible in questionnaire **Results** (matched by `category`).
- Shows up on the **homepage** if `featured: true` (offers/articles).

You never touch a `.astro` file to add content. Rebuild (`npm run build`)
and redeploy to publish.

### Example: adding a new marketplace offer

```markdown
---
title: "Some New Card"
provider: "neo-financial"        # must match a filename in content/providers
category: "credit"               # credit | loans | banking | insurance
offerType: "Credit card"
summary: "One sentence describing the offer."
affiliateUrl: "https://example.com/your-real-link"
buttonText: "Learn More"
featured: false
priority: 6
tags: ["credit-card"]
eligibility:
  - "Canadian resident"
---

Optional longer body copy shown on the offer's own detail page
(`/marketplace/some-new-card.html`).
```

Save it, rebuild — it now appears on `/credit.html` and in questionnaire
results for anyone who selects "Credit" as their topic. No code changes.

---

## 4. Project structure

```
src/
  content.config.ts        # schemas for all 4 collections (Zod)
  content/
    marketplace/            # affiliate offers (one file per offer)
    providers/               # partner companies
    articles/                # educational articles
    categories/              # credit.md, loans.md, banking.md, insurance.md
                              # -> generates credit.html, loans.html, etc.
  components/                # Header, Footer, Hero, Button, CTA, Card,
                              # SmallCard, Disclaimer, OfferCard, ArticleCard,
                              # CategoryCard, ProviderCard, Questionnaire
  layouts/
    BaseLayout.astro         # <head>, Header, Footer wrapper
  pages/
    index.astro              # homepage (now with dynamic Featured Offers /
                              # Newest Articles sections pulled from content)
    about.astro
    questionnaire.astro
    results.astro             # ships a build-time JSON dataset, filtered
                               # client-side against localStorage answers
    [category].astro          # ONE file generates every category page
    articles/[slug].astro
    marketplace/[slug].astro
    providers/[slug].astro
  styles/
    global.css                # your original styles.css, plus small
                               # additive rules for new components
  utils/
    site.ts                   # withBase() helper for GitHub Pages subpath links
```

## 5. How the questionnaire → results flow now works

- **Questionnaire** (`questionnaire.astro` + `Questionnaire.astro`): topic
  options (question 1) are generated from the `categories` collection —
  add a new category and it automatically appears as a questionnaire
  option. Goal/experience questions are still static (they're not
  content-driven concepts). Answers are saved to `localStorage` exactly
  as before (`oakridgeAnswers`), so this is a drop-in behavioral match.
- **Results** (`results.astro`): at build time, Astro serializes the
  `categories`, `marketplace`, and `articles` collections into a small
  JSON blob embedded in the page. A short client script reads the
  visitor's saved answers from `localStorage`, looks up the matching
  category, and filters the embedded dataset — no hardcoded `if
  (topic === "credit")` logic, and no server needed. Add a new
  marketplace or article file with the right `category`, rebuild, and it
  becomes eligible automatically.

## 6. Things I changed or added beyond a literal 1:1 port

These follow directly from your spec, but are worth flagging since they're
new relative to the original site:

- **Insurance category page** (`content/categories/insurance.md`) — the
  original homepage linked to `#` for Insurance; there was no
  `insurance.html`. I wrote placeholder content in the same voice as the
  other category pages. **Review this before publishing** — it's clearly
  marked in the file.
- **Marketplace/provider example content** (ComparHub, EQ Bank,
  Wealthsimple, Neo Financial) — your original site had no real affiliate
  listings (the "results" page just showed generic educational blurbs, no
  partner offers). I added four illustrative marketplace entries matching
  the filenames from your spec, with **placeholder `affiliateUrl`s
  (`https://example.com/...`) that you must replace** with real
  affiliate links before launch. Provider descriptions are intentionally
  generic/neutral — replace them with accurate, current details.
- **Homepage "Featured Offers" and "Newest Articles" sections** — new,
  as required by the spec. Styled to match the homepage's existing card
  system so they don't look bolted on.
- **`/articles/[slug]`, `/marketplace/[slug]`, `/providers/[slug]` detail
  pages** — new, in support of "no HTML editing to add content" and the
  future-expansion goals (comparison pages, more offers, etc.).
- Minor, intentional normalization: a few pages in the original had
  slightly different card padding/shadow values from page to page (e.g.
  35px vs 40px padding). These are now consistent site-wide via
  `global.css`. Visually near-identical, but flagging it in the interest
  of transparency.

## 7. Known gaps carried over from the original

- `privacy.html`, `terms.html`, and `disclosure.html` were linked from the
  homepage footer in the original site but never existed. They're still
  not included here — add them as new `.astro` pages (or a `legal`
  collection) whenever you're ready.
