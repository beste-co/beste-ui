import { SITE_ORIGIN } from "@/lib/site-links";
import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { components, getComponent } from "@/lib/components";

import { NavArrowButton } from "@/components/nav-arrow-button";
import { FavoriteButton } from "@/components/favorite-button";
import { PieceStageView, PieceUsage } from "@/components/piece-stage-view";
import { Stage } from "@/components/stage";
import { pieceInstallCommand } from "@/lib/install-command";
import Link from "next/link";
import type { Metadata } from "next";
import { RelatedSection } from "@/components/related-section";
import { RelatedPreviewByName } from "@/components/related-preview-by-name";
import { buildSoftwareSourceCodeJsonLd } from "@/lib/breadcrumb-jsonld";
import { getPieceDate } from "@/lib/changelog-dates";
import { getRelated } from "@/lib/search-index";
import { notFound } from "next/navigation";
import path from "node:path";
import { readFile } from "node:fs/promises";

// The origin every generated URL is written against; see lib/site-links.ts.
const SITE_URL = SITE_ORIGIN;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadSource(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), "registry-pieces", slug, `${slug}.tsx`);
  try {
    return await readFile(filePath, "utf-8");
  } catch {
    return `// Source not found for ${slug}`;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);

  if (!component) {
    return { title: "Piece not found - Beste UI" };
  }

  const title = `${component.title} - Beste UI Piece`;
  const description = component.description;

  return {
    title,
    description,
    alternates: { canonical: `https://ui.beste.co/piece/${slug}` },
    openGraph: {
      title,
      description,
      images: [
        {
          url: `https://ui.beste.co/og?title=${encodeURIComponent(
            component.title
          )}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponent(slug);

  if (!component) {
    notFound();
  }

  const source = await loadSource(slug);

  const idx = components.findIndex((c) => c.name === slug);
  const prev = idx > 0 ? components[idx - 1] : null;
  const next = idx >= 0 && idx < components.length - 1 ? components[idx + 1] : null;

  const categorySlug = component.category
    ? component.category.toLowerCase().replace(/\s+/g, "-")
    : null;

  const breadcrumbItems: { name: string; url: string }[] = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Pieces", url: `${SITE_URL}/pieces` },
  ];
  if (component.category && categorySlug) {
    breadcrumbItems.push({
      name: component.category,
      url: `${SITE_URL}/pieces/${categorySlug}`,
    });
  }
  breadcrumbItems.push({
    name: component.title,
    url: `${SITE_URL}/piece/${component.name}`,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const lastModified = getPieceDate(component.name);
  const sourceCodeJsonLd = buildSoftwareSourceCodeJsonLd({
    name: component.title,
    description: component.description,
    url: `${SITE_URL}/piece/${component.name}`,
    category: component.category,
    isAccessibleForFree: !component.isPro,
    datePublished: lastModified,
    dateModified: lastModified,
  });

  // Semantic same-category neighbors, rendered as live-preview cards.
  const relatedPieces = getRelated("piece", component.name, { sameCategoryOnly: true, limit: 6 });

  return (
    <Stage
      backHref="/pieces"
      backLabel="All pieces"
      source={source}
      installCommand={pieceInstallCommand(component.name)}
      flavor={{ kind: "piece", name: component.name }}
      detailsLabel="About this piece"
      actions={
        <>
          <FavoriteButton componentName={component.name} className="hidden md:inline-flex" />
          <NavArrowButton
            direction="prev"
            label="Previous piece"
            href={prev ? `/piece/${prev.name}` : undefined}
          />
          <NavArrowButton
            direction="next"
            label="Next piece"
            href={next ? `/piece/${next.name}` : undefined}
          />
        </>
      }
      details={
        <>
          <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-12">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(sourceCodeJsonLd) }}
            />
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
                    <Link href="/pieces">Pieces</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {component.category && categorySlug && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={`/pieces/${categorySlug}`}>{component.category}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{component.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* The document's h1 is the hidden one above the piece, so the
                title here is a second-level heading styled as the first. */}
            <header className="mb-10 md:mb-12">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {component.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">{component.description}</p>
            </header>

            <PieceUsage name={component.name} className="mb-12 md:mb-16" />
          </div>

          {relatedPieces.length > 0 && (
            <RelatedSection
              heading={`More ${component.category} pieces`}
              viewAllHref={categorySlug ? `/pieces/${categorySlug}` : undefined}
              viewAllLabel={`View all ${component.category}`}
            >
              <RelatedPreviewByName names={relatedPieces.map((r) => r.name)} kind="piece" />
            </RelatedSection>
          )}
        </>
      }
    >
      {/* The document's one h1 is the catalogue title; the piece follows it. */}
      <h1 className="sr-only">{component.title}</h1>
      <PieceStageView name={component.name} />
    </Stage>
  );
}
