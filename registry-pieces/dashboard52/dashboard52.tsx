"use client";

import { cn } from "@/lib/utils";

interface Dashboard52Project {
  label: string;
  /** The site's image in the small square thumb */
  thumb?: string;
  /** Switched on from the start */
  on?: boolean;
  /** Switches itself on and off again on a loop, and the count follows */
  pending?: boolean;
}

interface Dashboard52Props {
  title?: string;
  /** The count before and after the pending switch flips */
  count?: { before: string; after?: string };
  projects?: Dashboard52Project[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard52Demo: Dashboard52Props = {
  title: "Covered by the plan",
  count: { before: "2 of 50", after: "3 of 50" },
  projects: [
    { label: "aurora-clinic.com", thumb: "https://oud.pics/b/beste/oriel-studio.webp", on: true },
    { label: "harborfront.co", thumb: "https://oud.pics/b/beste/project-ardena.webp", on: true },
    { label: "villalobos-arch.com", thumb: "https://oud.pics/b/beste/project-mira.webp", pending: true },
  ],
  framed: true,
};

const STYLES = `
@keyframes dashboard52-knob { 0%, 30% { transform: none } 40%, 80% { transform: translateX(0.875rem) } 90%, 100% { transform: none } }
@keyframes dashboard52-track { 0%, 30% { opacity: 0 } 40%, 80% { opacity: 1 } 90%, 100% { opacity: 0 } }
@keyframes dashboard52-off { 0%, 30% { opacity: 1 } 34%, 86% { opacity: 0 } 90%, 100% { opacity: 1 } }
@keyframes dashboard52-on { 0%, 35% { opacity: 0 } 39%, 80% { opacity: 1 } 84%, 100% { opacity: 0 } }
.dashboard52-knob { animation: dashboard52-knob 10s cubic-bezier(.45,0,.25,1) -3s infinite }
.dashboard52-track { opacity: 0; animation: dashboard52-track 10s cubic-bezier(.45,0,.25,1) -3s infinite }
.dashboard52-off { animation: dashboard52-off 10s ease -3s infinite }
.dashboard52-on { opacity: 0; animation: dashboard52-on 10s ease -3s infinite }
@media (prefers-reduced-motion: reduce) {
  .dashboard52-knob, .dashboard52-track, .dashboard52-off, .dashboard52-on { animation: none }
  .dashboard52-knob { transform: translateX(0.875rem) }
  .dashboard52-track, .dashboard52-on { opacity: 1 }
  .dashboard52-off { opacity: 0 }
}
`;

function Switch({ on, pending }: { on?: boolean; pending?: boolean }) {
  return (
    <span aria-hidden="true" className="relative h-4.5 w-8 shrink-0 overflow-hidden rounded-full bg-border">
      <span className={cn("absolute inset-0 bg-chart-1", pending ? "dashboard52-track" : !on && "opacity-0")} />
      <span className={cn("absolute top-0.5 left-0.5 size-3.5 rounded-full bg-white shadow-sm", pending ? "dashboard52-knob" : on && "translate-x-3.5")} />
    </span>
  );
}

export function Dashboard52({ title, count, projects = [], framed = true, fill = false, className }: Dashboard52Props) {
  const animated = projects.some((project) => project.pending);
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {animated && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-85",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col rounded-2xl bg-card px-4 pt-4 pb-1.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || count) && (
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold">{title}</span>
              {count && (
                <span className="grid shrink-0 justify-items-end text-muted-foreground">
                  <span className={cn("col-start-1 row-start-1", animated && count.after && "dashboard52-off")}>{count.before}</span>
                  {animated && count.after && <span className="dashboard52-on col-start-1 row-start-1">{count.after}</span>}
                </span>
              )}
            </div>
          )}
          <div className="flex flex-col border-b border-border">
            {projects.map((project, index) => (
              <div key={index} className="flex items-center justify-between gap-3 border-t border-border py-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  {project.thumb ? (
                    <img src={project.thumb} alt="" className="size-5 shrink-0 rounded-md object-cover" />
                  ) : (
                    <span aria-hidden="true" className="size-5 shrink-0 rounded-md bg-muted ring-1 ring-border" />
                  )}
                  <span className="truncate">{project.label}</span>
                </span>
                <Switch on={project.on} pending={project.pending} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
