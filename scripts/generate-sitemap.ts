import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = "https://ui.beste.co";
const PUBLIC_DIR = join(import.meta.dirname, "..", "public");
const REGISTRY_BLOCKS_DIR = join(import.meta.dirname, "..", "registry");
const REGISTRY_COMPONENTS_DIR = join(import.meta.dirname, "..", "registry-pieces");
const REGISTRY_UI_COMPONENTS_DIR = join(import.meta.dirname, "..", "registry-components");
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
    if (name && category) items.push({ name, category });
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

  writeSitemap("sitemap-pages.xml", renderUrlset(pages));
  writeSitemap("sitemap-categories.xml", renderUrlset(categories));
  writeSitemap("sitemap-blocks.xml", renderUrlset(blockEntries));
  writeSitemap("sitemap-pieces.xml", renderUrlset(pieceEntries));
  writeSitemap("sitemap-components.xml", renderUrlset(componentEntries));
  writeSitemap("sitemap-blog.xml", renderUrlset(blogEntries));
  writeSitemap(
    "sitemap.xml",
    renderSitemapIndex([
      "sitemap-pages.xml",
      "sitemap-categories.xml",
      "sitemap-blocks.xml",
      "sitemap-pieces.xml",
      "sitemap-components.xml",
      "sitemap-blog.xml",
    ])
  );

  console.log(
    `Generated sitemaps:\n` +
      `  - sitemap.xml (index, 6 children)\n` +
      `  - sitemap-pages.xml (${pages.length})\n` +
      `  - sitemap-categories.xml (${categories.length})\n` +
      `  - sitemap-blocks.xml (${blockEntries.length})\n` +
      `  - sitemap-pieces.xml (${pieceEntries.length})\n` +
      `  - sitemap-components.xml (${componentEntries.length})\n` +
      `  - sitemap-blog.xml (${blogEntries.length})`
  );
}

generate();
