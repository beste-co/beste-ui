import { readFileSync, writeFileSync } from "node:fs";

import { join } from "node:path";

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
}

interface Registry {
  homepage: string;
  items: RegistryItem[];
}

const SITE_URL = "https://ui.beste.co";

/**
 * Build a map of block names to their creation dates from changelog.
 * Uses the earliest date if a block appears multiple times.
 */
function buildBlockDateMap(changelogPath: string): Map<string, string> {
  const changelogContent = readFileSync(changelogPath, "utf-8");

  const dateBlockPattern =
    /date:\s*["'](\d{4}-\d{2}-\d{2})["'][\s\S]*?blocks:\s*\[([\s\S]*?)\]/g;
  const blockNamePattern = /name:\s*["']([^"']+)["']/g;

  const blockDateMap = new Map<string, string>();

  let match = dateBlockPattern.exec(changelogContent);
  while (match !== null) {
    const date = match[1] ?? "";
    const blocksSection = match[2] ?? "";

    blockNamePattern.lastIndex = 0;
    let blockMatch = blockNamePattern.exec(blocksSection);
    while (blockMatch !== null) {
      const blockName = blockMatch[1] ?? "";
      // Keep earliest occurrence date (first time block was added)
      if (blockName && !blockDateMap.has(blockName)) {
        blockDateMap.set(blockName, date);
      }
      blockMatch = blockNamePattern.exec(blocksSection);
    }
    match = dateBlockPattern.exec(changelogContent);
  }

  return blockDateMap;
}

/**
 * Convert date string (YYYY-MM-DD) to RFC 822 format for RSS pubDate
 * Subtracts 1 day since changelog dates represent the next day
 */
function toRFC822Date(dateStr: string): string {
  const date = new Date(`${dateStr}T22:00:00Z`);
  date.setDate(date.getDate() - 1);
  return date.toUTCString();
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRss() {
  const registryPath = join(import.meta.dirname, "..", "registry.json");
  const changelogPath = join(import.meta.dirname, "..", "data", "changelog.ts");

  const registry: Registry = JSON.parse(readFileSync(registryPath, "utf-8"));
  const blockDateMap = buildBlockDateMap(changelogPath);

  // Build items from registry with dates from changelog
  const items: { name: string; title: string; description: string; date: string }[] = [];

  for (const item of registry.items) {
    const date = blockDateMap.get(item.name);
    if (date) {
      items.push({
        name: item.name,
        title: item.title,
        description: item.description,
        date,
      });
    }
  }

  // Sort by date (newest first)
  items.sort((a, b) => b.date.localeCompare(a.date));

  const rssItems = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${SITE_URL}/block/${item.name}</link>
      <guid>${SITE_URL}/block/${item.name}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRFC822Date(item.date)}</pubDate>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>@beste-ui</title>
    <link>${SITE_URL}</link>
    <description>Subscribe to @beste-ui updates</description>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  const outputPath = join(import.meta.dirname, "..", "public", "rss.xml");
  writeFileSync(outputPath, rss, "utf-8");

  console.log(`RSS feed generated with ${items.length} items: ${outputPath}`);
}

generateRss();
