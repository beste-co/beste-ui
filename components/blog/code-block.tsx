import type { ReactElement } from "react";
import { codeToHtml, type ShikiTransformer } from "shiki";
import { CodeShell } from "./code-shell";

/**
 * Server component used as the MDX `pre` override. It receives the inner
 * `<code>` element, extracts the raw source + language from it, highlights the
 * source with Shiki (same themes as the rest of the site), and hands the HTML
 * to a small client shell for the copy button.
 */

interface CodeChildProps {
  className?: string;
  children?: string;
}

interface BlogPreProps {
  children?: ReactElement<CodeChildProps>;
}

interface TextNode {
  type: string;
  value?: string;
  children?: TextNode[];
}

function nodeText(node: TextNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(nodeText).join("");
}

/**
 * For ```diff fences: tag added/removed lines so CSS can tint the full line
 * (Shiki only colors the +/- token itself). File headers (+++/---) stay plain.
 */
const diffLineClasses: ShikiTransformer = {
  name: "blog:diff-lines",
  line(node) {
    const text = nodeText(node as unknown as TextNode);
    if (text.startsWith("+++") || text.startsWith("---")) return;
    if (text.startsWith("+")) this.addClassToHast(node, "diff-add");
    else if (text.startsWith("-")) this.addClassToHast(node, "diff-remove");
  },
};

function extract(child: BlogPreProps["children"]): { code: string; lang: string } {
  const props = child?.props ?? {};
  const className = typeof props.className === "string" ? props.className : "";
  const match = /language-([\w-]+)/.exec(className);
  const lang = match?.[1] ?? "text";
  const code = typeof props.children === "string" ? props.children : "";
  return { code: code.replace(/\n$/, ""), lang };
}

export async function BlogPre({ children }: BlogPreProps) {
  const { code, lang } = extract(children);

  const themes = { light: "slack-ochin", dark: "dracula-soft" } as const;
  const transformers = lang === "diff" ? [diffLineClasses] : undefined;

  let html: string;
  try {
    html = await codeToHtml(code, { lang, themes, defaultColor: false, transformers });
  } catch {
    // Unknown language → fall back to plain text so the build never breaks.
    html = await codeToHtml(code, { lang: "text", themes, defaultColor: false });
  }

  return <CodeShell html={html} raw={code} lang={lang} />;
}
