import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, SITE_URL } from "@/lib/breadcrumb-jsonld";
import type { RegistryComponentMeta } from "@/lib/registry-components";
import { registryComponents } from "@/lib/registry-components";
import { buildCategoryCounts, PAGE_SIZE, paginate, parsePage } from "./_lib/paginate";
import { RegistryComponentsContent } from "./registry-components-content";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const componentsTitle = "Components - Beste UI";
const componentsDescription =
  "Design system primitives: buttons, badges and other building blocks our sections are composed from.";
const componentsOgImage = `/og?title=${encodeURIComponent("Components")}&description=${encodeURIComponent(componentsDescription)}`;

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const canonical = page > 1 ? `${SITE_URL}/components?page=${page}` : `${SITE_URL}/components`;

  return {
    title: page > 1 ? `${componentsTitle} - Page ${page}` : componentsTitle,
    description: componentsDescription,
    alternates: { canonical },
    openGraph: {
      title: componentsTitle,
      description: componentsDescription,
      images: [componentsOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: componentsTitle,
      description: componentsDescription,
      images: [componentsOgImage],
    },
  };
}


export default async function RegistryComponentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedPage = parsePage(params.page);

  const page = paginate(registryComponents, requestedPage, PAGE_SIZE);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Components", url: `${SITE_URL}/components` },
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
        currentCategory={undefined}
        currentCategorySlug={undefined}
        categories={buildCategoryCounts(registryComponents)}
        pageSize={PAGE_SIZE}
      />
    </>
  );
}
