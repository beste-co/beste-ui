import { type NextRequest, NextResponse } from "next/server";
import { NodeHtmlMarkdown } from "node-html-markdown";
import {
  stripMarkdownOmitted,
  stripRawTextElements,
} from "@/lib/html-to-markdown";
import { SITE_ORIGIN } from "@/lib/site-links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BYPASS_HEADER = "x-markdown-bypass";

/**
 * Every Markdown rendition opens with the same few lines.
 *
 * A page arriving on its own says nothing about whose page it is: an agent
 * handed /pricing.md sees a table of plans for a product it cannot name. The
 * preamble answers that first, then points at the two surfaces built for
 * reading the whole catalogue at once.
 */
/**
 * The page's own last-modified date, read back out of the structured data it
 * already publishes.
 *
 * Generative engines weight freshness heavily, and an undated document loses
 * to a dated one that says the same thing. Every block, piece, component and
 * post already carries a real `dateModified` (from lib/changelog-dates.ts, or
 * a post's `updated` frontmatter) inside its JSON-LD, so nothing new has to be
 * threaded through: it is in the HTML this route just fetched.
 *
 * The `Last-Modified` response header is preferred when present, since it is
 * the page's own claim rather than one of possibly several nodes on it.
 */
function lastModified(html: string, header: string | null): string | null {
  if (header) {
    const parsed = new Date(header);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }
  const match = html.match(
    /\\?"date(?:Modified|Published)\\?"\s*:\s*\\?"(\d{4}-\d{2}-\d{2})/
  );
  return match?.[1] ?? null;
}

function preamble(pageUrl: string, updated: string | null): string {
  return [
    "# Beste UI",
    "",
    "> Beautiful, accessible blocks, pieces and components for shadcn/ui and Tailwind CSS, built for React and Next.js. Install one with the shadcn CLI and the code is yours to edit: no runtime dependency, nothing to upgrade.",
    "",
    `Markdown rendition of ${pageUrl}. Every page on the site has one: add \`.md\` to any address, or send \`Accept: text/markdown\`.`,
    ...(updated ? ["", `Last updated: ${updated}`] : []),
    "",
    `Whole catalog for LLMs: ${SITE_ORIGIN}/llms.txt. Registry index: ${SITE_ORIGIN}/r/registry.json`,
    "",
    "---",
    "",
  ].join("\n");
}

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
  const html = stripMarkdownOmitted(stripRawTextElements(rawHtml)).replace(
    /\shidden(?:="[^"]*")?(?=[\s>])/gi,
    ""
  );
  const markdown =
    preamble(
      `${SITE_ORIGIN}${path}`,
      lastModified(rawHtml, upstream.headers.get("last-modified"))
    ) +
    NodeHtmlMarkdown.translate(html, {
      keepDataImages: false,
      useLinkReferenceDefinitions: false,
    });

  // Rough token estimate (~4 chars/token, GPT-style heuristic)
  const tokenEstimate = Math.ceil(markdown.length / 4);

  // Browsers offer to save a text/markdown response rather than show it, and
  // someone who clicked "Markdown version" wants to read the page. A browser
  // that followed a `.md` link is exactly: the alias door, plus an Accept that
  // asks for HTML. It gets the same bytes typed as text/plain, which renders
  // inline. Everything else — Accept negotiation, curl, an agent fetching the
  // `.md` address — gets the honest media type.
  const isBrowserAlias =
    request.headers.get("x-md-alias") === "1" &&
    (request.headers.get("accept") || "").includes("text/html");

  return new Response(markdown, {
    status: upstream.status,
    headers: {
      "content-type": isBrowserAlias
        ? "text/plain; charset=utf-8"
        : "text/markdown; charset=utf-8",
      "content-disposition": "inline",
      // Same content as the HTML page at a second address: indexable only as a
      // duplicate. Agents follow the Link header, not the index.
      "x-robots-tag": "noindex",
      "x-markdown-tokens": String(tokenEstimate),
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
      vary: "accept",
    },
  });
}
