"use client";

import { cn } from "@/lib/utils";

interface Field {
  label: string;
  value: string;
}

interface Form9Props {
  legend?: string;
  description?: string;
  fields?: Field[];
  className?: string;
}

export const form9Demo: Form9Props = {
  legend: "Billing address",
  description: "Used on invoices and receipts.",
  fields: [
    { label: "Street", value: "221B Riverside Ave" },
    { label: "City", value: "Istanbul" },
    { label: "Postal code", value: "34381" },
  ],
};

export function Form9({
  legend,
  description,
  fields = [],
  className,
}: Form9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <fieldset className="flex w-full max-w-80 flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-0.5">
          {legend && (
            <legend className="text-sm font-semibold text-card-foreground">
              {legend}
            </legend>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {fields.map((field, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                {field.label}
              </label>
              <div className="rounded-md border border-border bg-background px-3 py-1.5">
                <span className="block truncate text-sm text-card-foreground">
                  {field.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
