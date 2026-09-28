"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the card. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export interface ChecklistAction {
  label: string;
  /** Renders the action as a link. */
  href?: string;
  onClick?: () => void;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  /** A button or link offered while the item is still open. */
  action?: ChecklistAction;
}

export interface StepsChecklistProps {
  items: ChecklistItem[];
  /** Ids of the finished items, controlled. */
  completed?: string[];
  /** Ids of the finished items, uncontrolled. */
  defaultCompleted?: string[];
  /** Fires with the full list of finished ids after any toggle. */
  onCompletedChange?: (completed: string[]) => void;
  /** Fires for the item that was toggled. */
  onToggle?: (id: string, done: boolean) => void;
  /** @defaultValue "Get started" */
  title?: string;
  description?: string;
  /** Title once every item is done. @defaultValue "You're all set" */
  finishedTitle?: string;
  finishedDescription?: string;
  /** Shows a Dismiss button in the finished state. */
  onDismiss?: () => void;
  /** Whether the list is open, controlled. */
  open?: boolean;
  /** Whether the list starts open, uncontrolled. @defaultValue true */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @defaultValue "outline" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  className?: string;
}

export const stepsChecklistDemo: StepsChecklistProps = {
  title: "Launch the band site",
  description: "Five steps before the autumn tour goes on sale.",
  items: [
    { id: "profile", title: "Add the band profile", description: "Photos, a short bio and the lineup." },
    { id: "music", title: "Upload the new single", description: "A preview player goes on the home page." },
    {
      id: "dates",
      title: "Add tour dates",
      description: "Twelve shows so far, from Lisbon to Oslo.",
      action: { label: "Add dates", onClick: () => console.log("Open the tour dates") },
    },
    {
      id: "shop",
      title: "Open the merch shop",
      description: "Connect payments and list the first shirts.",
      action: { label: "Set up the shop", onClick: () => console.log("Open the shop setup") },
    },
    {
      id: "mailing",
      title: "Start the mailing list",
      description: "Fans get a note at hello@beste.co when tickets drop.",
      action: { label: "Create the list", onClick: () => console.log("Open the mailing list") },
    },
  ],
  defaultCompleted: ["profile", "music"],
  finishedDescription: "Everything is ready for the tickets to go on sale.",
  onDismiss: () => console.log("Dismissed"),
  className: "w-full max-w-md",
};

/** Soft ease-out: the ring and the rows settle without overshooting. */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

const toneStyles: Record<Tone, { card: string; next: string }> = {
  muted: { card: "bg-muted", next: "bg-background" },
  outline: { card: "border border-border bg-background", next: "bg-muted/70" },
  ghost: { card: "", next: "bg-muted/70" },
};

// The space under the header lives inside the collapsing body (bodyTop), not in a card gap, so a closed card has equal padding top and bottom
const sizeStyles: Record<Size, { card: string; bodyTop: string; ring: number; title: string; item: string; box: string; button: string }> = {
  sm: { card: "p-3", bodyTop: "pt-3", ring: 36, title: "text-sm", item: "gap-2.5 p-2", box: "size-5", button: "h-8 px-3 text-sm" },
  default: { card: "p-4", bodyTop: "pt-4", ring: 44, title: "text-base", item: "gap-3 p-2.5", box: "size-6", button: "h-8 px-3 text-sm" },
  lg: { card: "p-5", bodyTop: "pt-5", ring: 52, title: "text-lg", item: "gap-3.5 p-3", box: "size-7", button: "h-9 px-3.5 text-base" },
};

/**
 * An onboarding checklist: a ring that fills as items are done, open items with their next action,
 * finished ones folded to a single line, and a finished state once everything is checked.
 */
export function StepsChecklist({
  items,
  completed: completedProp,
  defaultCompleted = [],
  onCompletedChange,
  onToggle,
  title = "Get started",
  description,
  finishedTitle = "You're all set",
  finishedDescription,
  onDismiss,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  tone = "outline",
  size = "default",
  className,
}: StepsChecklistProps) {
  const [innerDone, setInnerDone] = React.useState(defaultCompleted);
  const done = completedProp ?? innerDone;
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const open = openProp ?? innerOpen;
  const headingId = React.useId();
  const bodyId = React.useId();

  const total = items.length;
  const count = items.filter((item) => done.includes(item.id)).length;
  const finished = total > 0 && count === total;
  const nextId = items.find((item) => !done.includes(item.id))?.id;
  const s = sizeStyles[size];
  const t = toneStyles[tone];

  const toggle = (id: string) => {
    const isDone = done.includes(id);
    // Kept in the items' order, so the list can be stored and compared
    const next = items.map((item) => item.id).filter((itemId) => (itemId === id ? !isDone : done.includes(itemId)));
    if (completedProp === undefined) setInnerDone(next);
    onCompletedChange?.(next);
    onToggle?.(id, !isDone);
  };

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  const radius = 50 - 5;
  const progress = total > 0 ? count / total : 0;

  return (
    <section
      aria-labelledby={headingId}
      data-slot="steps-checklist"
      data-finished={finished || undefined}
      className={cn("flex flex-col rounded-2xl text-foreground", t.card, s.card, className)}
    >
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-label="Checklist progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={count}
          aria-valuetext={`${count} of ${total} done`}
          className="relative grid shrink-0 place-items-center"
          style={{ width: s.ring, height: s.ring }}
        >
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 size-full -rotate-90">
            <circle cx={50} cy={50} r={radius} fill="none" strokeWidth={10} pathLength={100} className="stroke-foreground/10" />
            <circle
              cx={50}
              cy={50}
              r={radius}
              fill="none"
              strokeWidth={10}
              strokeLinecap="round"
              pathLength={100}
              className={cn(
                "motion-safe:transition-[stroke-dashoffset,stroke] motion-safe:duration-700",
                finished ? "stroke-emerald-500" : "stroke-foreground",
              )}
              style={{ strokeDasharray: 100, strokeDashoffset: 100 - progress * 100, opacity: count > 0 ? 1 : 0, transitionTimingFunction: EASE_OUT }}
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={cn(
              "size-[45%] text-emerald-600 transition-[opacity,scale] duration-500 dark:text-emerald-400",
              finished ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
            style={{ transitionTimingFunction: EASE_OUT }}
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          {/* Both headings share one cell, so the swap cross-fades without the header changing height */}
          <div className="grid">
            <h3
              id={finished ? undefined : headingId}
              aria-hidden={finished || undefined}
              className={cn("col-start-1 row-start-1 select-none font-semibold leading-snug transition-opacity duration-500", s.title, finished && "opacity-0")}
            >
              {title}
            </h3>
            <h3
              id={finished ? headingId : undefined}
              aria-hidden={!finished || undefined}
              className={cn("col-start-1 row-start-1 select-none font-semibold leading-snug transition-opacity duration-500", s.title, !finished && "opacity-0")}
            >
              {finishedTitle}
            </h3>
          </div>
          <p className="select-none text-sm text-muted-foreground">
            {/* The widest count is laid out invisibly, so the line never changes width */}
            <span className="inline-grid tabular-nums">
              <span className="invisible col-start-1 row-start-1">
                {total} of {total}
              </span>
              <span className="col-start-1 row-start-1">
                {count} of {total}
              </span>
            </span>{" "}
            done
          </p>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={open ? "Hide the checklist" : "Show the checklist"}
          onClick={() => setOpen(!open)}
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <ChevronDown
            className={cn("size-4 motion-safe:transition-transform motion-safe:duration-500", open && "rotate-180")}
            style={{ transitionTimingFunction: EASE_OUT }}
          />
        </button>
      </div>

      <div
        id={bodyId}
        inert={!open}
        className={cn("grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-500", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
        style={{ transitionTimingFunction: EASE_OUT }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={s.bodyTop}>
          {(description || (finished && finishedDescription)) && (
            <p className="mb-3 text-sm text-muted-foreground">{finished && finishedDescription ? finishedDescription : description}</p>
          )}
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const isDone = done.includes(item.id);
              const isNext = item.id === nextId;
              const detailId = `${bodyId}-${item.id}`;
              const hasDetail = Boolean(item.description || item.action);
              return (
                <li
                  key={item.id}
                  data-done={isDone || undefined}
                  data-next={isNext || undefined}
                  className={cn("flex rounded-xl transition-colors duration-300", s.item, isNext && t.next)}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isDone}
                    aria-describedby={hasDetail && !isDone ? detailId : undefined}
                    onClick={() => toggle(item.id)}
                    className={cn(
                      "grid shrink-0 cursor-pointer place-items-center rounded-full border-2 transition-[background-color,border-color] duration-300",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      isDone ? "border-foreground bg-foreground text-background" : "border-foreground/25 hover:border-foreground/50",
                      s.box,
                    )}
                  >
                    <span className="sr-only">{item.title}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[62%]">
                      <path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        pathLength={1}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="[stroke-dasharray:1] motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500"
                        style={{ strokeDashoffset: isDone ? 0 : 1, transitionTimingFunction: EASE_OUT }}
                      />
                    </svg>
                  </button>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block select-none font-medium leading-snug transition-colors duration-300",
                        s.title === "text-lg" ? "text-base" : "text-sm",
                        isDone && "text-muted-foreground line-through decoration-foreground/30",
                      )}
                    >
                      {item.title}
                    </span>
                    {hasDetail && (
                      // Finished items fold to their title line
                      <div
                        id={detailId}
                        inert={isDone}
                        className={cn(
                          "grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-500",
                          isDone ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
                        )}
                        style={{ transitionTimingFunction: EASE_OUT }}
                      >
                        <div className="min-h-0 overflow-hidden">
                          {item.description && <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>}
                          {item.action && isNext && (
                            <div className="pt-2.5 pb-0.5">
                              {item.action.href ? (
                                <a
                                  href={item.action.href}
                                  onClick={item.action.onClick}
                                  className={cn(
                                    "inline-flex cursor-pointer items-center whitespace-nowrap rounded-lg bg-foreground font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                    s.button,
                                  )}
                                >
                                  {item.action.label}
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  onClick={item.action.onClick}
                                  className={cn(
                                    "inline-flex cursor-pointer items-center whitespace-nowrap rounded-lg bg-foreground font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                    s.button,
                                  )}
                                >
                                  {item.action.label}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          {finished && onDismiss && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={onDismiss}
                className={cn(
                  "cursor-pointer select-none whitespace-nowrap rounded-lg border border-border bg-background font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring motion-safe:starting:opacity-0 motion-safe:transition-opacity motion-safe:duration-500",
                  s.button,
                )}
              >
                Dismiss
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {finished ? finishedTitle : `${count} of ${total} done`}
      </p>
    </section>
  );
}
