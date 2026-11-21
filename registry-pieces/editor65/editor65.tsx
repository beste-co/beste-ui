"use client";

import type { LucideIcon } from "lucide-react";
import { Check, LayoutGrid, List, ListOrdered, Rows3 } from "lucide-react";

import { cn } from "@/lib/utils";

interface Editor65Option {
  label: string;
  icon?: LucideIcon;
}

interface Editor65Props {
  title?: string;
  tag?: string;
  options?: Editor65Option[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  className?: string;
}

export const editor65Demo: Editor65Props = {
  title: "Features section",
  options: [
    { label: "Grid", icon: LayoutGrid },
    { label: "Alternating rows", icon: Rows3 },
    { label: "List", icon: List },
    { label: "Numbered steps", icon: ListOrdered },
  ],
  framed: true,
};

/* Each option holds the highlight for 72% of its slice, then it slides to the next row (h-6 = 1.5rem). */
function buildStyles(count: number) {
  const slice = 100 / count;
  const frames = Array.from({ length: count }, (_, index) => {
    const start = index * slice;
    const end = start + slice * 0.72;
    return `${start.toFixed(2)}%, ${end.toFixed(2)}% { transform: translateY(${index * 1.5}rem); }`;
  }).join(" ");
  return `
@keyframes editor65-pick-${count} { ${frames} 100% { transform: none; } }
.editor65-pick-${count} { animation: editor65-pick-${count} ${count * 3}s cubic-bezier(.45,0,.25,1) infinite; }
@media (prefers-reduced-motion: reduce) { .editor65-pick-${count} { animation: none; } }
`;
}

export function Editor65({ title, tag, options = [], framed = true, className }: Editor65Props) {
  const count = Math.max(1, options.length);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{buildStyles(count)}</style>

      <div
        className={cn(
          "w-60",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("rounded-2xl bg-card p-2.5 text-xs text-card-foreground", !framed && "shadow-lg")} aria-hidden="true">
          <div className="flex items-baseline justify-between gap-3 px-1 pb-2">
            <span className="truncate font-semibold">{title}</span>
            {tag && <span className="shrink-0 text-muted-foreground">{tag}</span>}
          </div>

          <div className="relative">
            <span className={cn("editor65-pick-" + count, "absolute inset-x-0 top-0 h-6 rounded-lg bg-muted ring-1 ring-inset ring-border")}>
              <Check className="absolute right-2 top-1.5 size-3 text-chart-1" strokeWidth={2.4} />
            </span>
            {options.map(({ label, icon: Icon }) => (
              <div key={label} className="relative flex h-6 items-center gap-2.5 px-2">
                {Icon && <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.6} />}
                <span className="truncate">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
