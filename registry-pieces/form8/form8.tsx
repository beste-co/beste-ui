"use client";

import { cn } from "@/lib/utils";

interface Field {
  label: string;
  value: string;
}

interface Form8Props {
  fields?: Field[];
  className?: string;
}

export const form8Demo: Form8Props = {
  fields: [
    { label: "First name", value: "Mira" },
    { label: "Last name", value: "Beste" },
  ],
};

export function Form8({ fields = [], className }: Form8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-80 grid-cols-2 gap-3">
        {fields.map((field, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-card-foreground">
              {field.label}
            </label>
            <div className="rounded-md border border-border bg-card px-3 py-2 shadow-sm">
              <span className="block truncate text-sm text-card-foreground">
                {field.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
