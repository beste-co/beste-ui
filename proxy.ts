import { type NextRequest, NextResponse } from "next/server";
import { markdownAliasPath, markdownHref } from "@/lib/markdown-url";

// RFC 8288 Link header for agent discovery. Applied to every HTML route so
// crawlers / agents on any page can find the registry's machine-readable
// surfaces (api-catalog, llms.txt, sitemap, registry index).
const AGENT_LINKS = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</llms-full.txt>; rel="describedby"; type="text/plain"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</r/registry.json>; rel="describedby"; type="application/json"',
].join(", ");

const MARKDOWN_BYPASS_HEADER = "x-markdown-bypass";

/**
 * Returns true only if `text/markdown` is explicitly preferred over `text/html`
 * by Accept q-values. Lets browsers (which send `text/html,*\/*;q=0.8` or
 * similar) keep getting HTML, while agents asking specifically for Markdown
 * get the Markdown rendering.
 */
function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  let mdQ = -1;
  let htmlQ = -1;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().split(";");
    if (!type) continue;
    let q = 1;
    for (const p of params) {
      const [k, v] = p.trim().split("=");
      if (k === "q" && v) q = Number.parseFloat(v) || 0;
    }
    if (type === "text/markdown") mdQ = Math.max(mdQ, q);
    else if (type === "text/html") htmlQ = Math.max(htmlQ, q);
  }
  return mdQ > 0 && mdQ >= htmlQ;
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Two ways to ask for the Markdown rendering of a page, both landing on
  // /api/markdown, which fetches the HTML version and converts it:
  //
  //   1. Content negotiation (RFC 9110 / "Markdown for Agents") — an Accept
  //      header that prefers text/markdown over text/html.
  //   2. A `.md` suffix on the address, so the Markdown view is a plain link
  //      anyone can paste, follow, or hand to a tool that only speaks URLs.
  //
  // The bypass header prevents recursion when /api/markdown self-fetches.
  const isMarkdownCandidate =
    request.method === "GET" &&
    request.headers.get(MARKDOWN_BYPASS_HEADER) !== "1";
  const aliasPath = isMarkdownCandidate ? markdownAliasPath(pathname) : null;

  if (
    aliasPath !== null ||
    (isMarkdownCandidate && prefersMarkdown(request.headers.get("accept")))
  ) {
    const mdUrl = new URL("/api/markdown", request.url);
    // The path is forwarded as a request header — search params on the
    // rewrite target are not reliably exposed to the handler in Next.js 16.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-md-path", `${aliasPath ?? pathname}${url.search || ""}`);
    // Which of the two doors was used. The handler types its response by it:
    // a browser that followed a `.md` link wants to read the page, not save it.
    if (aliasPath !== null) requestHeaders.set("x-md-alias", "1");
    const rewritten = NextResponse.rewrite(mdUrl, {
      request: { headers: requestHeaders },
    });
    rewritten.headers.set("Link", AGENT_LINKS);
    return rewritten;
  }

  const response = NextResponse.next();

  // Referral cookie (existing behavior)
  const existingRef = request.cookies.get("ref");
  if (!existingRef) {
    const refParam = url.searchParams.get("ref");
    if (refParam) {
      const host = request.headers.get("host") || "";
      const isAllowedHost =
        host === "ui.beste.co" || host.startsWith("localhost");
      if (isAllowedHost) {
        let cookieDomain: string | undefined;
        if (host === "ui.beste.co") {
          cookieDomain = ".beste.co";
        }
        response.cookies.set("ref", refParam, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
          ...(cookieDomain && { domain: cookieDomain }),
        });
      }
    }
  }

  // Agent discovery Link headers + Vary so caches keep HTML and Markdown apart.
  // Pages also advertise their own `.md` address as an alternate, so an agent
  // that landed on the HTML can find the Markdown without guessing. Addresses
  // with an extension are files (robots.txt, sitemap.xml) and have none.
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  response.headers.set(
    "Link",
    lastSegment.includes(".")
      ? AGENT_LINKS
      : `${AGENT_LINKS}, <${markdownHref(pathname)}>; rel="alternate"; type="text/markdown"`
  );
  response.headers.append("Vary", "Accept");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts).*)"],
};
