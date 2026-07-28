import { NextResponse } from "next/server";
import type { AssetType } from "@/lib/embeddings";
import { hybridSearch } from "@/lib/search-core";

// Node runtime: the search implementation may load native modules to embed
// the query, which the edge runtime cannot do.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_TYPES: AssetType[] = ["block", "piece", "component"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim();
  const typeParam = url.searchParams.get("type");
  const limitParam = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;

  const types =
    typeParam && typeParam !== "all" && VALID_TYPES.includes(typeParam as AssetType)
      ? [typeParam as AssetType]
      : undefined;

  if (!query) return NextResponse.json({ query: "", count: 0, results: [] });

  try {
    const results = await hybridSearch(query, { types, limit });
    return NextResponse.json({ query, count: results.length, results });
  } catch (error) {
    console.error("[api/search]", error);
    return NextResponse.json({ query, count: 0, results: [], error: "search_failed" }, { status: 500 });
  }
}
