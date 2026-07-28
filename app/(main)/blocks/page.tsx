import type { Metadata } from "next";
import { blocks } from "@/lib/blocks";
import { SITE_URL, buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/breadcrumb-jsonld";
import { getCategoryInfo } from "@/lib/category-info";
import { CategoriesListing, type CategoryCard } from "./categories-listing";
import { buildCategoryCounts, categorySlug } from "./_lib/paginate";

const blocksTitle = "All Blocks - Beste UI";
const blocksDescription =
  "Browse all production-ready React components built with Tailwind CSS and shadcn/ui. Copy, paste, and customize for your next project.";
const blocksOgImage = `/og?title=${encodeURIComponent("All Blocks")}&description=${encodeURIComponent(blocksDescription)}`;

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
  const categories: CategoryCard[] = buildCategoryCounts(blocks).map((c) => ({
    ...c,
    sampleName: blocks.find((b) => categorySlug(b.category) === c.slug)?.name,
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
      <CategoriesListing categories={categories} />
    </>
  );
}
