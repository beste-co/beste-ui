import { SITE_ORIGIN } from "@/lib/site-links";

export const SITE_URL = SITE_ORIGIN;

export interface BreadcrumbCrumb {
  name: string;
  url: string;
}

export function buildBreadcrumbJsonLd(items: readonly BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface ItemListEntry {
  name: string;
  url: string;
}

/** ItemList for paginated listing/category pages; position carries across pages. */
export function buildItemListJsonLd(items: readonly ItemListEntry[], startPosition = 1) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: startPosition + i,
      name: item.name,
      url: item.url,
    })),
  };
}

export interface SoftwareSourceCodeInput {
  name: string;
  description: string;
  url: string;
  category: string;
  isAccessibleForFree?: boolean;
  datePublished?: string;
  dateModified?: string;
}

/** SoftwareSourceCode node for block/piece/component detail pages. */
export function buildSoftwareSourceCodeJsonLd(input: SoftwareSourceCodeInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: input.name,
    description: input.description,
    url: input.url,
    codeSampleType: "code snippet",
    programmingLanguage: "TSX",
    runtimePlatform: "React",
    keywords: input.category,
    isAccessibleForFree: input.isAccessibleForFree ?? true,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: { "@type": "Organization", name: "Beste UI", url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export interface SoftwareApplicationInput {
  name: string;
  description: string;
  url: string;
  /** Schema.org applicationCategory, e.g. "DeveloperApplication" */
  category?: string;
  keywords?: readonly string[];
}

/** SoftwareApplication node for the free tools at /tools. */
export function buildSoftwareApplicationJsonLd(input: SoftwareApplicationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: input.category ?? "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: "Beste UI", url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** FAQPage node for pages with a question/answer section. */
export function buildFaqPageJsonLd(faqs: readonly FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
