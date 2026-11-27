import type { Metadata } from "next";
import { components } from "@/lib/components";
import { formatCount } from "@/lib/seo-copy";
import { SITE_URL, buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/breadcrumb-jsonld";
import { parseSort, sortByAdded } from "@/lib/browse-sort";
import { getPieceAddedDate, recentPieceDates } from "@/lib/changelog-dates";
import { ComponentsContent } from "./components-content";
import {
  buildCategoryCounts,
  PAGE_SIZE,
  paginate,
  parsePage,
} from "./_lib/paginate";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const piecesTitle = `Shadcn UI Widgets: ${formatCount(components.length)} Pieces for React and Tailwind - Beste UI`;
const piecesDescription = `${formatCount(components.length)} small shadcn/ui widgets: AI prompts, charts, calendars, notifications, receipts, isometric art and more. Drop them into the media slot of a section or use them on their own.`;
const piecesOgImage = `/og?title=${encodeURIComponent("Shadcn UI Widgets")}&description=${encodeURIComponent(piecesDescription)}`;

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const canonical = page > 1 ? `${SITE_URL}/pieces?page=${page}` : `${SITE_URL}/pieces`;

  return {
    title: page > 1 ? `${piecesTitle} - Page ${page}` : piecesTitle,
    description: piecesDescription,
    alternates: { canonical },
    openGraph: {
      title: piecesTitle,
      description: piecesDescription,
      images: [piecesOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: piecesTitle,
      description: piecesDescription,
      images: [piecesOgImage],
    },
  };
}


export default async function ComponentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedPage = parsePage(params.page);
  const sort = parseSort(params.sort);

  const page = paginate(
    sortByAdded(components, sort, getPieceAddedDate),
    requestedPage,
    PAGE_SIZE
  );

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Pieces", url: `${SITE_URL}/pieces` },
  ]);

  const itemListJsonLd = buildItemListJsonLd(
    page.items.map((c) => ({ name: c.title, url: `${SITE_URL}/piece/${c.name}` })),
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
      <ComponentsContent
        itemNames={page.items.map((c) => c.name)}
        currentPage={page.currentPage}
        totalPages={page.totalPages}
        totalItems={page.totalItems}
        currentCategory={undefined}
        currentCategorySlug={undefined}
        currentSort={sort}
        addedDates={recentPieceDates()}
        categories={buildCategoryCounts(components)}
        pageSize={PAGE_SIZE}
      />
    </>
  );
}
