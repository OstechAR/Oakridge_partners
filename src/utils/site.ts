/**
 * Builds a site-root-relative URL that respects the configured `base`
 * (e.g. "/Oakridge_partners/") so links work the same in dev and on
 * GitHub Pages, regardless of how deeply nested the current page is.
 *
 * withBase('credit.html')            -> /Oakridge_partners/credit.html
 * withBase('articles/my-post.html')  -> /Oakridge_partners/articles/my-post.html
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/Oakridge_partners/"
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
