"use client";

import { BrowseFilters } from "@/components/browse-filters";
import { NewBadge, useIsNew } from "@/components/new-badge";
import { blocksObfuscated, getBlockObfuscated } from "@/lib/blocks-obfuscated";
import { COLLECTIONS } from "@/lib/collections";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import type { ComponentType } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";

export interface CategoryCard {
  category: string;
  slug: string;
  count: number;
  sampleName: string | undefined;
}

interface CategoriesListingProps {
  categories: readonly CategoryCard[];
  /** Ship dates for recently added blocks, for the cards' NEW tally. */
  addedDates?: Readonly<Record<string, string>>;
}

// Sample component preview - renders the representative component scaled down.
const SamplePreview = ({
  component: Component,
  demoProps,
  previewAlign = "top",
}: {
  component: ComponentType<any>;
  demoProps: any;
  previewAlign?: "top" | "bottom";
}) => {
  const isBottom = previewAlign === "bottom";

  try {
    return (
      <>
        {/* Mobile: scaled down to fit card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none isolate md:hidden">
          <div
            className={`absolute left-1/2 ${
              isBottom ? "bottom-0 origin-bottom" : "-top-4 origin-top"
            }`}
            style={{
              width: "430px",
              height: "800px",
              transform: `translateX(-50%) scale(0.65)`,
            }}
          >
            <Component {...demoProps} />
          </div>
        </div>
        {/* Desktop: centered, scaled down */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none isolate hidden md:block">
          <div
            className="absolute left-1/2 top-[55%] bg-background"
            style={{
              width: "1440px",
              height: "900px",
              transform: "translate(-50%, -50%) scale(0.24)",
            }}
          >
            <Component {...demoProps} />
          </div>
        </div>
      </>
    );
  } catch {
    return null;
  }
};

const LazyPreview = ({ name }: { name: string | undefined }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "100px" });

  useEffect(() => {
    if (inView) setShouldRender(true);
  }, [inView]);

  const block = name ? getBlockObfuscated(name) : undefined;

  return (
    <div ref={ref} className="absolute inset-0">
      {shouldRender && block ? (
        <SamplePreview
          component={block.component}
          demoProps={block.demoProps}
          previewAlign={block.previewAlign}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3">
          <div className="h-3 w-12 bg-muted rounded-full animate-pulse" />
          <div className="h-3 w-36 bg-muted rounded animate-pulse" />
          <div className="h-12 w-48 bg-muted rounded-md animate-pulse mt-1" />
        </div>
      )}
    </div>
  );
};

export function CategoriesListing({ categories, addedDates }: CategoriesListingProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isNew = useIsNew(addedDates);

  /** Which category each recently added block belongs to, looked up once. */
  const categoryOf = useMemo(() => {
    const bySlug = new Map<string, string>();
    for (const b of blocksObfuscated) {
      bySlug.set(b.name, b.category.toLowerCase().replace(/\s+/g, "-"));
    }
    return bySlug;
  }, []);

  /*
   * How many blocks each category has added inside the badge's window. Counted
   * here rather than on the server because the window is decided in the browser
   * — see `useIsNew` — so the tally and the badges on the cards behind it always
   * agree, however old the build is.
   */
  const newCounts = new Map<string, number>();
  for (const name of Object.keys(addedDates ?? {})) {
    if (!isNew(name)) continue;
    const slug = categoryOf.get(name);
    if (slug) newCounts.set(slug, (newCounts.get(slug) ?? 0) + 1);
  }

  /*
   * Alphabetical, except that anything with new blocks in it comes first, most
   * new first. A category that gained ten blocks this morning is the answer to
   * "what is there?" far more than "About" being early in the alphabet is.
   */
  const ordered = [...categories].sort((a, b) => {
    const diff = (newCounts.get(b.slug) ?? 0) - (newCounts.get(a.slug) ?? 0);
    return diff !== 0 ? diff : a.category.localeCompare(b.category);
  });

  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      const href = slug ? `/blocks/${slug}` : "/blocks";
      startTransition(() => router.push(href));
    },
    [router]
  );

  const handleCollectionChange = useCallback(
    (slug: string | null) => {
      const href = slug ? `/blocks/collection/${slug}` : "/blocks";
      startTransition(() => router.push(href));
    },
    [router]
  );

  /** The categories in the shape the filter bar takes them. */
  const filterOptions = useMemo(
    () => categories.map((c) => ({ label: c.category, value: c.slug, count: c.count })),
    [categories]
  );

  const collectionOptions = useMemo(
    () => COLLECTIONS.map((c) => ({ label: c.label, value: c.slug, count: c.count })),
    []
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <header className="mb-10 md:mb-12">
        {/* Baseline row rather than a smaller inline span — see blocks-listing. */}
        <h1 className="flex flex-wrap items-center gap-x-3 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          <span>Blocks</span>
          <span className="text-2xl font-semibold text-primary md:text-3xl">
            ({blocksObfuscated.length})
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Production-ready React blocks for Tailwind CSS and shadcn/ui. Copy, paste, and ship your
          next project faster.
        </p>
      </header>

      {/* No search field here: this page lists the categories themselves, and
          the pickers are shortcuts into one category, or into one collection —
          the set of blocks that share a design language, which no category page
          can show you because a collection runs across all of them. */}
      <BrowseFilters
        options={filterOptions}
        value={null}
        onValueChange={handleCategoryChange}
        allCount={blocksObfuscated.length}
        label="Category"
        extra={[
          {
            options: collectionOptions,
            value: null,
            onValueChange: handleCollectionChange,
            allLabel: "All collections",
            allCount: blocksObfuscated.length,
            label: "Collection",
          },
        ]}
        disabled={isPending}
      >
        <p className="text-base text-muted-foreground">{categories.length} categories</p>
      </BrowseFilters>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((c) => (
          <div
            key={c.category}
            className="group relative flex h-full flex-col gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-muted-foreground/15 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
          >
            {/* Stretched link overlay — a sibling (not ancestor) of the preview
                so the sample block's own anchors never nest inside this <a>. */}
            <Link
              href={`/blocks/${c.slug}`}
              aria-label={`${c.category} blocks`}
              className="absolute inset-0 z-10 cursor-pointer rounded-xl outline-none"
            />

            {/*
              The preview sits inside the card rather than filling it: a panel of its
              own on a muted ground, which is what keeps a block's own white surface
              from reading as the card's. No rule under it either — the gap and the
              change of surface already say where one ends and the other begins.
            */}
            <div className="relative h-84 overflow-hidden rounded-md bg-background md:h-48">
              <LazyPreview name={c.sampleName} />
              {/* The tally in the corner the preview keeps clear, above the
                  overlay link so it is not dimmed by the card's hover. */}
              {newCounts.has(c.slug) && (
                <div className="pointer-events-none absolute right-3 top-3 z-10">
                  <NewBadge count={newCounts.get(c.slug)} />
                </div>
              )}
            </div>

            {/*
              The name, and how many there are. The count moved down here from the
              corner of the preview, where it was a floating outline over someone
              else's design; beside the name it is a fact about the row it sits in.
              It takes the arrow's place because the arrow said nothing the whole card
              being a link did not already say.
            */}
            <div className="relative flex items-center justify-between gap-3 px-1 pb-1">
              <h3 className="text-lg font-semibold tracking-tight">{c.category}</h3>
              {/* On a muted card the chip needs the lighter surface to be seen at all. */}
              <span className="shrink-0 rounded-full bg-background px-2.5 py-0.5 text-sm font-medium tabular-nums text-foreground/70">
                {c.count} {c.count === 1 ? "block" : "blocks"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
