import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, SITE_URL } from "@/lib/breadcrumb-jsonld";
import { parseSort, sortByAdded } from "@/lib/browse-sort";
import { getComponentAddedDate, recentComponentDates } from "@/lib/changelog-dates";
import { components as pieces } from "@/lib/components";
import type { RegistryComponentMeta } from "@/lib/registry-components";
import { registryComponents } from "@/lib/registry-components";
import {
  buildCategoryCounts,
  categorySlug,
  filterByCategorySlug,
  PAGE_SIZE,
  paginate,
  parsePage,
} from "../_lib/paginate";
import { RegistryComponentsContent } from "../registry-components-content";

/**
 * The one sentence this category gets, in the metadata and under the title
 * alike. Written once so a reader and a search result are told the same thing.
 */
function categoryDescription(categoryName: string | undefined): string {
  if (!categoryName) return "Design system primitives: buttons, badges and other building blocks our sections are composed from.";
  return `${categoryName} components from Beste UI, design system primitives built with shadcn/ui and Tailwind CSS.`;
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const filtered = filterByCategorySlug(registryComponents, slug);
  const categoryName = filtered[0]?.category;
  const baseTitle = categoryName
    ? `${categoryName} components - Beste UI`
    : "Components - Beste UI";
  const title = page > 1 ? `${baseTitle} - Page ${page}` : baseTitle;
  const description = categoryDescription(categoryName);
  const canonical =
    page > 1 ? `${SITE_URL}/components/${slug}?page=${page}` : `${SITE_URL}/components/${slug}`;
  const ogImageUrl = `/og?title=${encodeURIComponent(baseTitle)}&description=${encodeURIComponent(description)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: baseTitle, description, images: [ogImageUrl] },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description,
      images: [ogImageUrl],
    },
  };
}


export default async function RegistryComponentsCategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const sp = await searchParams;
  const requestedPage = parsePage(sp.page);
  const sort = parseSort(sp.sort);

  const filtered = filterByCategorySlug(registryComponents, slug);
  if (filtered.length === 0) {
    // Pieces lived under /components/{category} before moving to /pieces;
    // keep those old links working.
    if (pieces.some((p) => categorySlug(p.category) === slug)) {
      permanentRedirect(`/pieces/${slug}`);
    }
    notFound();
  }

  const page = paginate(
    sortByAdded(filtered, sort, getComponentAddedDate),
    requestedPage,
    PAGE_SIZE
  );
  const currentCategory = page.items[0]?.category;

  if (!currentCategory || categorySlug(currentCategory) !== slug) {
    notFound();
  }


  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Components", url: `${SITE_URL}/components` },
    { name: currentCategory, url: `${SITE_URL}/components/${slug}` },
  ]);

  const itemListJsonLd = buildItemListJsonLd(
    page.items.map((c) => ({ name: c.title, url: `${SITE_URL}/component/${c.name}` })),
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
      <RegistryComponentsContent
        itemNames={page.items.map((c) => c.name)}
        currentPage={page.currentPage}
        totalPages={page.totalPages}
        totalItems={page.totalItems}
        currentCategory={currentCategory}
        currentCategorySlug={slug}
        currentSort={sort}
        addedDates={recentComponentDates()}
        description={categoryDescription(currentCategory)}
        categories={buildCategoryCounts(registryComponents)}
        pageSize={PAGE_SIZE}
      />
    </>
  );
}
