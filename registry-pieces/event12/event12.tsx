"use client";

import { cn } from "@/lib/utils";

interface CountdownUnit {
  value: string;
  label: string;
}

interface Event12Props {
  title?: string;
  units?: CountdownUnit[];
  caption?: string;
  className?: string;
}

export const event12Demo: Event12Props = {
  title: "Opens to everyone in",
  units: [
    { value: "12", label: "days" },
    { value: "06", label: "hrs" },
    { value: "48", label: "min" },
  ],
  caption: "Early access closes when the counter runs out.",
};

export function Event12({ title, units = [], caption, className }: Event12Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 text-center shadow-xl">
        {title && <p className="text-sm text-muted-foreground">{title}</p>}

        <div className="mt-3 flex items-stretch justify-center divide-x divide-border">
          {units.map((unit, index) => (
            <div key={index} className="flex-1 px-2">
              <p className="text-3xl font-light tracking-tight tabular-nums text-card-foreground">
                {unit.value}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{unit.label}</p>
            </div>
          ))}
        </div>

        {caption && (
          <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
