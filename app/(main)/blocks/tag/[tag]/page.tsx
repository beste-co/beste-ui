import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft01Icon, ArrowRight01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { BlocksGrid } from "@/components/blocks-grid";
import { SITE_URL, buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/breadcrumb-jsonld";
import { DEFAULT_SORT, sortByAdded } from "@/lib/browse-sort";
import { getBlockAddedDate, recentBlockDates } from "@/lib/changelog-dates";
import { getCategoryInfo } from "@/lib/category-info";
import { getAllTags, getBlocksForTag, getTag } from "@/lib/tags";
import { PAGE_SIZE, paginate, parsePage } from "../../_lib/paginate";

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

  const title = `${tag.label} shadcn blocks - Beste UI`;
  const description = `Production-ready shadcn/tailwind ${tag.label} blocks across ${tag.categories
    .map((c) => getCategoryInfo(c).title)
    .join(", ")}. Copy, paste, and customize.`;
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

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-base sm:gap-1.5">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" aria-label="Home">
                  <HugeiconsIcon icon={Home01Icon} size={14} strokeWidth={2} aria-hidden="true" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/blocks">Blocks</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{tag.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-10 md:mb-12">
          <h1 className="text-3xl font-semibold capitalize leading-tight tracking-tight md:text-4xl">
            {tag.label} blocks
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
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
