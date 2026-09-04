"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Check,
  Database,
  Filter,
  Mail,
  Send,
  Sparkles,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";
type Phase = "run" | "flow" | "done";
type StepIcon = "webhook" | "filter" | "sparkles" | "database" | "send" | "mail" | "bot";

interface Step {
  label: string;
  icon?: StepIcon;
}

interface Automation21Props {
  steps?: Step[];
  stepMs?: number;
  flowMs?: number;
  holdMs?: number;
  tone?: Tone;
  className?: string;
}

const icons: Record<StepIcon, typeof Webhook> = {
  webhook: Webhook,
  filter: Filter,
  sparkles: Sparkles,
  database: Database,
  send: Send,
  mail: Mail,
  bot: Bot,
};

const doneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const runningClasses: Record<Tone, string> = {
  primary: "bg-card text-primary ring-2 ring-primary",
  foreground: "bg-card text-foreground ring-2 ring-foreground",
  emerald: "bg-card text-emerald-500 ring-2 ring-emerald-500",
  sky: "bg-card text-sky-500 ring-2 ring-sky-500",
  violet: "bg-card text-violet-500 ring-2 ring-violet-500",
};

const lineClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

export const automation21Demo: Automation21Props = {
  steps: [
    { label: "Webhook", icon: "webhook" },
    { label: "Filter", icon: "filter" },
    { label: "Enrich", icon: "sparkles" },
    { label: "Notify", icon: "send" },
  ],
  tone: "primary",
};

export function Automation21({
  steps = [],
  stepMs = 900,
  flowMs = 650,
  holdMs = 2200,
  tone = "primary",
  className,
}: Automation21Props) {
  // A step runs, then the packet flows along one segment, then the next step runs.
  const [state, setState] = useState({
    index: 0,
    phase: "run" as Phase,
    instant: false,
  });
  const { index, phase } = state;
  const last = steps.length - 1;

  useEffect(() => {
    if (!steps.length) return;
    if (phase === "run") {
      const id = setTimeout(
        () =>
          setState({
            index,
            phase: index >= last ? "done" : "flow",
            instant: false,
          }),
        stepMs
      );
      return () => clearTimeout(id);
    }
    if (phase === "flow") {
      const id = setTimeout(
        () => setState({ index: index + 1, phase: "run", instant: false }),
        flowMs
      );
      return () => clearTimeout(id);
    }
    const id = setTimeout(
      () => setState({ index: 0, phase: "run", instant: true }),
      holdMs
    );
    return () => clearTimeout(id);
  }, [index, phase, last, steps.length, stepMs, flowMs, holdMs]);

  useEffect(() => {
    if (!state.instant) return;
    const id = setTimeout(
      () => setState((s) => ({ ...s, instant: false })),
      60
    );
    return () => clearTimeout(id);
  }, [state.instant]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes automation21-travel { from { left: 0%; opacity: 0; } 18% { opacity: 1; } 82% { opacity: 1; } to { left: 100%; opacity: 0; } }
@keyframes automation21-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
`}</style>
      <div className="w-full max-w-72">
        <div className="flex items-start">
          {steps.map((step, i) => {
            const Icon = icons[step.icon ?? "bot"];
            const isRunning = i === index && phase === "run";
            const isDone = i < index || (i === index && phase !== "run");
            const flowing = phase === "flow" && i === index;
            const filled = i < index;
            return (
              <div key={i} className="contents">
                <div className="flex w-12 shrink-0 flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "relative flex size-8 items-center justify-center rounded-lg transition-colors duration-300",
                      isDone && doneClasses[tone],
                      isRunning && runningClasses[tone],
                      !isDone && !isRunning && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isRunning && (
                      <span
                        className={cn(
                          "absolute inset-0 animate-ping rounded-lg opacity-30 motion-reduce:animate-none",
                          lineClasses[tone]
                        )}
                        aria-hidden="true"
                      />
                    )}
                    {isDone ? (
                      <Check className="relative size-4" aria-hidden="true" />
                    ) : (
                      <Icon className="relative size-4" aria-hidden="true" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-xs transition-colors",
                      isDone || isRunning ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < last && (
                  <div className="relative -mx-1 mt-4 h-0.5 flex-1 rounded-full bg-muted" aria-hidden="true">
                    <span
                      className={cn(
                        "absolute inset-0 origin-left rounded-full",
                        lineClasses[tone],
                        state.instant
                          ? "transition-none"
                          : "transition-transform duration-300 ease-out motion-reduce:transition-none",
                        filled ? "scale-x-100" : "scale-x-0"
                      )}
                      style={
                        flowing
                          ? { animation: `automation21-fill ${flowMs}ms linear forwards` }
                          : undefined
                      }
                    />
                    {flowing && (
                      <span
                        className={cn(
                          "absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm motion-reduce:hidden",
                          lineClasses[tone]
                        )}
                        style={{ animation: `automation21-travel ${flowMs}ms linear forwards` }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
