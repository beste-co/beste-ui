import { type NextRequest, NextResponse } from "next/server";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { stripRawTextElements } from "@/lib/html-to-markdown";
import { SITE_ORIGIN } from "@/lib/site-links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BYPASS_HEADER = "x-markdown-bypass";

/**
 * This route renders a page by fetching it and converting the HTML, so the
 * address it fetches must never be something the caller chose. `Host` is a
 * request header like any other: left unchecked, anyone could point it at an
 * internal address and read the response back out of this endpoint.
 *
 * The allowlist is deliberately narrow: the site's own origin, a local dev
 * server, and Vercel preview deployments, which serve on a generated hostname
 * the canonical origin cannot know in advance.
 */
function isLocal(host: string): boolean {
  const name = host.split(":")[0] ?? "";
  return name === "localhost" || name === "127.0.0.1" || name === "[::1]";
}

function isOwnHost(host: string): boolean {
  if (isLocal(host)) return true;
  if (host === new URL(SITE_ORIGIN).host) return true;
  return /^[a-z0-9-]+\.vercel\.app$/i.test(host);
}

export async function GET(request: NextRequest) {
  // Path is forwarded by the middleware via x-md-path. Falls back to the
  // ?path= query param if the route is hit directly (handy for debugging).
  const path =
    request.headers.get("x-md-path") ??
    request.nextUrl.searchParams.get("path") ??
    "/";

  if (!path.startsWith("/")) {
    return NextResponse.json({ error: "invalid path" }, { status: 400 });
  }

  const host = request.headers.get("host");
  if (!host || !isOwnHost(host)) {
    return NextResponse.json({ error: "invalid host" }, { status: 400 });
  }

  // Protocol is derived, never read from x-forwarded-proto: the whole target is
  // assembled from client-controlled headers otherwise, and this route returns
  // the body it fetches.
  const protocol = isLocal(host) ? "http" : "https";

  const targetUrl = `${protocol}://${host}${path}`;

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      headers: {
        accept: "text/html",
        [BYPASS_HEADER]: "1",
        "user-agent": request.headers.get("user-agent") || "markdown-agent",
      },
      redirect: "follow",
    });
  } catch {
    return new Response("upstream fetch failed", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const upstreamCt = upstream.headers.get("content-type") || "";
  if (!upstreamCt.includes("text/html")) {
    return new Response(`upstream not html (${upstream.status})`, {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const rawHtml = await upstream.text();
  // Radix Accordion (and other collapse primitives) keep their content in
  // the DOM but mark it with the `hidden` attribute when collapsed, which
  // node-html-markdown correctly skips. For an agent's markdown view we
  // want the full content (e.g. FAQ answers), so strip the `hidden`
  // attribute before conversion. `aria-hidden` is left untouched so
  // decorative elements stay excluded.
  const html = stripRawTextElements(rawHtml).replace(
    /\shidden(?:="[^"]*")?(?=[\s>])/gi,
    ""
  );
  const markdown = NodeHtmlMarkdown.translate(html, {
    keepDataImages: false,
    useLinkReferenceDefinitions: false,
  });

  // Rough token estimate (~4 chars/token, GPT-style heuristic)
  const tokenEstimate = Math.ceil(markdown.length / 4);

  return new Response(markdown, {
    status: upstream.status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(tokenEstimate),
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
      vary: "accept",
    },
  });
}
