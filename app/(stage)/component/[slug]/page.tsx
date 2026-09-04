import { SITE_ORIGIN } from "@/lib/site-links";
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
import { getRegistryComponent, registryComponents } from "@/lib/registry-components";
import { notFound, permanentRedirect } from "next/navigation";

import { NavArrowButton } from "@/components/nav-arrow-button";
import { FavoriteButton } from "@/components/favorite-button";
import Link from "next/link";
import type { Metadata } from "next";
import { ComponentPlayground } from "@/components/component-playground";
import { ComponentPropsTable } from "@/components/component-props-table";
import { type DocsSection, DocsSideRail } from "@/components/docs-side-rail";
import {
  RegistryComponentStageView,
  RegistryComponentUsage,
} from "@/components/registry-component-stage-view";
import { Stage } from "@/components/stage";
import { componentInstallCommand } from "@/lib/install-command";
import { RelatedSection } from "@/components/related-section";
import { RelatedPreviewByName } from "@/components/related-preview-by-name";
import { buildSoftwareSourceCodeJsonLd } from "@/lib/breadcrumb-jsonld";
import { getComponentDate } from "@/lib/changelog-dates";
import { getComponent } from "@/lib/components";
import { readComponentProps } from "@/lib/component-props";
import { getPlayground } from "@/lib/playgrounds";
import { SPONSOR_HREF, SPONSORS } from "@/lib/sponsors";
import { getRelated } from "@/lib/search-index";
import path from "node:path";
import { readFile } from "node:fs/promises";

// The origin every generated URL is written against; see lib/site-links.ts.
const SITE_URL = SITE_ORIGIN;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadSource(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), "registry-components", slug, `${slug}.tsx`);
  try {
    return await readFile(filePath, "utf-8");
  } catch {
    return `// Source not found for ${slug}`;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getRegistryComponent(slug);

  if (!component) {
    return { title: "Component not found - Beste UI" };
  }

  const title = `${component.title} - Beste UI Component`;
  const description = component.description;

  return {
    title,
    description,
    alternates: { canonical: `https://ui.beste.co/component/${slug}` },
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

export default async function RegistryComponentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const component = getRegistryComponent(slug);

  if (!component) {
    // Pieces lived under /component/{name} before moving to /piece/{name};
    // keep those old links working.
    if (getComponent(slug)) {
      permanentRedirect(`/piece/${slug}`);
    }
    notFound();
  }

  const source = await loadSource(slug);

  const idx = registryComponents.findIndex((c) => c.name === slug);
  const prev = idx > 0 ? registryComponents[idx - 1] : null;
  const next = idx >= 0 && idx < registryComponents.length - 1 ? registryComponents[idx + 1] : null;

  const categorySlug = component.category
    ? component.category.toLowerCase().replace(/\s+/g, "-")
    : null;

  const breadcrumbItems: { name: string; url: string }[] = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Components", url: `${SITE_URL}/components` },
  ];
  if (component.category && categorySlug) {
    breadcrumbItems.push({
      name: component.category,
      url: `${SITE_URL}/components/${categorySlug}`,
    });
  }
  breadcrumbItems.push({
    name: component.title,
    url: `${SITE_URL}/component/${component.name}`,
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

  /*
   * Both read from the source this page already loads for the Code tab, and both are
   * page-only: nothing here reaches what `shadcn add` installs.
   */
  const propRows = readComponentProps(source, component.name);
  const playground = getPlayground(component.name);

  /*
   * The rail's entries are built from what this page renders rather than scanned out
   * of the DOM: the sections are known here, and a table of contents that waits for
   * the client to find its own entries is one that pops in.
   */
  const sections: DocsSection[] = [
    { id: "usage", label: "Usage" },
    ...(playground ? [{ id: "playground", label: "Playground" }] : []),
    ...(playground?.keys?.length ? [{ id: "keyboard", label: "Keyboard" }] : []),
    ...(propRows.length > 0 ? [{ id: "props", label: "Props" }] : []),
  ];

  const lastModified = getComponentDate(component.name);
  const sourceCodeJsonLd = buildSoftwareSourceCodeJsonLd({
    name: component.title,
    description: component.description,
    url: `${SITE_URL}/component/${component.name}`,
    category: component.category,
    isAccessibleForFree: !component.isPro,
    datePublished: lastModified,
    dateModified: lastModified,
  });

  // Semantic same-category neighbors, rendered as live-preview cards.
  const relatedComponents = getRelated("component", component.name, {
    sameCategoryOnly: true,
    limit: 6,
  });

  return (
    <Stage
      backHref="/components"
      backLabel="All components"
      source={source}
      installCommand={componentInstallCommand(component.name)}
      flavor={{ kind: "component", name: component.name }}
      detailsLabel="About this component"
      actions={
        <>
          <FavoriteButton registryComponentName={component.name} className="hidden md:inline-flex" />
          {/* The neighbour's name when there is one — the arrows are the only
              thing here a reader cannot see the destination of. */}
          <NavArrowButton
            direction="prev"
            label={prev ? `Previous: ${prev.title}` : "Previous component"}
            href={prev ? `/component/${prev.name}` : undefined}
          />
          <NavArrowButton
            direction="next"
            label={next ? `Next: ${next.title}` : "Next component"}
            href={next ? `/component/${next.name}` : undefined}
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

            {/*
              Content and rail. Below `lg` the rail is not rendered at all: a
              sticky column has nowhere to stick on a phone, and a table of
              contents there is just a list to scroll past.
            */}
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
              <div className="flex min-w-0 flex-1 flex-col">
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
                        <Link href="/components">Components</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {component.category && categorySlug && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link href={`/components/${categorySlug}`}>{component.category}</Link>
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

                {/* The document's h1 is the hidden one above the component, so
                    the title here is a second-level heading styled as the first. */}
                <header className="mb-10 md:mb-12">
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                    {component.title}
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground md:text-xl">{component.description}</p>
                </header>

                <RegistryComponentUsage name={component.name} />

                {playground ? (
                  <ComponentPlayground name={component.name} config={playground} className="mt-16" />
                ) : null}

                {propRows.length > 0 ? (
                  <ComponentPropsTable rows={propRows} className="mt-16" />
                ) : null}

                {/*
                  The pager, at the end, where a reader who has finished is. It
                  carries the neighbour's name rather than a bare arrow: the bar's
                  arrows ask you to guess where they go.
                */}
                {(prev || next) && (
                  <nav aria-label="Component pagination" className="mt-12 flex items-stretch gap-3">
                    {prev ? (
                      <Link
                        href={`/component/${prev.name}`}
                        className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-muted/60 p-4 transition-colors hover:bg-muted"
                      >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} className="shrink-0 text-foreground/70" />
                        <span className="flex min-w-0 flex-col">
                          <span className="text-base text-foreground/70">Previous</span>
                          <span className="truncate text-lg font-medium">{prev.title}</span>
                        </span>
                      </Link>
                    ) : (
                      <span className="flex-1" />
                    )}

                    {next ? (
                      <Link
                        href={`/component/${next.name}`}
                        className="group flex min-w-0 flex-1 items-center justify-end gap-3 rounded-lg bg-muted/60 p-4 text-right transition-colors hover:bg-muted"
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="text-base text-foreground/70">Next</span>
                          <span className="truncate text-lg font-medium">{next.title}</span>
                        </span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} className="shrink-0 text-foreground/70" />
                      </Link>
                    ) : (
                      <span className="flex-1" />
                    )}
                  </nav>
                )}
              </div>

              <DocsSideRail
                sections={sections}
                sponsors={SPONSORS}
                sponsorHref={SPONSOR_HREF ?? undefined}
                className="sticky top-8 hidden lg:flex"
              />
            </div>
          </div>

          {relatedComponents.length > 0 && (
            <RelatedSection
              heading={`More ${component.category} components`}
              viewAllHref={categorySlug ? `/components/${categorySlug}` : undefined}
              viewAllLabel={`View all ${component.category}`}
            >
              <RelatedPreviewByName names={relatedComponents.map((r) => r.name)} kind="component" />
            </RelatedSection>
          )}
        </>
      }
    >
      {/* The document's one h1 is the catalogue title; the component follows it. */}
      <h1 className="sr-only">{component.title}</h1>
      <RegistryComponentStageView name={component.name} />
    </Stage>
  );
}
