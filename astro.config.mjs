import { defineConfig } from 'astro/config';

// Update `site` if you move off github.io, and `base` if you rename the repo.
export default defineConfig({
  site: 'https://ostechar.github.io',
  base: '/Oakridge_partners',
  trailingSlash: 'never',
  build: {
    // Outputs credit.html instead of credit/index.html, matching the
    // original site's URLs (index.html, credit.html, about.html, etc).
    format: 'file',
  },
  // Build straight into /docs so GitHub Pages can serve it directly
  // (Settings -> Pages -> Source: "Deploy from a branch" -> main / docs).
  // No CI needed: run `npm run build`, commit, push.
  outDir: './docs',
});
