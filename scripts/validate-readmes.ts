/**
 * Compiles every block README.md through the exact same MDX pipeline the block
 * detail page uses (next-mdx-remote + remark-gfm), and reports any that fail to
 * compile. This catches MDX syntax errors — a stray `<10ms` in prose that the
 * parser reads as a JSX tag, an unescaped `{`, an unclosed custom tag — before
 * they ship, instead of surfacing as a runtime "[next-mdx-remote] error
 * compiling MDX" on the live page.
 *
 * Run:  bun run scripts/validate-readmes.ts
 * CI:   exits 1 when any README fails, 0 when all compile.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const ROOTS = ["registry", "registry-pieces"];

/** Every README.md one level under the given registry roots. */
function findReadmes(): string[] {
  const out: string[] = [];
  for (const root of ROOTS) {
    const rootPath = join(import.meta.dirname, "..", root);
    let entries: string[];
    try {
      entries = readdirSync(rootPath);
    } catch {
      continue; // root may not exist (e.g. no pieces READMEs)
    }
    for (const entry of entries) {
      const readme = join(rootPath, entry, "README.md");
      try {
        if (statSync(readme).isFile()) out.push(readme);
      } catch {
        // no README for this component — fine
      }
    }
  }
  return out.sort();
}

async function main() {
  const readmes = findReadmes();
  const failures: { path: string; message: string }[] = [];

  for (const path of readmes) {
    const source = readFileSync(path, "utf-8");
    try {
      // Same plugins as components/blog/mdx.tsx. serialize() runs the full
      // MDX compile and throws on any syntax error, exactly like the page.
      await serialize(source, {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      });
    } catch (err) {
      failures.push({
        path,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const rel = (p: string) => p.slice(p.indexOf("/registry"));

  if (failures.length === 0) {
    console.log(`✓ All ${readmes.length} README files compile as MDX.`);
    return;
  }

  console.error(`✗ ${failures.length} of ${readmes.length} README files fail MDX compile:\n`);
  for (const { path, message } of failures) {
    // Keep only the first, most useful line of the MDX error.
    const firstLine = message.split("\n").find((l) => l.trim().length) ?? message;
    console.error(`  ${rel(path)}`);
    console.error(`    ${firstLine.trim()}\n`);
  }
  process.exitCode = 1;
}

main();
