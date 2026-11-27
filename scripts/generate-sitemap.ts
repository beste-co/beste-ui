import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
// Generated next door by sets:generate; only its keys are used here, so the
// collection archives appear in the sitemap without a second list to maintain.
import { BLOCK_SETS } from "../lib/block-sets";
// The keyword half of the tag registry, split out of lib/tags.ts so this
// script can read it without importing lib/blocks and its 1935 components.
import { keywordTags, tagSlug } from "../lib/tag-slugs";

const SITE_URL = "https://beste.dev";
const PUBLIC_DIR = join(import.meta.dirname, "..", "public");
const REGISTRY_BLOCKS_DIR = join(import.meta.dirname, "..", "registry");
const REGISTRY_COMPONENTS_DIR = join(import.meta.dirname, "..", "registry-pieces");
const REGISTRY_UI_COMPONENTS_DIR = join(import.meta.dirname, "..", "registry-components");
const REGISTRY_PAGES_DIR = join(import.meta.dirname, "..", "registry-pages");

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

interface MetaItem {
  name: string;
  category: string;
  /** Tags a block declares for itself; each one earns an archive page. */
  tags: string[];
}

const today = new Date().toISOString().split("T")[0] ?? "";

function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Parse all `<name>.meta.ts` files inside a registry directory and pull out
 * `name` + `category` fields. Avoids importing TS at build time.
 */
function collectMeta(registryDir: string): MetaItem[] {
  if (!existsSync(registryDir)) return [];
  const items: MetaItem[] = [];
  const dirs = readdirSync(registryDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const dirName of dirs) {
    const metaPath = join(registryDir, dirName, `${dirName}.meta.ts`);
    if (!existsSync(metaPath)) continue;
    const source = readFileSync(metaPath, "utf-8");
    if (/internal:\s*true/.test(source)) continue;
    const name = source.match(/name:\s*["']([^"']+)["']/)?.[1];
    const category = source.match(/category:\s*["']([^"']+)["']/)?.[1];
    const tagsBlock = source.match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? "";
    const tags = Array.from(tagsBlock.matchAll(/["']([^"']+)["']/g)).map((m) => m[1] as string);
    if (name && category) items.push({ name, category, tags });
  }
  return items;
}

function uniqueCategories(items: MetaItem[]): string[] {
  const set = new Set<string>();
  for (const it of items) {
    if (it.category && it.category !== "Coming Soon") set.add(it.category);
  }
  return Array.from(set).sort();
}

function renderUrlset(entries: SitemapEntry[]): string {
  const body = entries
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function renderSitemapIndex(filenames: string[]): string {
  const body = filenames
    .map(
      (name) => `  <sitemap>
    <loc>${SITE_URL}/${name}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

function writeSitemap(filename: string, contents: string) {
  writeFileSync(join(PUBLIC_DIR, filename), contents, "utf-8");
}

function generate() {
  const blocks = collectMeta(REGISTRY_BLOCKS_DIR);
  const components = collectMeta(REGISTRY_COMPONENTS_DIR);
  const uiComponents = collectMeta(REGISTRY_UI_COMPONENTS_DIR);

  // 1. Static pages
  const pages: SitemapEntry[] = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: "weekly", priority: "1.0" },
    { loc: `${SITE_URL}/blocks`, lastmod: today, changefreq: "weekly", priority: "0.9" },
    { loc: `${SITE_URL}/pieces`, lastmod: today, changefreq: "weekly", priority: "0.9" },
    { loc: `${SITE_URL}/components`, lastmod: today, changefreq: "weekly", priority: "0.9" },
    { loc: `${SITE_URL}/pricing`, lastmod: today, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE_URL}/docs`, lastmod: today, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE_URL}/docs/installation`, lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${SITE_URL}/docs/cli`, lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${SITE_URL}/docs/theming`, lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${SITE_URL}/docs/mcp`, lastmod: today, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE_URL}/docs/pricing`, lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${SITE_URL}/changelog`, lastmod: today, changefreq: "weekly", priority: "0.7" },
    { loc: `${SITE_URL}/license`, lastmod: today, changefreq: "yearly", priority: "0.5" },
  ];

  for (const collection of Object.keys(BLOCK_SETS)) {
    pages.push({
      loc: `${SITE_URL}/blocks/collection/${collection}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  // 2. Category listing pages (blocks + components)
  const categories: SitemapEntry[] = [];
  for (const cat of uniqueCategories(blocks)) {
    categories.push({
      loc: `${SITE_URL}/blocks/${categorySlug(cat)}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    });
  }
  for (const cat of uniqueCategories(components)) {
    categories.push({
      loc: `${SITE_URL}/pieces/${categorySlug(cat)}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    });
  }
  for (const cat of uniqueCategories(uiComponents)) {
    categories.push({
      loc: `${SITE_URL}/components/${categorySlug(cat)}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  // The pages tier's listings are entry points; the compositions themselves are noindex
  const registryPages = collectMeta(REGISTRY_PAGES_DIR);
  if (registryPages.length > 0) {
    pages.push({ loc: `${SITE_URL}/pages`, lastmod: today, changefreq: "weekly", priority: "0.9" });
    for (const cat of uniqueCategories(registryPages)) {
      categories.push({ loc: `${SITE_URL}/pages/${categorySlug(cat)}`, lastmod: today, changefreq: "weekly", priority: "0.7" });
    }
    for (const collection of Object.keys(BLOCK_SETS)) {
      categories.push({
        loc: `${SITE_URL}/pages/collection/${collection}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.7",
      });
    }
  }

  // 3. Component detail pages
  const componentEntries: SitemapEntry[] = uiComponents.map((c) => ({
    loc: `${SITE_URL}/component/${c.name}`,
    lastmod: today,
    changefreq: "monthly",
    priority: "0.6",
  }));

  // 4. Tag archives. Two sources, matching lib/tags.ts: keywords that span two
  // or more categories, and tags a block declares for itself.
  const tagSlugs = new Set(keywordTags().map((tag) => tag.slug));
  for (const block of blocks) {
    for (const keyword of block.tags) {
      const slug = tagSlug(keyword);
      if (slug) tagSlugs.add(slug);
    }
  }
  const tagEntries: SitemapEntry[] = Array.from(tagSlugs)
    .sort()
    .map((slug) => ({
      loc: `${SITE_URL}/blocks/tag/${slug}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.7",
    }));

  writeSitemap("sitemap-pages.xml", renderUrlset(pages));
  writeSitemap("sitemap-categories.xml", renderUrlset(categories));
  writeSitemap("sitemap-components.xml", renderUrlset(componentEntries));
  writeSitemap("sitemap-tags.xml", renderUrlset(tagEntries));

  const children = [
    "sitemap-pages.xml",
    "sitemap-categories.xml",
    "sitemap-components.xml",
    "sitemap-tags.xml",
  ];
  writeSitemap("sitemap.xml", renderSitemapIndex(children));

  console.log(
    `Generated sitemaps:\n` +
      `  - sitemap.xml (index, ${children.length} children)\n` +
      `  - sitemap-pages.xml (${pages.length})\n` +
      `  - sitemap-categories.xml (${categories.length})\n` +
      `  - sitemap-components.xml (${componentEntries.length})\n` +
      `  - sitemap-tags.xml (${tagEntries.length})`
  );
}

generate();
