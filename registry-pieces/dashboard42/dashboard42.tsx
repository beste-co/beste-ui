"use client";

import { cn } from "@/lib/utils";

type Tone = "success" | "muted" | "neutral";

interface Dashboard42Page {
  label: string;
  value?: string;
  tone?: Tone;
  /** Starts on the draft label, then turns into the value on a loop */
  pending?: boolean;
}

interface Dashboard42Props {
  domain?: string;
  status?: string;
  heading?: string;
  subheading?: string;
  pages?: Dashboard42Page[];
  /** What a pending page shows before it goes live */
  draftLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  success: "text-emerald-700 dark:text-emerald-400",
  muted: "text-muted-foreground",
  neutral: "text-foreground",
};

const STYLES = `
@keyframes dashboard42-draft { 0%, 40% { opacity: 1 } 45%, 90% { opacity: 0 } 95%, 100% { opacity: 1 } }
@keyframes dashboard42-live { 0%, 46% { opacity: 0 } 51%, 85% { opacity: 1 } 90%, 100% { opacity: 0 } }
.dashboard42-draft { animation: dashboard42-draft 10s ease infinite }
.dashboard42-live { opacity: 0; animation: dashboard42-live 10s ease infinite }
@media (prefers-reduced-motion: reduce) {
  .dashboard42-draft { animation: none; opacity: 0 }
  .dashboard42-live { animation: none; opacity: 1 }
}
`;

export const dashboard42Demo: Dashboard42Props = {
  domain: "tallyroom.app",
  status: "Published",
  heading: "Shared budgets for small teams",
  pages: [
    { label: "Home", value: "Published", tone: "success" },
    { label: "Waitlist", value: "312 sign-ups" },
    { label: "Pricing", value: "Published", tone: "success", pending: true },
    { label: "Docs", value: "Draft", tone: "muted" },
  ],
  draftLabel: "Draft",
  framed: true,
};

export function Dashboard42({ domain, status, heading, subheading, pages = [], draftLabel, framed = true, fill = false, className }: Dashboard42Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col overflow-hidden rounded-2xl bg-card text-sm text-card-foreground", !framed && "shadow-lg")}>
          {(domain || status) && (
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="truncate font-semibold">{domain}</span>
              {status && <span className="ml-auto shrink-0 text-xs text-emerald-700 dark:text-emerald-400">{status}</span>}
            </div>
          )}
          {(heading || subheading) && (
            <div className="px-4 pt-4 pb-1.5">
              {heading && <div className="text-base leading-snug font-medium tracking-tight">{heading}</div>}
              {subheading && <div className="mt-1 text-xs text-muted-foreground">{subheading}</div>}
            </div>
          )}
          <div className="px-4 pt-1.5 pb-2">
            {pages.map((page, index) => (
              <div key={index} className="flex items-center justify-between gap-3 border-t border-border py-2.5">
                <span className="truncate">{page.label}</span>
                {page.pending ? (
                  <span className="relative grid shrink-0 justify-items-end">
                    <span className="dashboard42-draft col-start-1 row-start-1 text-muted-foreground">{draftLabel}</span>
                    <span className={cn("dashboard42-live col-start-1 row-start-1", toneClasses[page.tone ?? "neutral"])}>{page.value}</span>
                  </span>
                ) : (
                  page.value && <span className={cn("shrink-0", toneClasses[page.tone ?? "neutral"])}>{page.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
