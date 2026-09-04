import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ProBadge } from "@/components/pro-badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { blocks, getBlock } from "@/lib/blocks";
import { getBlockDocs, getSourceCode } from "@/lib/get-source-code";

import { BlockStageView } from "@/components/block-stage-view";
import { Stage } from "@/components/stage";
import { NavArrowButton } from "@/components/nav-arrow-button";
import { FavoriteButton } from "@/components/favorite-button";
import Link from "next/link";
import { Mdx } from "@/components/blog/mdx";
import type { Metadata } from "next";
import { RelatedBlocksGrid } from "@/components/related-blocks-grid";
import { RelatedSection } from "@/components/related-section";
import { blockInstallCommand, personalizeDocs } from "@/lib/install-command";
import { SITE_URL, buildSoftwareSourceCodeJsonLd } from "@/lib/breadcrumb-jsonld";
import { getAdjacentBlocks } from "@/lib/blocks-utils";
import { getBlockDate } from "@/lib/changelog-dates";
import { getRelated } from "@/lib/search-index";
import { notFound } from "next/navigation";
import { getViewer } from "@/lib/entitlements";
import { PRICING_HREF, hostedLinkProps } from "@/lib/site-links";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const block = getBlock(slug);

  if (!block) {
    // Throwing here (before the body streams) guarantees a real 404 status;
    // returning a title would let the response flush as 200.
    notFound();
  }

  const title = `${block.title} shadcn/tailwind block - Beste UI`;
  const description = block.description;
  const ogTitle = `${block.title}`;

  return {
    title,
    description,
    alternates: { canonical: `https://ui.beste.co/block/${slug}` },
    openGraph: {
      title,
      description,
      images: [
        {
          url: `https://ui.beste.co/og?title=${encodeURIComponent(
            ogTitle
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
      images: [
        `https://ui.beste.co/og?title=${encodeURIComponent(
          ogTitle
        )}&description=${encodeURIComponent(description)}`,
      ],
    },
  };
}

// Same origin the canonicals and install commands are written against.
const REGISTRY_BASE_URL = SITE_URL;

export default async function BlockPage({ params }: PageProps) {
  const { slug } = await params;
  const block = getBlock(slug);

  if (!block) {
    // Return a real 404 (not a redirect) so missing blocks don't register
    // as soft-404s and dilute crawl signals.
    notFound();
  }

  // Resolve user pro status + license key for pro blocks.
  const {
    isPro: isUserPro,
    email: userEmail,
    licenseKey,
  } = await getViewer({ withLicenseKey: block.isPro });

  const sourceCode = getSourceCode(slug, isUserPro);
  /*
   * The README as written carries `YOUR_EMAIL` / `YOUR_KEY`. For a signed-in
   * licensee those are two things we already know, so the commands are filled in
   * here and the reader copies something that runs. Anyone else gets the
   * placeholders and the line telling them what to do with them.
   */
  const rawDocs = getBlockDocs(slug);
  const docsSource =
    rawDocs && isUserPro && userEmail && licenseKey
      ? personalizeDocs(rawDocs, { email: userEmail, licenseKey })
      : rawDocs;

  const adjacent = getAdjacentBlocks(slug);

  const baseInstallCommand = blockInstallCommand(slug);
  const installCommand =
    block.isPro && isUserPro && userEmail && licenseKey
      ? blockInstallCommand(slug, { email: userEmail, licenseKey })
      : baseInstallCommand;

  const categorySlug = block.category ? block.category.toLowerCase().replace(/\s+/g, "-") : null;

  const breadcrumbItems: { name: string; url: string }[] = [
    { name: "Home", url: `${REGISTRY_BASE_URL}/` },
    { name: "Blocks", url: `${REGISTRY_BASE_URL}/blocks` },
  ];
  if (block.category && categorySlug) {
    breadcrumbItems.push({
      name: block.category,
      url: `${REGISTRY_BASE_URL}/blocks/${categorySlug}`,
    });
  }
  breadcrumbItems.push({
    name: block.title,
    url: `${REGISTRY_BASE_URL}/block/${block.name}`,
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

  const lastModified = getBlockDate(block.name);
  const sourceCodeJsonLd = buildSoftwareSourceCodeJsonLd({
    name: block.title,
    description: block.description,
    url: `${REGISTRY_BASE_URL}/block/${block.name}`,
    category: block.category,
    isAccessibleForFree: !block.isPro,
    datePublished: lastModified,
    dateModified: lastModified,
  });

  // Semantic same-category neighbors (replaces positional neighborWindow).
  const relatedBlocks = getRelated("block", block.name, { sameCategoryOnly: true, limit: 6 })
    .map((it) => blocks.find((b) => b.name === it.name))
    .filter((b): b is (typeof blocks)[number] => Boolean(b));

  return (
    <Stage
      backHref="/blocks"
      backLabel="All blocks"
      source={sourceCode}
      installCommand={installCommand}
      displayInstallCommand={baseInstallCommand}
      isPro={block.isPro}
      isUserPro={isUserPro}
      flavor={{ kind: "block", name: block.name }}
      detailsLabel="About this block"
      actions={
        <>
          <FavoriteButton blockName={block.name} className="hidden md:inline-flex" />
          <NavArrowButton
            direction="prev"
            label="Previous block"
            href={adjacent.prev ? `/block/${adjacent.prev.name}` : undefined}
          />
          <NavArrowButton
            direction="next"
            label="Next block"
            href={adjacent.next ? `/block/${adjacent.next.name}` : undefined}
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
                    <Link href="/blocks">Blocks</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {block.category && categorySlug && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={`/blocks/${categorySlug}`}>{block.category}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{block.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* The document's h1 is the hidden one above the block, so the
                title here is a second-level heading styled as the first. The
                tag rides with it: free or Pro is a fact about the block. */}
            <header className="mb-10 md:mb-12">
              <h2 className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                <span>{block.title}</span>
                {block.isPro ? (
                  <Link
                    href={PRICING_HREF}
                    {...hostedLinkProps}
                    aria-label="Pro block — see pricing"
                    className="inline-flex shrink-0 items-center leading-none transition-opacity hover:opacity-80"
                  >
                    <ProBadge size="md" className="rounded-full px-2.5 py-1 text-sm" />
                  </Link>
                ) : (
                  <span className="shrink-0 rounded-full bg-yellow-400 px-2.5 py-1 text-sm font-semibold tracking-wide text-black">
                    FREE
                  </span>
                )}
              </h2>

              <p className="mt-4 text-lg text-muted-foreground md:text-xl">{block.description}</p>
            </header>
          </div>

          {docsSource && (
            <section
              id="block-docs"
              className="scroll-mt-20 bg-muted/60"
              aria-label={`${block.title} documentation`}
            >
              {/*
                The README at reading size. `Mdx` is the blog's renderer and sets
                no size on its paragraphs, so the band scales them from here: 18px
                over a 3xl column lands at roughly 70 characters a line. `[&>p]`
                rather than `[&_p]`, so the child combinator stops at the edge of
                a callout or the upgrade card, which set their own leading.
              */}
              <div className="mx-auto max-w-3xl px-4 py-12 text-lg md:px-6 md:py-16 [&>p]:leading-8 [&_li]:leading-8 [&_table]:text-base">
                <Mdx source={docsSource} isUserPro={isUserPro} />
              </div>
            </section>
          )}

          {relatedBlocks.length > 0 && block.category && categorySlug && (
            <RelatedSection
              heading={`More ${block.category} blocks`}
              viewAllHref={`/blocks/${categorySlug}`}
              viewAllLabel={`View all ${block.category}`}
            >
              <RelatedBlocksGrid blocks={relatedBlocks} />
            </RelatedSection>
          )}
        </>
      }
    >
      {/* The document's one h1 is the catalogue title; the block's own heading
          follows it in the DOM. */}
      <h1 className="sr-only">{block.title}</h1>
      <BlockStageView name={block.name} fullscreen={block.fullscreen} isUserPro={isUserPro} />
    </Stage>
  );
}
