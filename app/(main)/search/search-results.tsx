"use client";

// Full search page: rich, preview-card results for every match (unlike the ⌘K
// palette, which shows a compact few). Fetches the same /api/search hybrid
// endpoint, resolves hits to their runtime metas client-side, and renders the
// same live-preview grids used elsewhere. Reached via ⌘K "See all results",
// Enter, or /search?q=...
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { BlockMeta } from "@/lib/blocks";
import { blocksObfuscated as blocks } from "@/lib/blocks-obfuscated";
import { components } from "@/lib/components";
import { registryComponents } from "@/lib/registry-components";
import { RelatedBlocksGrid } from "@/components/related-blocks-grid";
import { RelatedPreviewGrid, type RelatedPreviewItem } from "@/components/related-preview-grid";
import { cn } from "@/lib/utils";

interface Hit {
  type: "block" | "piece" | "component";
  name: string;
  title: string;
  description: string;
  category: string;
  isPro: boolean;
  href: string;
}

type TypeFilter = "all" | "block" | "piece" | "component";

const blockByName = new Map(blocks.map((b) => [b.name, b] as const));
const pieceByName = new Map(components.map((c) => [c.name, c] as const));
const componentByName = new Map(registryComponents.map((c) => [c.name, c] as const));

const FACETS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "block", label: "Blocks" },
  { key: "piece", label: "Pieces" },
  { key: "component", label: "Components" },
];

export function SearchResults() {
  const router = useRouter();
  const params = useSearchParams();

  const [input, setInput] = useState(() => params.get("q") ?? "");
  const [type, setType] = useState<TypeFilter>(() => {
    const t = params.get("type");
    return t === "block" || t === "piece" || t === "component" ? t : "all";
  });
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Always land at the top of a freshly opened search page (navigation from
    // the ⌘K palette can otherwise preserve the previous scroll position), and
    // focus the field without the browser scrolling it into view.
    window.scrollTo(0, 0);
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Keep the URL shareable/back-friendly as the query or facet changes.
  useEffect(() => {
    const q = input.trim();
    const usp = new URLSearchParams();
    if (q) usp.set("q", q);
    if (type !== "all") usp.set("type", type);
    const qs = usp.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
  }, [input, type, router]);

  // Fetch all types once per query; facet filtering is client-side (instant).
  useEffect(() => {
    const q = input.trim();
    if (!q) {
      setHits([]);
      setActiveQuery("");
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const handle = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&type=all&limit=80`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((d) => {
          setHits(Array.isArray(d.results) ? d.results : []);
          setActiveQuery(q);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);
    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [input]);

  const counts = useMemo(() => {
    const c = { all: hits.length, block: 0, piece: 0, component: 0 };
    for (const h of hits) c[h.type]++;
    return c;
  }, [hits]);

  const blockMetas = useMemo<BlockMeta[]>(
    () =>
      hits
        .filter((h) => h.type === "block")
        .map((h) => blockByName.get(h.name))
        .filter((b): b is BlockMeta => Boolean(b)),
    [hits]
  );

  const previewItems = (kind: "piece" | "component"): RelatedPreviewItem[] =>
    hits
      .filter((h) => h.type === kind)
      .map((h): RelatedPreviewItem | null => {
        const meta = (kind === "piece" ? pieceByName : componentByName).get(h.name);
        if (!meta) return null;
        return {
          name: meta.name,
          title: meta.title,
          description: meta.description,
          component: meta.component,
          demoProps: meta.demoProps,
          href: `/${kind}/${meta.name}`,
          category: "category" in meta ? meta.category : undefined,
        };
      })
      .filter((x): x is RelatedPreviewItem => Boolean(x));

  const pieceItems = useMemo(() => previewItems("piece"), [hits]);
  const componentItems = useMemo(() => previewItems("component"), [hits]);

  const showBlocks = (type === "all" || type === "block") && blockMetas.length > 0;
  const showPieces = (type === "all" || type === "piece") && pieceItems.length > 0;
  const showComponents = (type === "all" || type === "component") && componentItems.length > 0;
  const nothing = activeQuery && !loading && counts.all === 0;

  return (
    <div>
      <h1 className="mb-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Search</h1>

      {/* The field and the facets in the language the listing bars use: filled
          pills on the page's own surface, no borders, and the facet in force
          inverted rather than outlined. */}
      <div className="relative mb-3">
        <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" aria-hidden="true" />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search blocks, pieces, components… e.g. 'pricing with monthly toggle'"
          className="h-12 w-full rounded-full bg-muted/60 pl-11 pr-4 text-base text-foreground outline-none transition-colors placeholder:text-foreground/50 hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:appearance-none"
          aria-label="Search"
        />
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-1.5">
        {FACETS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setType(f.key)}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2 text-base transition-colors",
              type === f.key
                ? "bg-foreground font-medium text-background"
                : "bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            {f.label}
            {activeQuery ? (
              <span className="ml-2 font-mono text-sm tabular-nums opacity-70">
                {counts[f.key]}
              </span>
            ) : null}
          </button>
        ))}
        {loading && <span className="ml-1 text-base text-foreground/50">Searching…</span>}
      </div>

      {!activeQuery && !loading && (
        <p className="py-16 text-center text-lg text-muted-foreground">
          Start typing to search across {blocks.length + components.length + registryComponents.length}+ blocks, pieces, and components.
        </p>
      )}

      {nothing && (
        <p className="py-16 text-center text-lg text-muted-foreground">
          No results for &ldquo;{activeQuery}&rdquo;. Try a broader phrase.
        </p>
      )}

      <div className="flex flex-col gap-12">
        {showBlocks && (
          <section>
            <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-tight">Blocks</h2>
            <RelatedBlocksGrid blocks={blockMetas} />
          </section>
        )}
        {showPieces && (
          <section>
            <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-tight">Pieces</h2>
            <RelatedPreviewGrid items={pieceItems} />
          </section>
        )}
        {showComponents && (
          <section>
            <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-tight">Components</h2>
            <RelatedPreviewGrid items={componentItems} />
          </section>
        )}
      </div>
    </div>
  );
}
