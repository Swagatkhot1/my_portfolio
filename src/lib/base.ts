/**
 * Prefix a site-root-absolute asset path with Astro's configured `base`.
 *
 * GitHub Pages serves a project repo under `/<repo>/`, so a bare
 * "/logos/ut-tennessee-t.png" resolves to the wrong origin path there. Vite
 * inlines `BASE_URL` at build time, so this works inside the React islands as
 * well as in `.astro` files. When `base` is unset — local dev, Cloudflare, a
 * custom domain — `BASE_URL` is "/" and the path comes back unchanged.
 */
export function withBase(path: string): string;
export function withBase(path: string | undefined): string | undefined;
export function withBase(path: string | undefined): string | undefined {
  // Leave relative paths and absolute URLs (http:, data:, //cdn) alone.
  if (!path || !path.startsWith("/") || path.startsWith("//")) return path;
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
}
