"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface ProjectRow {
  domain: string;
  planLabel?: string;
}

interface Dashboard35Props {
  projects?: ProjectRow[];
  limit?: number;
  ofWord?: string;
  billingValue?: string;
  stepMs?: number;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const dashboard35Demo: Dashboard35Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  projects: [
    { domain: "aurora-clinic.com", planLabel: "Pro" },
    { domain: "monteverdi-studio.com", planLabel: "Pro" },
    { domain: "harbourfront.co", planLabel: "Pro" },
  ],
  limit: 25,
  ofWord: "of",
  billingValue: "One invoice",
  stepMs: 420,
};

const STYLES = `
@keyframes dashboard35-in { from { opacity: 0; transform: translateY(0.375rem); } to { opacity: 1; transform: none; } }
.dashboard35-in { animation: dashboard35-in 320ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .dashboard35-in { animation: none; } }
`;

export function Dashboard35({
  projects = [],
  limit = 25,
  ofWord = "of",
  billingValue,
  stepMs = 420,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard35Props) {
  const [landed, setLanded] = useState(0);

  useEffect(() => {
    if (landed >= projects.length) return;
    const id = setTimeout(() => setLanded((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [landed, projects.length, stepMs]);

  const tone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{STYLES}</style>

      <div
        className={cn(
          "flex w-full max-w-72 flex-col gap-3 rounded-xl p-4 shadow-sm",
          tone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-light leading-none tabular-nums">
            {landed}
          </span>
          <span className="text-xs opacity-60">
            {ofWord} {limit}
          </span>
          {billingValue && (
            <span className="ml-auto shrink-0 text-xs opacity-60">
              {billingValue}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          {projects.map((project, index) => (
            <div
              key={project.domain}
              className={cn(
                "flex items-center justify-between gap-3",
                index < landed ? "dashboard35-in" : "invisible"
              )}
            >
              <span className="truncate font-mono text-xs">
                {project.domain}
              </span>
              {project.planLabel && (
                <span className="shrink-0 rounded-full bg-current/10 px-2 py-0.5 text-xs font-medium opacity-60">
                  {project.planLabel}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
