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
