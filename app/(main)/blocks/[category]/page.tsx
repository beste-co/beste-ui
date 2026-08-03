import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blocks } from "@/lib/blocks";
import { SITE_URL, buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/breadcrumb-jsonld";
import { parseSort, sortByAdded } from "@/lib/browse-sort";
import { getBlockAddedDate, recentBlockDates } from "@/lib/changelog-dates";
import { getCategoryInfo } from "@/lib/category-info";
import {
  buildCategoryCounts,
  categorySlug,
  filterByCategorySlug,
  PAGE_SIZE,
  paginate,
  parsePage,
} from "../_lib/paginate";
import { BlocksListing } from "../blocks-listing";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const info = getCategoryInfo(category);

  // Paginated pages get distinct titles and self-referencing canonicals so
  // they don't register as duplicates of page 1.
  const pageSuffix = page > 1 ? ` - Page ${page}` : "";
  const canonical =
    page > 1 ? `${SITE_URL}/blocks/${category}?page=${page}` : `${SITE_URL}/blocks/${category}`;

  const ogImageUrl = `/og?title=${encodeURIComponent(info.metaTitle)}&description=${encodeURIComponent(info.metaDescription)}`;

  return {
    title: `${info.metaTitle}${pageSuffix}`,
    description: info.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: info.metaTitle,
      description: info.metaDescription,
      images: [ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: info.metaTitle,
      description: info.metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const sp = await searchParams;
  const requestedPage = parsePage(sp.page);
  const sort = parseSort(sp.sort);

  const filtered = filterByCategorySlug(blocks, slug);
  if (filtered.length === 0) {
    notFound();
  }

  const page = paginate(
    sortByAdded(filtered, sort, getBlockAddedDate),
    requestedPage,
    PAGE_SIZE
  );
  // Recover the original (non-slugged) category name from the first block.
  const currentCategory = page.items[0]?.category;

  // Sanity check: ensure slug matches a real category.
  if (!currentCategory || categorySlug(currentCategory) !== slug) {
    notFound();
  }

  /*
   * The same copy the metadata uses, so the sentence a reader sees under the
   * title and the one a search result shows are about the same category. The
   * meta line is written for a snippet and runs long; `description` is the one
   * written to be read on the page.
   */
  const info = getCategoryInfo(slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Blocks", url: `${SITE_URL}/blocks` },
    { name: currentCategory, url: `${SITE_URL}/blocks/${slug}` },
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
        currentCategorySlug={slug}
        currentSort={sort}
        addedDates={recentBlockDates()}
        categories={buildCategoryCounts(blocks)}
        pageSize={PAGE_SIZE}
        description={info.description}
      />
    </>
  );
}
