import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blocks } from "@/lib/blocks";
import { SITE_URL, buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/breadcrumb-jsonld";
import { parseSort, sortByAdded } from "@/lib/browse-sort";
import { getBlockAddedDate, recentBlockDates } from "@/lib/changelog-dates";
import { COLLECTIONS, collectionBlockNames, getCollection } from "@/lib/collections";
import {
  buildCategoryCounts,
  categorySlug,
  filterByCategorySlug,
  PAGE_SIZE,
  paginate,
  parsePage,
} from "../../_lib/paginate";
import { BlocksListing } from "../../blocks-listing";

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.slug }));
}

/** The `?category=` narrowing, if it is one of ours. */
function readCategory(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ? raw.trim().toLowerCase() : undefined;
}

/** Every block in the collection, in catalogue order, optionally one category of it. */
function collectionBlocks(slug: string, category: string | undefined) {
  const names = collectionBlockNames(slug);
  return filterByCategorySlug(
    blocks.filter((b) => names.has(b.name)),
    category
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: CollectionPageProps): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection not found - Beste UI" };

  const sp = await searchParams;
  const page = parsePage(sp.page);
  const category = readCategory(sp.category);

  /*
   * A category narrowing is a filtered view of the same page rather than a page
   * of its own, so it points its canonical at the unfiltered collection. The
   * paginated ones do get self-referencing canonicals, as elsewhere: they hold
   * different blocks and would otherwise read as duplicates of page 1.
   */
  const path = `${SITE_URL}/blocks/collection/${slug}`;
  const canonical = category ? path : page > 1 ? `${path}?page=${page}` : path;
  const pageSuffix = page > 1 ? ` - Page ${page}` : "";

  const ogImage = `/og?title=${encodeURIComponent(`${collection.label} collection`)}&description=${encodeURIComponent(collection.metaDescription)}`;

  return {
    title: `${collection.metaTitle}${pageSuffix}`,
    description: collection.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: collection.metaTitle,
      description: collection.metaDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: collection.metaTitle,
      description: collection.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const sp = await searchParams;
  const requestedPage = parsePage(sp.page);
  const category = readCategory(sp.category);
  const sort = parseSort(sp.sort);

  const filtered = collectionBlocks(slug, category);
  // An empty result means a category this collection has nothing in, which is
  // not a page: the picker only offers the categories it does have.
  if (filtered.length === 0) notFound();

  const page = paginate(
    sortByAdded(filtered, sort, getBlockAddedDate),
    requestedPage,
    PAGE_SIZE
  );
  // The display name behind the slug, recovered from the blocks themselves.
  const currentCategory = category ? page.items[0]?.category : undefined;
  if (category && (!currentCategory || categorySlug(currentCategory) !== category)) notFound();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Blocks", url: `${SITE_URL}/blocks` },
    { name: collection.label, url: `${SITE_URL}/blocks/collection/${slug}` },
  ]);

  const itemListJsonLd = buildItemListJsonLd(
    page.items.map((b) => ({ name: b.title, url: `${SITE_URL}/block/${b.name}` })),
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
      <BlocksListing
        itemNames={page.items.map((b) => b.name)}
        currentPage={page.currentPage}
        totalPages={page.totalPages}
        totalItems={page.totalItems}
        currentCategory={currentCategory}
        currentCategorySlug={category}
        currentCollectionSlug={collection.slug}
        currentSort={sort}
        addedDates={recentBlockDates()}
        // Only the categories this collection actually has, counted within it:
        // the picker is cutting the collection now, not the whole catalogue.
        categories={buildCategoryCounts(collectionBlocks(slug, undefined))}
        pageSize={PAGE_SIZE}
        description={collection.description}
      />
    </>
  );
}
