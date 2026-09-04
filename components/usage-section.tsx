"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { CodeBlock } from "@/components/code-block";
import { useRegistryFlavor } from "@/components/registry-flavor";
import { cn } from "@/lib/utils";

interface UsageSectionProps {
  /** The hand-written snippet from the meta, when there is one. */
  usage?: string;
  /** Its Base UI twin; falls back to `usage`. */
  usageBase?: string;
  /** What to show when the meta carries no snippet: a demo-props dump. */
  fallback: string;
  id?: string;
  className?: string;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write can fail in insecure contexts — fail silently.
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-muted/60 px-4 py-2 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={copied ? "Copied" : "Copy usage snippet"}
    >
      {copied ? (
        <>
          <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} className="text-emerald-600" aria-hidden="true" />
          Copied!
        </>
      ) : (
        <>
          <HugeiconsIcon icon={Copy01Icon} size={14} strokeWidth={2} aria-hidden="true" />
          Copy
        </>
      )}
    </button>
  );
}

/**
 * The import and the props worth knowing about. Which snippet shows follows
 * the primitive-library choice in the floating bar, the same way the install
 * command there does.
 */
export function UsageSection({ usage, usageBase, fallback, id = "usage", className }: UsageSectionProps) {
  const [flavor] = useRegistryFlavor();
  const code = (flavor === "base" ? (usageBase ?? usage) : usage) ?? fallback;

  return (
    <section id={id} className={cn("flex scroll-mt-8 flex-col gap-4", className)}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">Usage</h2>
          <p className="mt-2 text-lg text-foreground/70">
            The import and the props worth knowing about, in one place.
          </p>
        </div>
        <CopyButton code={code} />
      </div>
      {/* Cut off at a screenful: the usage for an item with a dozen props runs
          long enough to bury the sections under it. */}
      <div className="overflow-hidden rounded-lg">
        <CodeBlock code={code} language="tsx" fit collapsedHeight={440} />
      </div>
    </section>
  );
}
