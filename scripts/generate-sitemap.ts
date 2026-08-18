import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
// Generated next door by sets:generate; only its keys are used here, so the
// collection archives appear in the sitemap without a second list to maintain.
import { BLOCK_SETS } from "../lib/block-sets";
// The free tools at /tools register themselves in one list; the sitemap reads
// the same list the hub does, so a new tool needs no second edit here.
import { getPopulatedCategories, tools } from "../lib/tools";
// The keyword half of the tag registry, split out of lib/tags.ts so this
// script can read it without importing lib/blocks and its 1935 components.
import { keywordTags, tagSlug } from "../lib/tag-slugs";

const SITE_URL = "https://ui.beste.co";
const PUBLIC_DIR = join(import.meta.dirname, "..", "public");
const REGISTRY_BLOCKS_DIR = join(import.meta.dirname, "..", "registry");
const REGISTRY_COMPONENTS_DIR = join(import.meta.dirname, "..", "registry-pieces");
const REGISTRY_UI_COMPONENTS_DIR = join(import.meta.dirname, "..", "registry-components");
const REGISTRY_PAGES_DIR = join(import.meta.dirname, "..", "registry-pages");
const CHANGELOG_PATH = join(import.meta.dirname, "..", "data", "changelog.ts");
const POSTS_DIR = join(import.meta.dirname, "..", "data", "posts");

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
    const name = source.match(/name:\s*["']([^"']+)["']/)?.[1];
    const category = source.match(/category:\s*["']([^"']+)["']/)?.[1];
    const tagsBlock = source.match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? "";
    const tags = Array.from(tagsBlock.matchAll(/["']([^"']+)["']/g)).map((m) => m[1] as string);
    if (name && category) items.push({ name, category, tags });
  }
  return items;
}

/**
 * Build a map of block names to changelog dates so detail pages get a
 * meaningful <lastmod>. Falls back to today's date if not found.
 */
function buildBlockDateMap(): Map<string, string> {
  if (!existsSync(CHANGELOG_PATH)) return new Map();
  const source = readFileSync(CHANGELOG_PATH, "utf-8");
  const dateBlockPattern = /date:\s*["'](\d{4}-\d{2}-\d{2})["'][\s\S]*?blocks:\s*\[([\s\S]*?)\]/g;
  const blockNamePattern = /name:\s*["']([^"']+)["']/g;
  const map = new Map<string, string>();

  let m = dateBlockPattern.exec(source);
  while (m !== null) {
    const date = m[1] ?? "";
    const section = m[2] ?? "";
    blockNamePattern.lastIndex = 0;
    let nm = blockNamePattern.exec(section);
    while (nm !== null) {
      const name = nm[1];
      if (name && !map.has(name)) map.set(name, date);
      nm = blockNamePattern.exec(section);
    }
    m = dateBlockPattern.exec(source);
  }
  return map;
}

interface PostItem {
  slug: string;
  date: string;
}

/**
 * Collect published blog posts from `data/posts/*.mdx`. A post is published
 * when its frontmatter has a `date`; files without one are drafts and are
 * skipped (mirrors lib/posts.ts).
 */
function collectPosts(): PostItem[] {
  if (!existsSync(POSTS_DIR)) return [];
  const posts: PostItem[] = [];
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const source = readFileSync(join(POSTS_DIR, file), "utf-8");
    const date = source.match(/^date:\s*["'](\d{4}-\d{2}-\d{2})["']/m)?.[1];
    if (!date) continue;
    posts.push({ slug: file.replace(/\.mdx$/, ""), date });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
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
  const blockDates = buildBlockDateMap();
  const posts = collectPosts();

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

  // 3. Block detail pages
  const blockEntries: SitemapEntry[] = blocks.map((b) => ({
    loc: `${SITE_URL}/block/${b.name}`,
    lastmod: blockDates.get(b.name) ?? today,
    changefreq: "monthly",
    priority: "0.6",
  }));

  // 4. Piece detail pages
  const pieceEntries: SitemapEntry[] = components.map((c) => ({
    loc: `${SITE_URL}/piece/${c.name}`,
    lastmod: today,
    changefreq: "monthly",
    priority: "0.6",
  }));

  // 5. Component detail pages
  const componentEntries: SitemapEntry[] = uiComponents.map((c) => ({
    loc: `${SITE_URL}/component/${c.name}`,
    lastmod: today,
    changefreq: "monthly",
    priority: "0.6",
  }));

  // 6. Blog: listing page (lastmod = newest post) + one entry per post
  const blogEntries: SitemapEntry[] = [
    {
      loc: `${SITE_URL}/blog`,
      lastmod: posts[0]?.date ?? today,
      changefreq: "weekly",
      priority: "0.8",
    },
    ...posts.map((p) => ({
      loc: `${SITE_URL}/blog/${p.slug}`,
      lastmod: p.date,
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];

  // 7. Free tools: hub, category hubs, one entry per tool. The open-source
  // build stubs the registry empty because it does not carry the routes, so an
  // empty list means no file and no entry in the index rather than dead URLs.
  const toolEntries: SitemapEntry[] =
    tools.length === 0
      ? []
      : [
          { loc: `${SITE_URL}/tools`, lastmod: today, changefreq: "weekly", priority: "0.8" },
          ...getPopulatedCategories().map((c) => ({
            loc: `${SITE_URL}/tools/category/${c.id}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...tools.map((t) => ({
            loc: `${SITE_URL}/tools/${t.slug}`,
            // A future `added` date would make lastmod untrustworthy, so it is capped.
            lastmod: t.added > today ? today : t.added,
            changefreq: "monthly",
            priority: "0.7",
          })),
        ];

  // 8. The Pages tier: hub, category archives, collection archives and the
  // page compositions themselves. Every one of these is a linked, indexable
  // route, and none of them was in a sitemap before -- which also meant none
  // of them was ever announced through IndexNow, since scripts/indexnow.ts
  // takes its list straight from sitemap.xml.
  const registryPages = collectMeta(REGISTRY_PAGES_DIR);
  const pageTierEntries: SitemapEntry[] =
    registryPages.length === 0
      ? []
      : [
          { loc: `${SITE_URL}/pages`, lastmod: today, changefreq: "weekly", priority: "0.9" },
          ...uniqueCategories(registryPages).map((cat) => ({
            loc: `${SITE_URL}/pages/${categorySlug(cat)}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...Object.keys(BLOCK_SETS).map((collection) => ({
            loc: `${SITE_URL}/pages/collection/${collection}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...registryPages.map((page) => ({
            loc: `${SITE_URL}/page/${page.name}`,
            lastmod: today,
            changefreq: "monthly",
            // Eighteen of them against 1935 blocks, and each one is a whole
            // screen: worth more of the crawl than a single section.
            priority: "0.8",
          })),
        ];

  // 9. Tag archives. Two sources, matching lib/tags.ts: keywords that span two
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
  writeSitemap("sitemap-blocks.xml", renderUrlset(blockEntries));
  writeSitemap("sitemap-pieces.xml", renderUrlset(pieceEntries));
  writeSitemap("sitemap-components.xml", renderUrlset(componentEntries));
  writeSitemap("sitemap-blog.xml", renderUrlset(blogEntries));
  writeSitemap("sitemap-tags.xml", renderUrlset(tagEntries));

  const children = [
    "sitemap-pages.xml",
    "sitemap-categories.xml",
    "sitemap-blocks.xml",
    "sitemap-pieces.xml",
    "sitemap-components.xml",
    "sitemap-blog.xml",
    "sitemap-tags.xml",
  ];
  if (pageTierEntries.length > 0) {
    writeSitemap("sitemap-page-tier.xml", renderUrlset(pageTierEntries));
    children.push("sitemap-page-tier.xml");
  }
  if (toolEntries.length > 0) {
    writeSitemap("sitemap-tools.xml", renderUrlset(toolEntries));
    children.push("sitemap-tools.xml");
  }
  writeSitemap("sitemap.xml", renderSitemapIndex(children));

  console.log(
    `Generated sitemaps:\n` +
      `  - sitemap.xml (index, ${children.length} children)\n` +
      `  - sitemap-pages.xml (${pages.length})\n` +
      `  - sitemap-categories.xml (${categories.length})\n` +
      `  - sitemap-blocks.xml (${blockEntries.length})\n` +
      `  - sitemap-pieces.xml (${pieceEntries.length})\n` +
      `  - sitemap-components.xml (${componentEntries.length})\n` +
      `  - sitemap-blog.xml (${blogEntries.length})\n` +
      `  - sitemap-tags.xml (${tagEntries.length})` +
      (pageTierEntries.length > 0
        ? `\n  - sitemap-page-tier.xml (${pageTierEntries.length})`
        : "") +
      (toolEntries.length > 0 ? `\n  - sitemap-tools.xml (${toolEntries.length})` : "")
  );
}

generate();
