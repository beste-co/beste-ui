"use client";

import { useEffect, useId, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Phase = "typing" | "submitting" | "done";

interface Field {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "email";
}

interface Form37Props {
  heading?: string;
  fields?: Field[];
  submitLabel?: string;
  loadingLabel?: string;
  doneLabel?: string;
  charMs?: number;
  className?: string;
}

export const form37Demo: Form37Props = {
  heading: "Create your workspace",
  fields: [
    { label: "Name", value: "Nina Simone", placeholder: "Your name" },
    { label: "Email", value: "hello@beste.co", placeholder: "you@company.com", type: "email" },
    { label: "Company", value: "Beste Records", placeholder: "Company name" },
  ],
  submitLabel: "Continue",
  loadingLabel: "Setting things up",
  doneLabel: "You're in",
};

export function Form37({
  heading,
  fields = [],
  submitLabel = "Continue",
  loadingLabel = "Submitting",
  doneLabel = "Done",
  charMs = 70,
  className,
}: Form37Props) {
  const baseId = useId();
  const [field, setField] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      const current = fields[field];
      if (!current) {
        id = setTimeout(() => setPhase("submitting"), 450);
      } else if (count < current.value.length) {
        id = setTimeout(() => setCount((c) => c + 1), charMs);
      } else {
        id = setTimeout(() => {
          setField((f) => f + 1);
          setCount(0);
        }, 380);
      }
    } else if (phase === "submitting") {
      id = setTimeout(() => setPhase("done"), 1300);
    } else {
      return;
    }
    return () => clearTimeout(id);
  }, [phase, field, count, fields, charMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes form37-pop { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }`}</style>
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        {heading && (
          <p className="text-sm font-semibold text-card-foreground">{heading}</p>
        )}

        {fields.map((f, i) => {
          const active = phase === "typing" && i === field;
          const typed = i < field || phase !== "typing" ? f.value : i === field ? f.value.slice(0, count) : "";
          const id = `${baseId}-${i}`;
          return (
            <div key={i} className="flex flex-col gap-1">
              <label htmlFor={id} className="text-xs font-medium text-card-foreground">
                {f.label}
              </label>
              <div className="relative">
                <Input
                  id={id}
                  type={f.type ?? "text"}
                  value={typed}
                  placeholder={f.placeholder}
                  readOnly
                  tabIndex={-1}
                  className={cn(
                    "bg-background transition-shadow duration-200",
                    active && "border-ring ring-2 ring-ring/30"
                  )}
                />
                {active && (
                  <span
                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-base md:text-sm"
                    aria-hidden="true"
                  >
                    <span className="invisible whitespace-pre">{typed}</span>
                    <span className="ml-px h-4 w-0.5 animate-pulse bg-foreground motion-reduce:animate-none" />
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className={cn(
            "mt-1 flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-300",
            phase === "done"
              ? "bg-emerald-500 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {phase === "submitting" && (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          )}
          {phase === "done" && (
            <span
              className="flex motion-reduce:animate-none"
              style={{ animation: "form37-pop 300ms ease-out" }}
              aria-hidden="true"
            >
              <Check className="size-4" />
            </span>
          )}
          {phase === "typing" ? submitLabel : phase === "submitting" ? loadingLabel : doneLabel}
        </button>
      </div>
    </div>
  );
}
