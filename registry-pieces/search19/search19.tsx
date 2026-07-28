"use client";

import { ChevronRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search19Props {
  crumbs?: string[];
  title?: string;
  snippet?: string;
  highlight?: string;
  className?: string;
}

export const search19Demo: Search19Props = {
  crumbs: ["beste.co", "docs", "authentication"],
  title: "Setting up SSO with SAML and Okta",
  snippet:
    "Configure an IdP to issue SAML assertions to Beste, then map groups to workspace roles.",
  highlight: "SAML",
};

function withHighlight(text: string, q?: string) {
  if (!q) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-amber-500/25 px-0.5 text-card-foreground">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function Search19({
  crumbs = [],
  title,
  snippet,
  highlight,
  className,
}: Search19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-lg border border-border bg-card p-3 shadow-sm">
        {crumbs.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="size-3" aria-hidden="true" />
            {crumbs.map((c, idx) => (
              <span key={idx} className="inline-flex items-center gap-1">
                <span className="truncate">{c}</span>
                {idx < crumbs.length - 1 && (
                  <ChevronRight
                    className="size-3 text-muted-foreground/60"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </div>
        )}
        {title && (
          <span className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-400">
            {withHighlight(title, highlight)}
          </span>
        )}
        {snippet && (
          <span className="text-xs leading-snug text-muted-foreground">
            {withHighlight(snippet, highlight)}
          </span>
        )}
      </div>
    </div>
  );
}
