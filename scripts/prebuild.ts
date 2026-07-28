/**
 * Codegen for the public build.
 *
 * The private build runs a fingerprint-cached orchestrator, because it also has
 * to obfuscate and quarantine 1,485 paid blocks and skipping unchanged work
 * matters at that size. None of that exists here, so this is what is left: run
 * the generators in dependency order and stop on the first failure.
 *
 *   blocks:generate      registry/          -> lib/blocks.ts, registry.json
 *   components:generate  registry-pieces/   -> lib/components.ts
 *                        registry-components/
 *   sets:generate        registry/          -> lib/block-sets.ts
 *   registry:build       registry.json      -> public/r/*.json
 *   sitemap / rss / llms  registry.json + data/changelog.ts -> public/
 *
 * Usage: bun run scripts/prebuild.ts
 */

import { spawnSync } from "node:child_process";

/** Ordered because each step reads what the previous one wrote. */
const STEPS = [
  "blocks:generate",
  "components:generate",
  "sets:generate",
  "registry:build",
  "sitemap:generate",
  "rss:generate",
  "llms:generate",
] as const;

function run(script: string): void {
  const start = Date.now();
  const result = spawnSync("bun", ["run", script], { stdio: "inherit" });

  if (result.status !== 0) {
    console.error(`\n✗ ${script} failed`);
    process.exit(result.status ?? 1);
  }

  console.log(`✓ ${script} — ${((Date.now() - start) / 1000).toFixed(1)}s`);
}

for (const step of STEPS) {
  run(step);
}
