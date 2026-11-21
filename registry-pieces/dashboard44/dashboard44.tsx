"use client";

import { Check, KeyRound } from "lucide-react";

import { cn } from "@/lib/utils";

interface Dashboard44Project {
  name: string;
  /** The site's thumbnail */
  image?: string;
}

interface Dashboard44Props {
  /** The studio that holds the keys */
  label?: string;
  /** The studio's square image beside its name */
  image?: string;
  meta?: string;
  /** Up to six client projects; each one is handed over in turn */
  projects?: Dashboard44Project[];
  /** What a project shows while the studio holds it */
  heldLabel?: string;
  /** What it shows once the client owns it */
  handedLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard44Demo: Dashboard44Props = {
  label: "Halden Studio",
  image: "https://oud.pics/b/gradients/gradient-silk-orange.webp",
  meta: "6 client projects",
  projects: [
    { name: "Oriel", image: "https://oud.pics/b/beste/oriel-studio.webp" },
    { name: "Mira", image: "https://oud.pics/b/beste/project-mira.webp" },
    { name: "Ardena", image: "https://oud.pics/b/beste/project-ardena.webp" },
    { name: "Tova", image: "https://oud.pics/b/beste/oriel-ritual.webp" },
    { name: "Lume", image: "https://oud.pics/b/beste/oriel-serum.webp" },
    { name: "Brisa", image: "https://oud.pics/b/beste/oriel-consultation.webp" },
  ],
  heldLabel: "Studio",
  handedLabel: "Client",
  framed: true,
};

const LOOP = 14;

// One handover per project, then every key comes back to the studio together
function styles(count: number) {
  const rules = Array.from({ length: count }, (_, i) => {
    const at = 8 + i * Math.min(12, 66 / Math.max(count, 1));
    return `@keyframes dashboard44-on${i} { 0%, ${at}% { opacity: 0; transform: translateY(4px) } ${at + 3}%, 86% { opacity: 1; transform: none } 92%, 100% { opacity: 0; transform: translateY(4px) } }
@keyframes dashboard44-off${i} { 0%, ${at}% { opacity: 1 } ${at + 2}%, 88% { opacity: 0 } 94%, 100% { opacity: 1 } }
@keyframes dashboard44-ring${i} { 0%, ${at}% { box-shadow: 0 0 0 0 transparent } ${at + 2}% { box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-emerald-500) 35%, transparent) } ${at + 9}%, 100% { box-shadow: 0 0 0 0 transparent } }
.dashboard44-on${i} { animation: dashboard44-on${i} ${LOOP}s cubic-bezier(.3,0,.2,1) infinite }
.dashboard44-off${i} { animation: dashboard44-off${i} ${LOOP}s ease infinite }
.dashboard44-ring${i} { animation: dashboard44-ring${i} ${LOOP}s ease-out infinite }`;
  });
  return `${rules.join("\n")}
.dashboard44-on { opacity: 0 }
@media (prefers-reduced-motion: reduce) { [class*="dashboard44-"] { animation: none !important } .dashboard44-on { opacity: 1 } .dashboard44-held { opacity: 0 } }`;
}

export function Dashboard44({ label, image, meta, projects = [], heldLabel = "Studio", handedLabel = "Client", framed = true, fill = false, className }: Dashboard44Props) {
  const shown = projects.slice(0, 6);
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{styles(shown.length)}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-110",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3.5 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(label || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2.5">
                {image && <img src={image} alt="" className="size-7 shrink-0 rounded-lg object-cover" />}
                <span className="truncate text-sm font-semibold">{label}</span>
              </span>
              {meta && <span className="shrink-0 text-muted-foreground">{meta}</span>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {shown.map((project, index) => (
              <div key={index} className={cn("flex min-w-0 flex-col gap-2 rounded-xl p-1.5 ring-1 ring-border", `dashboard44-ring${index}`)}>
                <div className="aspect-4/3 overflow-hidden rounded-lg bg-muted">
                  {project.image && <img src={project.image} alt="" className="size-full object-cover" />}
                </div>
                <div className="flex min-w-0 flex-col gap-1.5 px-1 pb-0.5">
                  <span className="truncate leading-snug font-medium">{project.name}</span>
                  <span className="relative h-5">
                    <span className={cn("dashboard44-held absolute inset-y-0 left-0 inline-flex items-center gap-1 rounded-full bg-muted px-2 text-foreground/70", `dashboard44-off${index}`)}>
                      <KeyRound aria-hidden="true" className="size-3" />
                      {heldLabel}
                    </span>
                    <span
                      className={cn(
                        "dashboard44-on absolute inset-y-0 left-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                        `dashboard44-on${index}`
                      )}
                    >
                      <Check aria-hidden="true" className="size-3" />
                      {handedLabel}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
