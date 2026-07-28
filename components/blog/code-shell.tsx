"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

interface CodeShellProps {
  /** Pre-highlighted HTML produced by Shiki on the server */
  html: string;
  /** Raw source, used for the copy button */
  raw: string;
  /** Language label shown in the header */
  lang: string;
}

/**
 * Client shell around a server-highlighted code block. Renders the Shiki HTML
 * as-is and adds a header with the language label and a copy button.
 */
export function CodeShell({ html, raw, lang }: CodeShellProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="blog-code group relative my-8 overflow-hidden rounded-xl bg-muted/60 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="font-mono text-sm text-foreground/50">{lang}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-sm text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          {copied ? (
            <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} className="text-teal-600 dark:text-teal-400" />
          ) : (
            <HugeiconsIcon icon={Copy01Icon} size={16} strokeWidth={2} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div
        className="overflow-x-auto px-4 pb-4 text-base/7 [&_code]:!bg-transparent [&_pre]:!bg-transparent [&_pre]:font-mono"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is generated server-side from trusted post source.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
