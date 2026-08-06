import fs from "node:fs";
import path from "node:path";
import { getBlock } from "./blocks";

/**
 * Get source code for a block.
 * For pro blocks, returns obfuscated source unless the user has pro access.
 */
export function getSourceCode(blockName: string, isUserPro = false): string {
  const block = getBlock(blockName);

  // For pro blocks when user is not pro, return obfuscated source
  if (block?.isPro && !isUserPro) {
    const obfuscatedPath = path.join(
      process.cwd(),
      ".generated",
      "obfuscated-source",
      `${blockName}.tsx`
    );

    try {
      return fs.readFileSync(obfuscatedPath, "utf-8");
    } catch {
      // Fallback to regular source if obfuscated version doesn't exist
      // This can happen during development before running the obfuscation script
    }
  }

  // Regular path for non-pro blocks or authenticated pro users
  const filePath = path.join(
    process.cwd(),
    "registry",
    blockName,
    `${blockName}.tsx`
  );

  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return `// Source code not found for ${blockName}`;
  }
}

/**
 * Get source code for a page.
 *
 * There is no obfuscated twin here: the file is the composition itself, so a
 * reader without a license is shown the upgrade panel instead of a mangled
 * copy. The blocks it composes keep their own gating on their own pages.
 */
export function getPageSource(pageName: string): string {
  const filePath = path.join(
    process.cwd(),
    "registry-pages",
    pageName,
    `${pageName}.tsx`
  );

  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return `// Source code not found for ${pageName}`;
  }
}

/**
 * Get the docs (README.md markdown) for a block, if it ships one.
 * Returns the raw markdown, or null when the block has no README.
 */
export function getBlockDocs(blockName: string): string | null {
  const filePath = path.join(
    process.cwd(),
    "registry",
    blockName,
    "README.md"
  );
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}
