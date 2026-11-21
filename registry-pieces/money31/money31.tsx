"use client";

import { cn } from "@/lib/utils";

type Money31Tone = "stone" | "sky" | "lime" | "rose";

interface Money31Project {
  /** The project's square image; without it a tinted letter chip */
  image?: string;
  initial?: string;
  name?: string;
  domain?: string;
  plan?: string;
  tone?: Money31Tone;
}

interface Money31Total {
  label?: string;
  value?: string;
  strong?: boolean;
}

interface Money31Props {
  title?: string;
  countLabel?: string;
  projects?: Money31Project[];
  totals?: Money31Total[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  fill?: boolean;
  className?: string;
}

const toneClasses: Record<Money31Tone, string> = {
  stone: "bg-stone-100 text-stone-700",
  sky: "bg-sky-100 text-sky-700",
  lime: "bg-lime-100 text-lime-700",
  rose: "bg-rose-100 text-rose-700",
};

export const money31Demo: Money31Props = {
  title: "Your projects",
  projects: [
    { image: "https://oud.pics/b/beste/oriel-studio.webp", name: "Oriel Skin Studio", plan: "Pro", tone: "stone" },
    { image: "https://oud.pics/b/beste/project-mira.webp", name: "Mira Dental", plan: "Pro", tone: "sky" },
    { image: "https://oud.pics/b/beste/project-ardena.webp", name: "Ardena", plan: "Pro", tone: "lime" },
    { image: "https://oud.pics/b/beste/oriel-ritual.webp", name: "Tova Ceramics", plan: "Pro", tone: "rose" },
  ],
  totals: [
    { label: "4 Pro plans", value: "$60 a month" },
    { label: "Team, up to 10 projects", value: "$59 a month", strong: true },
  ],
  framed: true,
};

export function Money31({ title, countLabel, projects = [], totals = [], framed = true, fill = false, className }: Money31Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col rounded-2xl bg-card px-4.5 py-4 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-baseline justify-between pb-2.5">
            <span className="text-sm font-semibold">{title}</span>
            {countLabel && <span className="text-xs text-muted-foreground">{countLabel}</span>}
          </div>
          {projects.map((project, i) => (
            <div key={i} className="flex items-center gap-3 border-t border-border py-2.5">
              {project.image ? (
                <img src={project.image} alt="" className="size-7.5 shrink-0 rounded-lg object-cover" />
              ) : (
                <span
                  aria-hidden
                  className={cn("flex size-7.5 shrink-0 items-center justify-center rounded-lg text-sm font-semibold", toneClasses[project.tone ?? "stone"])}
                >
                  {project.initial}
                </span>
              )}
              <span className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="truncate text-sm font-medium">{project.name}</span>
                {project.domain && <span className="truncate text-xs text-muted-foreground">{project.domain}</span>}
              </span>
              {project.plan && <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{project.plan}</span>}
            </div>
          ))}
          {totals.length > 0 && <div aria-hidden className="mt-1 mb-1.5 h-px bg-border" />}
          {totals.map((total, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between gap-3 py-1.5",
                total.strong ? "font-medium" : "text-muted-foreground",
              )}
            >
              <span>{total.label}</span>
              <span className="shrink-0 tabular-nums">{total.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
