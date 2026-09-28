"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the track. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. */
type Size = "sm" | "default" | "lg";

/** What a step shows. `complete`, `current` and `upcoming` follow from `current`; the other two are set per step. */
export type StepState = "complete" | "current" | "upcoming" | "error" | "skipped";

export interface Step {
  title: string;
  description?: string;
  /** Overrides the state that `current` would give this step. */
  status?: "error" | "skipped";
}

interface StepsTrackProps {
  steps: Step[];
  /** Index of the step in progress. `steps.length` marks every step complete. */
  current: number;
  /**
   * Row of steps, or a column with the text beside each marker.
   * @defaultValue "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Makes steps pressable. Which ones is set by `clickable`. */
  onStepClick?: (index: number) => void;
  /**
   * Which steps answer `onStepClick`: the ones already done, every one, or none.
   * @defaultValue "completed" */
  clickable?: "completed" | "all" | "none";
  /** @defaultValue "ghost" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  className?: string;
  /** Accessible name for the list. */
  "aria-label"?: string;
}

export const stepsTrackDemo: StepsTrackProps = {
  steps: [
    { title: "Upload stems", description: "WAV or AIFF, one file per track" },
    { title: "Set the mix", description: "Levels, pan and a reference" },
    { title: "Master", description: "Loudness and final polish" },
    { title: "Release", description: "Artwork, credits and stores" },
  ],
  current: 2,
  orientation: "horizontal",
  "aria-label": "Release progress",
  className: "w-full max-w-2xl",
};

/** Same spring the inspector family uses. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** Delay between two segments filling one after another, so the line flows rather than jumps. */
const STAGGER_MS = 140;

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, { root: string; title: string }> = {
  sm: { root: "p-3 [--steps-marker:--spacing(6)] [--steps-gap:--spacing(1.5)]", title: "text-sm" },
  default: { root: "p-4 [--steps-marker:--spacing(7)] [--steps-gap:--spacing(2)]", title: "text-sm" },
  lg: { root: "p-5 [--steps-marker:--spacing(9)] [--steps-gap:--spacing(2.5)]", title: "text-base" },
};

const markerStyles: Record<StepState, string> = {
  complete: "border-foreground bg-foreground text-background",
  current: "border-foreground bg-background text-foreground ring-4 ring-foreground/10",
  upcoming: "border-border bg-background text-muted-foreground",
  error: "border-destructive bg-destructive text-white",
  skipped: "border-dashed border-border bg-background text-muted-foreground",
};

const stateLabel: Record<StepState, string> = {
  complete: "Completed",
  current: "Current step",
  upcoming: "Not started",
  error: "Needs attention",
  skipped: "Skipped",
};

export function stateOf(step: Step | undefined, index: number, current: number): StepState {
  if (step?.status) return step.status;
  if (index < current) return "complete";
  return index === current ? "current" : "upcoming";
}

function Marker({ state, index }: { state: StepState; index: number }) {
  const done = state === "complete";
  return (
    <span
      aria-hidden="true"
      data-state={state}
      className={cn(
        "relative grid size-(--steps-marker) shrink-0 place-items-center rounded-full border-2 text-sm font-medium tabular-nums",
        "motion-safe:transition-[background-color,border-color,color,box-shadow] motion-safe:duration-300",
        markerStyles[state],
      )}
    >
      {/* The number gives way to the check as the step completes */}
      <span
        className={cn(
          "col-start-1 row-start-1 motion-safe:transition-[opacity,scale] motion-safe:duration-200",
          done || state === "error" || state === "skipped" ? "scale-50 opacity-0" : "opacity-100",
        )}
      >
        {index + 1}
      </span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="col-start-1 row-start-1 size-[55%]">
        {state === "error" ? (
          <path d="M7 7l10 10M17 7L7 17" />
        ) : state === "skipped" ? (
          <path d="M7 12h10" />
        ) : (
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={done ? 0 : 1}
            className="motion-safe:transition-[stroke-dashoffset] motion-safe:delay-100 motion-safe:duration-300 motion-safe:ease-out"
          />
        )}
      </svg>
    </span>
  );
}

export function StepsTrack({
  steps,
  current,
  orientation = "horizontal",
  onStepClick,
  clickable = "completed",
  tone = "ghost",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: StepsTrackProps) {
  const vertical = orientation === "vertical";
  // Where the line stood last render, so newly filled segments can flow in order from there
  const previous = React.useRef(current);
  const from = previous.current;
  React.useEffect(() => {
    previous.current = current;
  }, [current]);

  const canPress = (state: StepState) =>
    Boolean(onStepClick) && (clickable === "all" || (clickable === "completed" && state === "complete"));

  return (
    <ol
      aria-label={ariaLabel}
      data-orientation={orientation}
      style={{ "--steps-ease": SPRING_EASE, "--steps-count": steps.length } as React.CSSProperties}
      className={cn(
        "w-full rounded-xl text-foreground",
        vertical ? "flex flex-col" : "grid grid-cols-[repeat(var(--steps-count),minmax(0,1fr))]",
        toneStyles[tone],
        sizeStyles[size].root,
        className,
      )}
    >
      {steps.map((step, index) => {
        const state = stateOf(step, index, current);
        const last = index === steps.length - 1;
        const filled = index + 1 <= current;
        // Segments filling in run forward from the old position; segments emptying run back toward the new one
        const order = filled ? index - from : from - 1 - index;
        const delay = Math.max(0, order) * STAGGER_MS;
        const press = canPress(state);
        const Item = press ? "button" : "div";

        return (
          <li
            key={index}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            className={cn("relative min-w-0", vertical ? "flex gap-(--steps-gap) pb-6 last:pb-0" : "flex flex-col items-center")}
          >
            {!last && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute overflow-hidden rounded-full bg-border",
                  vertical
                    ? "left-[calc(var(--steps-marker)/2-1px)] top-[calc(var(--steps-marker)+var(--steps-gap))] bottom-(--steps-gap) w-0.5"
                    : "left-[calc(50%+var(--steps-marker)/2+var(--steps-gap))] top-[calc(var(--steps-marker)/2-1px)] h-0.5 w-[calc(100%-var(--steps-marker)-var(--steps-gap)*2)]",
                )}
              >
                <span
                  style={{ transitionDelay: `${delay}ms` }}
                  className={cn(
                    "absolute inset-0 bg-foreground motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-(--steps-ease)",
                    vertical ? "origin-top" : "origin-left",
                    filled ? "scale-100" : vertical ? "scale-y-0" : "scale-x-0",
                  )}
                />
              </span>
            )}

            <Item
              {...(press ? { type: "button" as const, onClick: () => onStepClick?.(index) } : {})}
              className={cn(
                "group/step flex min-w-0 select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
                vertical ? "items-start gap-(--steps-gap) text-left" : "flex-col items-center gap-(--steps-gap) px-1 text-center",
                press && "cursor-pointer",
              )}
            >
              <span className={cn("motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-(--steps-ease)", press && "group-hover/step:scale-110")}>
                <Marker state={state} index={index} />
              </span>
              <span className={cn("flex min-w-0 flex-col", vertical && "pt-[calc((var(--steps-marker)-1.25rem)/2)]")}>
                <span
                  className={cn(
                    "truncate font-medium",
                    sizeStyles[size].title,
                    state === "upcoming" || state === "skipped" ? "text-muted-foreground" : state === "error" ? "text-destructive" : "text-foreground",
                    press && "group-hover/step:underline group-hover/step:underline-offset-4",
                  )}
                >
                  {step.title}
                </span>
                {step.description && <span className="text-sm text-muted-foreground">{step.description}</span>}
                <span className="sr-only">, {stateLabel[state]}</span>
              </span>
            </Item>
          </li>
        );
      })}
    </ol>
  );
}
