"use client";

import { Check, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface Editor112Project {
  image?: string;
  name: string;
  domain: string;
  plan?: string;
  /** This project turns into a handed over one in the loop */
  handover?: boolean;
}

interface Editor112Props {
  workspace?: string;
  /** The studio's logo beside its name; a north star mark when empty */
  logo?: string;
  /** A quiet count beside the name, e.g. "4 of 10 projects" */
  usage?: string;
  projects?: Editor112Project[];
  handedOverLabel?: string;
  newLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor112Demo: Editor112Props = {
  workspace: "Northlight Studio",
  usage: "4 of 10 projects",
  projects: [
    { image: "https://oud.pics/b/beste/oriel-studio.webp", name: "Oriel Skin Studio", domain: "oriel.studio", plan: "Pro", handover: true },
    { image: "https://oud.pics/b/beste/object-house.webp", name: "Casa Alfama", domain: "casaalfama.com", plan: "Pro" },
    { image: "https://oud.pics/b/beste/object-bicycle.webp", name: "Velo Repairs", domain: "velorepairs.co", plan: "Free" },
    { image: "https://oud.pics/b/beste/object-tent.webp", name: "Field Weekends", domain: "fieldweekends.com", plan: "Pro" },
  ],
  handedOverLabel: "Handed over",
  newLabel: "New project",
  framed: true,
};

// The plan pill on the handover card gives way to a ticked label, then returns
const STYLES = `
@keyframes editor112-plan { 0%, 40% { opacity: 1 } 46%, 88% { opacity: 0 } 94%, 100% { opacity: 1 } }
@keyframes editor112-done { 0%, 40% { opacity: 0; transform: translateY(3px) } 46%, 88% { opacity: 1; transform: translateY(0) } 94%, 100% { opacity: 0; transform: translateY(3px) } }
@keyframes editor112-ring { 0%, 40% { box-shadow: 0 0 0 0 transparent } 46%, 88% { box-shadow: 0 0 0 2px var(--primary) } 94%, 100% { box-shadow: 0 0 0 0 transparent } }
.editor112-plan { animation: editor112-plan 10s ease infinite }
.editor112-done { opacity: 0; animation: editor112-done 10s ease infinite }
.editor112-ring { animation: editor112-ring 10s ease infinite }
@media (prefers-reduced-motion: reduce) { .editor112-plan, .editor112-done, .editor112-ring { animation: none } }
`;

export function Editor112({ workspace, logo, usage, projects = [], handedOverLabel = "Handed over", newLabel, framed = true, fill = false, className }: Editor112Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div className={cn("w-full", !fill && "max-w-96", framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md")}>
        <div className={cn("overflow-hidden rounded-2xl bg-card text-card-foreground", !framed && "shadow-lg")} aria-hidden="true">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <span className="flex min-w-0 items-center gap-2">
              {logo ? (
                <img src={logo} alt="" loading="lazy" decoding="async" className="size-6 shrink-0 rounded-md bg-muted object-cover" />
              ) : (
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-foreground text-background">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
                    <path d="M8 0.5 L9.4 6.6 L15.5 8 L9.4 9.4 L8 15.5 L6.6 9.4 L0.5 8 L6.6 6.6 Z" />
                  </svg>
                </span>
              )}
              <span className="truncate text-sm font-medium tracking-tight">{workspace}</span>
            </span>
            {newLabel && (
              <span className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 text-xs text-primary-foreground">
                <Plus className="size-3" />
                {newLabel}
              </span>
            )}
          </div>
          {usage && <p className="px-4 pt-3 text-xs text-muted-foreground">{usage}</p>}
          <ul className="grid grid-cols-2 gap-2.5 p-4 pt-2.5">
            {projects.map((project, index) => (
              <li key={index} className={cn("overflow-hidden rounded-xl border border-border", project.handover && "editor112-ring")}>
                {project.image ? (
                  <img src={project.image} alt="" loading="lazy" decoding="async" className="aspect-video w-full bg-muted object-cover" />
                ) : (
                  <span className="block aspect-video w-full bg-muted" />
                )}
                <div className="px-2.5 pt-2 pb-2.5">
                  <p className="truncate text-xs font-medium">{project.name}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">{project.domain}</span>
                    {project.handover ? (
                      <span className="grid shrink-0 justify-items-end">
                        <span className="editor112-plan col-start-1 row-start-1 rounded-full border border-border px-1.5 text-xs">{project.plan}</span>
                        <span className="editor112-done col-start-1 row-start-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                          <Check className="size-3" />
                          {handedOverLabel}
                        </span>
                      </span>
                    ) : (
                      project.plan && <span className="shrink-0 rounded-full border border-border px-1.5 text-xs">{project.plan}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
