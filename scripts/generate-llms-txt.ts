/**
 * Writes public/llms.txt and public/llms-full.txt.
 *
 * llms.txt is a short map (about a hundred lines): what the product is and
 * where the important pages are. llms-full.txt is the long form (about a
 * thousand lines): product, installation, pricing, docs, MCP, and the catalog
 * summarised at category level. Neither file lists assets one by one; that is
 * what the registry index, the sitemaps and the Markdown renditions are for.
 *
 * Everything is read off disk with regular expressions rather than imported,
 * so the script has no dependency on the app's path aliases and runs under
 * bun or plain node.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SITE = "https://ui.beste.co";
const url = (path: string) => `${SITE}${path}`;
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), "utf-8");
const kebab = (title: string) => title.toLowerCase().replace(/\s+/g, "-");
const num = (n: number) => n.toLocaleString("en-US");

// ---------------------------------------------------------------------------
// Catalog tiers, read from each item's .meta.ts

interface Item {
  name: string;
  title: string;
  description: string;
  category: string;
  isPro: boolean;
}

function collect(dir: string): Item[] {
  const base = join(ROOT, dir);
  if (!existsSync(base)) return [];
  const items: Item[] = [];
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const metaPath = join(base, entry.name, `${entry.name}.meta.ts`);
    if (!existsSync(metaPath)) continue;
    const source = readFileSync(metaPath, "utf-8");
    if (/hidden:\s*true/.test(source)) continue;
    const name = source.match(/name:\s*["']([^"']+)["']/)?.[1];
    const title = source.match(/title:\s*["']([^"']+)["']/)?.[1];
    const description = (
      source.match(/description:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1] ??
      source.match(/description:\s*\n?\s*'((?:[^'\\]|\\.)*)'/)?.[1]
    )
      ?.replace(/\\(["'])/g, "$1")
      .replace(/\s*[—–]\s*/g, ": ");
    const category = source.match(/category:\s*["']([^"']+)["']/)?.[1];
    if (name && title && description && category) {
      items.push({ name, title, description, category, isPro: /isPro:\s*true/.test(source) });
    }
  }
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

function byCategory(items: Item[]): Map<string, Item[]> {
  const map = new Map<string, Item[]>();
  for (const item of items) map.set(item.category, [...(map.get(item.category) ?? []), item]);
  return new Map([...map.entries()].sort((a, b) => b[1].length - a[1].length));
}

// ---------------------------------------------------------------------------
// Category copy, collections, tools, posts, changelog, pricing

const categoryInfo = new Map<string, { title: string; description: string }>();
{
  const source = read("lib", "category-info.ts");
  for (const m of source.matchAll(/\n  "?([a-z-]+)"?: \{([\s\S]*?)\n  \},/g)) {
    const title = m[2].match(/\n\s*title: "([^"]+)"/)?.[1];
    const description = m[2].match(/\n\s*description:\s*\n?\s*"([^"]+)"/)?.[1]?.replace(/\s*[—–]\s*/g, ": ");
    if (title && description) categoryInfo.set(m[1], { title, description });
  }
}
// A few block categories are keyed differently in category-info than in meta.
const categoryAlias: Record<string, string> = { navigation: "navigation", navbar: "navigation" };

interface Collection {
  slug: string;
  label: string;
  description: string;
  count: number;
}
function collections(): Collection[] {
  const copy = read("lib", "collections.ts");
  const sets = read("lib", "block-sets.ts");
  const out: Collection[] = [];
  for (const m of copy.matchAll(
    /\n  ([a-z]+): \{\s*\n\s*label: "([^"]+)",\s*\n\s*description:\s*\n?\s*"([^"]+)"/g
  )) {
    const list = sets.match(new RegExp(`${m[1]}:\\s*\\[([^\\]]*)\\]`))?.[1] ?? "";
    out.push({
      slug: m[1],
      label: m[2],
      description: m[3],
      count: (list.match(/"/g)?.length ?? 0) / 2,
    });
  }
  return out;
}

interface Tool {
  slug: string;
  title: string;
  description: string;
  category: string;
}
function tools(): { categories: { id: string; title: string }[]; tools: Tool[] } {
  if (!existsSync(join(ROOT, "lib", "tools.ts"))) return { categories: [], tools: [] };
  const source = read("lib", "tools.ts");
  const categories = [...source.matchAll(/id: "([^"]+)",\s*\n\s*title: "([^"]+)"/g)].map((m) => ({
    id: m[1],
    title: m[2],
  }));
  const list: Tool[] = [];
  const body = source.slice(source.indexOf("export const tools"));
  for (const chunk of body.split(/\n  \{\n/).slice(1)) {
    const slug = chunk.match(/slug: "([^"]+)"/)?.[1];
    const title = chunk.match(/title: "([^"]+)"/)?.[1];
    const description = chunk.match(/description:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1];
    const category = chunk.match(/category: "([^"]+)"/)?.[1];
    if (slug && title && description && category) list.push({ slug, title, description, category });
  }
  return { categories, tools: list };
}

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
}
function posts(): Post[] {
  const dir = join(ROOT, "data", "posts");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const fm = readFileSync(join(dir, f), "utf-8").split("---")[1] ?? "";
      const pick = (key: string) => fm.match(new RegExp(`\\n${key}:\\s*"?([^"\\n]+)"?`))?.[1]?.trim() ?? "";
      return { slug: f.replace(/\.mdx$/, ""), title: pick("title"), description: pick("description"), date: pick("date") };
    })
    .filter((p) => p.title)
    .sort((a, b) => b.date.localeCompare(a.date));
}

interface Release {
  version: string;
  date: string;
  title: string;
}
function releases(limit: number): Release[] {
  const source = read("data", "changelog.ts");
  const out: Release[] = [];
  for (const m of source.matchAll(/version: "([^"]+)",\s*\n\s*date: "([^"]+)",\s*\n\s*title: "([^"]+)"/g)) {
    out.push({ version: m[1], date: m[2], title: m[3] });
    if (out.length === limit) break;
  }
  return out;
}

function tags(): { slug: string; label: string }[] {
  const path = join(ROOT, "public", "sitemap-tags.xml");
  if (!existsSync(path)) return [];
  return [...readFileSync(path, "utf-8").matchAll(/<loc>[^<]*\/blocks\/tag\/([^<]+)<\/loc>/g)].map((m) => ({
    slug: m[1],
    label: m[1].replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
  }));
}

function pricing() {
  const source = read("lib", "pricing.ts");
  const plan = (key: string) => {
    const block = source.match(new RegExp(`${key}: \\{([^}]*)\\}`))?.[1] ?? "";
    return {
      original: Number(block.match(/original:\s*(\d+)/)?.[1] ?? 0),
      discounted: Number(block.match(/discounted:\s*(\d+)/)?.[1] ?? 0),
    };
  };
  const enabled = /DISCOUNTS_ENABLED\s*=\s*true/.test(source);
  const end = Date.parse(source.match(/COUNTDOWN_END = new Date\("([^"]+)"\)/)?.[1] ?? "1970-01-01");
  const label = source.match(/SALE_LABEL = "([^"]+)"/)?.[1] ?? "sale";
  const lifetime = plan("lifetime");
  const team = plan("team");
  const sale =
    enabled && Date.now() < end && (lifetime.discounted < lifetime.original || team.discounted < team.original);
  return { lifetime, team, sale, label, endsOn: new Date(end).toISOString().slice(0, 10) };
}

// ---------------------------------------------------------------------------

function main() {
  const blocks = collect("registry");
  const pages = collect("registry-pages");
  const pieces = collect("registry-pieces");
  const components = collect("registry-components");
  const blockCats = byCategory(blocks);
  const pieceCats = byCategory(pieces);
  const componentCats = byCategory(components);
  const pageCats = byCategory(pages);
  const cols = collections();
  const { categories: toolCats, tools: toolList } = tools();
  const postList = posts();
  const tagList = tags();
  const price = pricing();
  const freeBlocks = blocks.filter((b) => !b.isPro).length;

  const catMeta = (title: string) => {
    const slug = kebab(title);
    const info = categoryInfo.get(categoryAlias[slug] ?? slug) ?? categoryInfo.get(slug);
    return { slug, description: info?.description ?? `${title} sections.` };
  };

  const priceLine = (name: string, p: { original: number; discounted: number }) =>
    price.sale && p.discounted < p.original
      ? `$${p.discounted} during the ${price.label} (normally $${p.original}, sale ends ${price.endsOn})`
      : `$${p.original}`;

  // ------------------------------------------------------------- llms.txt

  const short = `# Beste UI

> Production-ready shadcn/ui blocks, pages, pieces and components for React, Next.js and Tailwind CSS. Install any of them with the shadcn CLI, or let an AI agent search and install them over MCP. Most of the catalog is free; a one-time Pro license unlocks the rest.

Beste UI is made by [beste.co](https://beste.co), an opinionated block-based site builder. This site is the component catalog. Canonical host: ${SITE}. Every page is also readable as Markdown: add \`.md\` to any address or send \`Accept: text/markdown\`. The long-form version of this file is ${url("/llms-full.txt")}.

## Start here

- [Documentation](${url("/docs")}): What Beste UI is, the two primitive flavors, how you install, what is free and what is Pro.
- [Installation](${url("/docs/installation")}): Initialise shadcn/ui, install a block by URL or by \`@beste-ui/name\`, unlock Pro with an email and license key.
- [shadcn CLI reference](${url("/docs/cli")}): init, add and build, and the predictable registry URLs behind every asset.
- [Theming](${url("/docs/theming")}): CSS variables, the background/foreground convention, dark mode, radius and tones.
- [MCP server](${url("/docs/mcp")}): Connect Claude Code, Cursor, Windsurf or VS Code to ${url("/api/mcp")} and search, compose and install in plain language.
- [Pricing and Pro](${url("/docs/pricing")}): Why Pro exists, what the license covers, the student discount, how to request an asset.
- [Pricing](${url("/pricing")}): Plans and checkout.
- [License](${url("/license")}): The full license text.
- [Changelog](${url("/changelog")}): Every release, newest first.
- [Blog](${url("/blog")}): Long-form posts on shadcn, theming, forms, MCP and the catalog.

## Catalog

- [Blocks](${url("/blocks")}): ${num(blocks.length)} full page sections in ${blockCats.size} categories. ${num(freeBlocks)} are free, the rest are Pro.
- [Pages](${url("/pages")}): ${pages.length} whole pages composed from the blocks. One command installs a page and every block inside it.
- [Pieces](${url("/pieces")}): ${num(pieces.length)} small widgets in ${pieceCats.size} categories that drop into the media slots of a block. Free.
- [Components](${url("/components")}): ${components.length} styled primitives in ${componentCats.size} categories: buttons, badges, cards, text effects, inspector controls. Free.
- [Search](${url("/search")}): Search every tier by name or by describing what you need.

## Block categories

${[...blockCats.entries()]
  .map(([title, items]) => {
    const { slug, description } = catMeta(title);
    return `- [${title}](${url(`/blocks/${slug}`)}): ${items.length} blocks. ${description}`;
  })
  .join("\n")}

## Collections

Sets of blocks that share one design language, so a whole site reads as one piece.

${cols.map((c) => `- [${c.label}](${url(`/blocks/collection/${c.slug}`)}): ${c.count} blocks. ${c.description}`).join("\n")}

## For agents

- [MCP endpoint](${url("/api/mcp")}): Streamable HTTP. Tools: search_blocks, get_block, get_block_source, list_categories, list_collections, install_block, compose_page. No key needed except for Pro sources.
- [Registry index](${url("/r/registry.json")}): Every block as a shadcn registry item. Base UI flavor at ${url("/r-base/registry.json")}.
- [Markdown](${url("/index.md")}): This site as Markdown, one page at a time.
- [Full guide](${url("/llms-full.txt")}): Installation, pricing, MCP and the catalog in detail.

## Optional

- [Free tools](${url("/tools")}): ${toolList.length} browser-based developer tools in ${toolCats.length} categories. No signup, nothing uploaded.
- [GitHub](https://github.com/beste-co/beste-ui): Source and issues.
- [X](https://x.com/withbeste): Release notes and questions.
- [RSS](${url("/rss.xml")}): The changelog as a feed.
- [Sitemap](${url("/sitemap.xml")}): Every canonical URL on the site.
`;

  // -------------------------------------------------------- llms-full.txt

  const full = `# Beste UI

> Production-ready shadcn/ui blocks, pages, pieces and components for React, Next.js and Tailwind CSS. Install any of them with the shadcn CLI, or let an AI agent search and install them over MCP. Most of the catalog is free; a one-time Pro license unlocks the rest.

Canonical host: ${SITE}. The short map of this site is ${url("/llms.txt")}. Every page is also readable as Markdown: add \`.md\` to any address or send \`Accept: text/markdown\`.

## What Beste UI is

Beste UI is a catalog of production-ready UI built on shadcn/ui and Tailwind CSS. Everything is typed React that installs straight into your project with the shadcn CLI, so what lands in your repository is source you own: no runtime dependency, nothing to upgrade. It is made by [beste.co](https://beste.co), an opinionated block-based site builder, and the same blocks power sites built there.

The catalog has four tiers:

- **Blocks** (${url("/blocks")}): full page sections such as heroes, pricing, features, testimonials and footers. Drop one in and you have a finished section, wired with realistic demo content. ${num(blocks.length)} blocks in ${blockCats.size} categories; ${num(freeBlocks)} are free and ${num(blocks.length - freeBlocks)} are Pro.
- **Pages** (${url("/pages")}): whole screens composed from the blocks. Installing a page installs every block, piece and primitive behind it in one command. ${pages.length} pages.
- **Pieces** (${url("/pieces")}): small, self-contained UI parts such as stat cards, prompt inputs and media rows. They drop into the media slots inside a block or into your own layouts. ${num(pieces.length)} pieces in ${pieceCats.size} categories, all free.
- **Components** (${url("/components")}): styled primitives built on shadcn/ui, with extra variants and tones beyond the defaults: buttons, badges, cards, text effects, chart and inspector controls. ${components.length} components in ${componentCats.size} categories, all free.

Every asset has a detail page with a live preview, the install command in both flavors, its props and a README. Blocks live at \`/block/{name}\`, pages at \`/page/{name}\`, pieces at \`/piece/{name}\` and components at \`/component/{name}\`.

## What an asset looks like

- **One file, named exports.** A block is a single \`.tsx\` file that exports the component (\`Hero7\`) and its demo props (\`hero7Demo\`), the exact data behind the preview. Spread the demo to get a working section in one line, then replace it with your own props.
- **Props, not slots.** Headings, descriptions, buttons, images and lists are all props with plain types (\`ActionButton\`, \`Avatar\`, \`Fact\`). Arrays default to empty and every part is optional, so a block collapses gracefully when a prop is left out.
- **Installs where shadcn puts it.** The CLI writes blocks to \`components/beste/block/{name}.tsx\`, pieces to \`components/beste/piece/{name}.tsx\` and components to \`components/beste/component/{name}.tsx\`, and pulls in the shadcn primitives (button, input, tabs) and Beste components the block imports.
- **Theme tokens only.** No literal colours: every surface reads \`bg-background\`, \`text-foreground\`, \`bg-muted\` and friends, so a block matches your theme the moment it lands.
- **Demo content is realistic.** Copy, photographs and figures are written for the block's purpose so the preview shows what the section is for, not lorem ipsum.
- **README on every page.** Installation, quick start, a props table and behaviour notes derived from the source, rendered on the asset page and available as Markdown.

## Two flavors: Radix and Base UI

shadcn/ui is moving its default primitive layer to Base UI. Every Beste asset ships in both flavors: a Base UI variant served from \`/r-base/…\` (the default) and a Radix variant served from \`/r/…\`. The markup and design are identical; only the underlying primitive differs. The install command on each asset page lets you switch flavor before you copy it.

## Installation

Two paths, same result: copy the install command from any asset page and run it with the shadcn CLI, or connect the MCP server and ask an agent for the UI you want.

### 1. Initialise shadcn/ui

\`\`\`bash
npx shadcn@latest init
# Vite projects
npx shadcn@latest init -t vite
\`\`\`

### 2. Install an asset

Each asset is available at a predictable URL in both flavors:

\`\`\`bash
# Base UI (default)
npx shadcn@latest add "${url("/r-base/hero7.json")}"

# Radix
npx shadcn@latest add "${url("/r/hero7.json")}"
\`\`\`

Pages, pieces and components follow the same pattern under \`/page/r/{name}\`, \`/piece/r/{name}\` and \`/component/r/{name}\`. Or add the registry once and install by a short name. The namespace currently resolves to the Radix variant only:

\`\`\`bash
npx shadcn@latest registry add @beste-ui
npx shadcn@latest add @beste-ui/hero7
\`\`\`

### 3. Pro assets

Pro assets require a license. Add your account email and license key as query parameters and the CLI fetches the real source. Signed-in Pro users get this exact command pre-filled on every asset page; the key lives on the account page.

\`\`\`bash
npx shadcn@latest add "${url("/r-base/hero7.json")}?email=you@example.com&license_key=YOUR_LICENSE_KEY"
\`\`\`

Full docs: ${url("/docs/installation")} and the CLI reference at ${url("/docs/cli")}.

## Theming

Beste assets are styled entirely with shadcn/ui theme tokens, so they inherit your theme. Instead of literal colours, components reference CSS variables such as \`--background\`, \`--foreground\`, \`--primary\` and \`--muted\` that live in your global stylesheet; change the variables and every block updates with you. Dark mode is the same variables under a \`.dark\` class, and radius is one token. Some pieces and components expose a \`tone\` prop (for example \`neutral\`) that swaps a small set of token classes so the same component can read as quiet or prominent without new CSS. Docs: ${url("/docs/theming")}.

## MCP server

Beste UI ships a hosted MCP server at ${url("/api/mcp")} over Streamable HTTP, so it drops into any compliant client with a single URL: Claude Code, Cursor, Windsurf, VS Code and others. Searching, previews, metadata, install commands and every free source work with no account. A Pro license is only needed to pull the source of Pro blocks.

### Setup

Add the server to your MCP config:

\`\`\`json
{
  "mcpServers": {
    "beste-ui": { "url": "${url("/api/mcp")}" }
  }
}
\`\`\`

Claude Code can add it with one command: \`npx shadcn@latest mcp init --client claude\`. To let the agent pull Pro sources, put your license on the endpoint: \`${url("/api/mcp")}?email=you@example.com&license_key=YOUR_LICENSE_KEY\`.

### Tools

| Tool | Arguments | License | What it does |
| --- | --- | --- | --- |
| search_blocks | query, type?, category?, collection?, limit? | Open | Semantic and keyword search across the whole catalog. Returns ranked matches with name, title, category, Pro status and URL. |
| get_block | name, type?, flavor? | Open | Metadata for one asset: description, category, preview URL and the shadcn install command. |
| get_block_source | name, type?, flavor? | License for Pro sources | The full .tsx source. Free items return immediately; Pro blocks require a valid license. |
| list_categories | none | Open | Every category with its title and description. |
| list_collections | none | Open | The studio collections: sets of blocks that share one design language, with a slug to pass to search_blocks or compose_page. |
| install_block | name, type?, flavor? | Open | The exact shadcn CLI command to drop an asset into a project. |
| compose_page | intent, collection?, limit? | Open | Give it a page intent and it returns an ordered set of blocks that compose a full page. Name a collection and every section comes from that one set. |

### Try asking

- Add a pricing section with three tiers and a monthly/yearly toggle.
- Find a hero with a product screenshot and a waitlist form.
- Compose a landing page for a developer CLI tool.
- Swap this testimonials block for a marquee of logos.
- Build me a page using blocks from the Sirius collection.

### How it works

Every block, piece and component is embedded at build time with a small open model, and queries are embedded the same way on the server, so search matches intent rather than keywords. No third-party AI service is in the path. Pro sources use the exact license check the CLI and the site use. Docs: ${url("/docs/mcp")}.

### Questions

- **Which AI tools does it work with?** Any MCP-capable client, including Claude Code, Cursor, Windsurf and VS Code. It speaks the standard Streamable HTTP transport, so no custom plugin is needed.
- **Do I need a license?** No. Searching, previews, metadata, install commands and all free sources work with no license. A Pro license is only required to pull the source of Pro blocks through get_block_source.
- **How is it different from shadcn's own MCP?** shadcn's MCP resolves registry items by name. Beste's understands intent: it searches a catalog of thousands of finished sections by meaning, composes whole pages from them, and keeps every section inside one collection when asked.

## Reading this site as Markdown

Every page has a Markdown rendition at the same address with a \`.md\` suffix, or by sending an \`Accept: text/markdown\` header. The renditions carry \`X-Robots-Tag: noindex\` so they stay out of search results. The block registry index is at ${url("/r/registry.json")} (Base UI: ${url("/r-base/registry.json")}), the changelog feed at ${url("/rss.xml")}, and the sitemap at ${url("/sitemap.xml")}. robots.txt allows answer engines to crawl and cite, and declares \`ai-train=no\`.

## Pricing and Pro

Most of Beste UI is free: a large slice of the blocks plus every page, piece and component, and all previews, metadata, search, install commands and the MCP server for every asset. A Pro license unlocks the full source of Pro blocks. It is a one-time purchase, yours forever, including everything added later, for unlimited personal, commercial and client projects with no attribution required. Pro licenses are what keep a small team maintaining a large catalog in two flavors as shadcn, React and Tailwind evolve.

### Plans

- **Lifetime**: ${priceLine("Lifetime", price.lifetime)}. Pay once, access forever. Covers a single developer.
- **Team**: ${priceLine("Team", price.team)}. Up to 8 developers; the license owner invites the seats from their account.

Both are a single payment, never a subscription. Nothing renews.

What a license includes:

- Every Pro block, now and later: the whole Pro catalog and every block added after you buy. New ones ship every week.
- Every full page, one command: whole pages composed from the blocks.
- Pro sources in the CLI and MCP: pull them with the shadcn CLI or let your agent pull them through the MCP server with your license key.
- Typed source you own outright: React and Tailwind copied into your repository, no runtime dependency.
- Radix and Base UI flavors of every block.

Students: write from a school email address and you get a discount. Missing an asset: tell the team what you are building and request a block, piece or component. Plans and checkout: ${url("/pricing")}. Background: ${url("/docs/pricing")}.

### License

Permission is granted to use, copy, modify and merge the software in personal and commercial projects, with three restrictions: no resale of the components or derivatives as a standalone product or UI kit, no redistribution of the source on other marketplaces or component stores, and no rebranding. Full text: ${url("/license")}.

### Referral programme

Signed-in users get a referral link. You earn 30% commission on every payment a referred new user makes for 12 months after they sign up, renewals included. Referrals are tracked for 30 days after the click, commissions are confirmed 30 days after payment, and payouts go out monthly two months in arrears with a $100 minimum. Details: ${url("/referrals")}.

## Block categories

Each category has its own page with every block in it. Counts are blocks; "free" is how many of them install without a license. The examples are a few block names to give a sense of the range; every block has a detail page at \`/block/{name}\`.

${[...blockCats.entries()]
  .map(([title, items]) => {
    const { slug, description } = catMeta(title);
    const free = items.filter((i) => !i.isPro).length;
    const examples = items.slice(0, 5).map((i) => `${i.title} (${i.name})`).join(", ");
    return `### ${title}

- URL: ${url(`/blocks/${slug}`)}
- ${items.length} blocks, ${free} free
- ${description}
- Examples: ${examples}`;
  })
  .join("\n\n")}

## Tags

Cross-category tag pages, each collecting the blocks across the catalog that share one purpose:

${tagList.map((t) => `- [${t.label}](${url(`/blocks/tag/${t.slug}`)})`).join("\n")}

## Collections

Studio collections are sets of blocks that share one design language: type, spacing, motion and button style agree across every section, so a page composed from one collection reads as one piece. Pass a collection slug to the MCP server's search_blocks or compose_page to stay inside it.

${cols
  .map(
    (c) => `### ${c.label}

- URL: ${url(`/blocks/collection/${c.slug}`)}
- ${c.count} blocks
- ${c.description}`
  )
  .join("\n\n")}

## Pages

Complete, ready-to-ship screens composed from the block catalog. Install a page and get every block, piece and primitive behind it in one command. Listing: ${url("/pages")}. Each page also belongs to a collection, at \`/pages/collection/{slug}\`.

${[...pageCats.entries()]
  .map(
    ([category, items]) =>
      `### ${category}\n\n${items.map((p) => `- [${p.title}](${url(`/page/${p.name}`)}): ${p.description}`).join("\n")}`
  )
  .join("\n\n")}

## Pieces

${num(pieces.length)} small widgets, all free. Listing: ${url("/pieces")}. Each category page lists every piece in it.

${[...pieceCats.entries()]
  .map(([category, items]) => `- [${category}](${url(`/pieces/${kebab(category)}`)}): ${items.length} pieces`)
  .join("\n")}

## Components

${components.length} styled primitives, all free. Listing: ${url("/components")}.

${[...componentCats.entries()]
  .map(([category, items]) => `- [${category}](${url(`/components/${kebab(category)}`)}): ${items.length} components`)
  .join("\n")}
${
  toolList.length > 0
    ? `
## Free tools

${toolList.length} browser-based developer tools at ${url("/tools")}. Every tool runs in the browser, is free and needs no account; nothing is uploaded.

${toolCats
  .map((cat) => {
    const list = toolList.filter((t) => t.category === cat.id);
    if (list.length === 0) return "";
    return `### ${cat.title}\n\n${list
      .map((t) => `- [${t.title}](${url(`/tools/${t.slug}`)}): ${t.description}`)
      .join("\n")}`;
  })
  .filter(Boolean)
  .join("\n\n")}
`
    : ""
}
## Blog

Long-form posts at ${url("/blog")}. Feed: ${url("/blog/feed.xml")}.

${postList.map((p) => `- [${p.title}](${url(`/blog/${p.slug}`)}) (${p.date}): ${p.description}`).join("\n")}

## Recent releases

The full changelog is at ${url("/changelog")}; the latest releases:

${releases(12)
  .map((r) => `- ${r.version} (${r.date}): ${r.title}`)
  .join("\n")}

## Links

- Homepage: ${SITE}
- Site builder: https://beste.co
- GitHub: https://github.com/beste-co/beste-ui
- X: https://x.com/withbeste
- Short map: ${url("/llms.txt")}
`;

  writeFileSync(join(ROOT, "public", "llms.txt"), short, "utf-8");
  writeFileSync(join(ROOT, "public", "llms-full.txt"), full, "utf-8");

  console.log(
    `Generated llms.txt (${short.split("\n").length} lines) and llms-full.txt (${full.split("\n").length} lines): ` +
      `${blocks.length} blocks in ${blockCats.size} categories, ${pages.length} pages, ${pieces.length} pieces, ` +
      `${components.length} components, ${cols.length} collections, ${toolList.length} tools, ${postList.length} posts`
  );
}

main();
