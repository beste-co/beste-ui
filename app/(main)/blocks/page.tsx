import type { Metadata } from "next";
import { blocks } from "@/lib/blocks";
import { formatCount } from "@/lib/seo-copy";
import { SITE_URL, buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/breadcrumb-jsonld";
import { getCategoryInfo } from "@/lib/category-info";
import { DEFAULT_SORT, sortByAdded } from "@/lib/browse-sort";
import { getBlockAddedDate, recentBlockDates } from "@/lib/changelog-dates";
import { CategoriesListing, type CategoryCard } from "./categories-listing";
import { buildCategoryCounts, categorySlug } from "./_lib/paginate";

const blockCategoryCount = new Set(blocks.map((b) => b.category)).size;
const blocksTitle = `Shadcn Blocks: ${formatCount(blocks.length)} React and Tailwind Sections - Beste UI`;
const blocksDescription = `Browse ${formatCount(blocks.length)} shadcn/ui blocks in ${blockCategoryCount} categories: heroes, pricing tables, features, testimonials, dashboards and more. Built with React and Tailwind CSS, in Base UI and Radix versions.`;
const blocksOgImage = `/og?title=${encodeURIComponent("Shadcn Blocks")}&description=${encodeURIComponent(blocksDescription)}`;

export const metadata: Metadata = {
  title: blocksTitle,
  description: blocksDescription,
  alternates: { canonical: `${SITE_URL}/blocks` },
  openGraph: {
    title: blocksTitle,
    description: blocksDescription,
    images: [blocksOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: blocksTitle,
    description: blocksDescription,
    images: [blocksOgImage],
  },
};

export default function BlocksPage() {
  // The card previews show each category's newest block rather than its
  // alphabetically first, which is what the listing behind the card opens on.
  const newest = sortByAdded(blocks, DEFAULT_SORT, getBlockAddedDate);
  const categories: CategoryCard[] = buildCategoryCounts(blocks).map((c) => ({
    ...c,
    sampleName: newest.find((b) => categorySlug(b.category) === c.slug)?.name,
  }));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Blocks", url: `${SITE_URL}/blocks` },
  ]);

  const itemListJsonLd = buildItemListJsonLd(
    categories.map((c) => ({
      name: `${getCategoryInfo(c.slug).title} blocks`,
      url: `${SITE_URL}/blocks/${c.slug}`,
    }))
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
      <CategoriesListing categories={categories} addedDates={recentBlockDates()} />
    </>
  );
}
