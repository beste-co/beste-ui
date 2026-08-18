/**
 * The two directions of the `.md` alias, kept in one place so the middleware
 * (which resolves an incoming `.md` address) and the footer link (which builds
 * one) cannot drift apart.
 */

const SUFFIX = ".md";

function withoutTrailingSlash(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

/**
 * The `.md` address of a page: `/tools/tailwind-class-sorter` ->
 * `/tools/tailwind-class-sorter.md`. The home page has no name to hang the
 * suffix on, so it gets `/index.md` rather than a bare `/.md`.
 */
export function markdownHref(pathname: string): string {
  const path = withoutTrailingSlash(pathname);
  if (path === "" || path === "/") return `/index${SUFFIX}`;
  return `${path}${SUFFIX}`;
}

/**
 * The reverse: the page a `.md` address belongs to, or null when the address
 * is not a markdown alias. `/index.md` and `/.md` both mean the home page.
 */
export function markdownAliasPath(pathname: string): string | null {
  if (!pathname.endsWith(SUFFIX)) return null;
  const base = withoutTrailingSlash(pathname.slice(0, -SUFFIX.length));
  if (base === "" || base === "/" || base === "/index") return "/";
  return base;
}
