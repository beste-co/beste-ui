import type { Metadata } from "next";
import { inSentence, namesList } from "@/lib/seo-copy";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ListingHeading } from "@/components/listing-heading";
import { Button } from "@/components/ui/button";
import { BlocksGrid } from "@/components/blocks-grid";
import { SITE_URL, buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/breadcrumb-jsonld";
import { DEFAULT_SORT, sortByAdded } from "@/lib/browse-sort";
import { getBlockAddedDate, recentBlockDates } from "@/lib/changelog-dates";
import { getCategoryInfo } from "@/lib/category-info";
import { getAllTags, getBlocksForTag, getTag } from "@/lib/tags";
import { PAGE_SIZE, paginate, parsePage } from "../../_lib/paginate";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params, searchParams }: TagPageProps): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = getTag(slug);
  if (!tag) return { title: "Tag not found - Beste UI" };

  const sp = await searchParams;
  const page = parsePage(sp.page);
  const pageSuffix = page > 1 ? ` - Page ${page}` : "";
  const canonical =
    page > 1 ? `${SITE_URL}/blocks/tag/${slug}?page=${page}` : `${SITE_URL}/blocks/tag/${slug}`;

  const count = getBlocksForTag(slug).length;
  const label = `${tag.label[0]!.toUpperCase()}${tag.label.slice(1)}`;
  const title = `Shadcn ${label} Blocks: ${count} Sections - Beste UI`;
  // A curated tag spans too many categories to list one by one, and the list
  // would push the description past what a search result shows anyway.
  const from =
    tag.blocks || tag.categories.length > 3
      ? `${tag.categories.length} categories`
      : `the ${namesList(tag.categories.map((c) => getCategoryInfo(c).title))} categories`;
  const description = `${count} shadcn/ui ${tag.label} blocks from ${from}, built with React and Tailwind CSS. Copy the code or install them with the shadcn CLI.`;
  const ogImage = `/og?title=${encodeURIComponent(`${tag.label} blocks`)}&description=${encodeURIComponent(description)}`;

  return {
    title: `${title}${pageSuffix}`,
    description,
    alternates: { canonical },
    openGraph: { title, description, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag: slug } = await params;
  const tag = getTag(slug);
  if (!tag) notFound();

  const sp = await searchParams;
  const requestedPage = parsePage(sp.page);

  const all = getBlocksForTag(slug);
  if (all.length === 0) notFound();

  // Newest first, like every other block listing. No picker here: this page has
  // no filter bar, and one control on its own would be a bar for its own sake.
  const page = paginate(
    sortByAdded(all, DEFAULT_SORT, getBlockAddedDate),
    requestedPage,
    PAGE_SIZE
  );
  const pageItems = [...page.items];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Blocks", url: `${SITE_URL}/blocks` },
    { name: tag.label, url: `${SITE_URL}/blocks/tag/${slug}` },
  ]);

  const itemListJsonLd = buildItemListJsonLd(
    pageItems.map((b) => ({ name: b.title, url: `${SITE_URL}/block/${b.name}` })),
    (page.currentPage - 1) * PAGE_SIZE + 1
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <header className="mb-10 md:mb-12">
          <ListingHeading
            heading={`Shadcn ${inSentence(tag.label)} blocks`}
            count={page.totalItems}
            crumbs={[{ label: "Blocks", href: "/blocks" }, { label: tag.label }]}
          />
          {/* A curated tag lists the blocks that declared it, so naming its
              categories would promise a sweep that never happened. A keyword
              tag really is the union of its categories, and links to them. */}
          {tag.blocks ? (
            <p className={cn(typography.lead, "mt-3 max-w-2xl")}>
              {page.totalItems} production-ready {tag.label} blocks, spread across{" "}
              {tag.categories.length} categories.
            </p>
          ) : (
            <>
              <p className={cn(typography.lead, "mt-3 max-w-2xl")}>
                {page.totalItems} production-ready {tag.label} blocks across these categories:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tag.categories.map((c) => (
                  <Link
                    key={c}
                    href={`/blocks/${c}`}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    {getCategoryInfo(c).title}
                  </Link>
                ))}
              </div>
            </>
          )}
        </header>

        <BlocksGrid blocks={pageItems} addedDates={recentBlockDates()} />

        {page.totalPages > 1 && (
          <nav
            className="mt-10 flex items-center justify-between"
            aria-label="Tag pagination"
          >
            {page.currentPage > 1 ? (
              <Button variant="outline" asChild>
                <Link
                  href={
                    page.currentPage - 1 === 1
                      ? `/blocks/tag/${slug}`
                      : `/blocks/tag/${slug}?page=${page.currentPage - 1}`
                  }
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    size={16}
                    strokeWidth={2}
                    className="mr-1"
                    aria-hidden="true"
                  />{" "}
                  Previous
                </Link>
              </Button>
            ) : (
              <span />
            )}
            <span className="text-sm text-muted-foreground">
              Page {page.currentPage} of {page.totalPages}
            </span>
            {page.currentPage < page.totalPages ? (
              <Button variant="outline" asChild>
                <Link href={`/blocks/tag/${slug}?page=${page.currentPage + 1}`}>
                  Next{" "}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={2}
                    className="ml-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
