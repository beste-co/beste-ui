import { type NextRequest, NextResponse } from "next/server";

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

  // Markdown content negotiation (RFC 9110 / "Markdown for Agents"). For any
  // GET request whose Accept prefers text/markdown, rewrite to /api/markdown,
  // which fetches the HTML version and returns a Markdown rendering. The
  // bypass header prevents recursion when /api/markdown self-fetches.
  if (
    request.method === "GET" &&
    request.headers.get(MARKDOWN_BYPASS_HEADER) !== "1" &&
    prefersMarkdown(request.headers.get("accept"))
  ) {
    const mdUrl = new URL("/api/markdown", request.url);
    // The path is forwarded as a request header — search params on the
    // rewrite target are not reliably exposed to the handler in Next.js 16.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-md-path", `${pathname}${url.search || ""}`);
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

  // Agent discovery Link headers + Vary so caches keep HTML and Markdown apart
  response.headers.set("Link", AGENT_LINKS);
  response.headers.append("Vary", "Accept");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts).*)"],
};
