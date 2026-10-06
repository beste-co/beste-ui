/**
 * The site moved from ui.beste.co to beste.dev. Pages on the old host answer
 * with a permanent redirect; everything a tool or an installed project calls
 * by its old address (registries, embeds, files) keeps being served there.
 */

export const LEGACY_HOST = "ui.beste.co";
const NEW_ORIGIN = "https://beste.dev";

const SERVED_ON_LEGACY = [
  "/r/",
  "/r-base/",
  "/piece/r/",
  "/piece/r-base/",
  "/component/r/",
  "/component/r-base/",
  "/page/r/",
  "/embed/",
  "/api/",
  "/.well-known/",
  "/_next/",
  "/og",
  "/apple-icon",
];

/** The beste.dev address a request to the old host moves to, or null to serve it. */
export function legacyRedirectTarget(
  host: string,
  pathname: string,
  search: string
): string | null {
  if (host.toLowerCase() !== LEGACY_HOST) return null;
  for (const prefix of SERVED_ON_LEGACY) {
    const exact = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
    if (pathname === exact || pathname.startsWith(prefix)) return null;
  }
  // Anything with an extension is a file: robots.txt, sitemaps, llms.txt, `.md` pages.
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) return null;
  return `${NEW_ORIGIN}${pathname}${search}`;
}
