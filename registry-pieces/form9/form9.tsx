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
  bordered?: boolean;
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
  bordered: false,
};

export function Form9({
  legend,
  description,
  fields = [],
  bordered = false,
  className,
}: Form9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <fieldset className={cn("flex w-full max-w-80 flex-col gap-3 rounded-lg bg-card p-4 shadow-sm", bordered && "border border-border")}>
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
              <div className={cn("rounded-md px-3 py-1.5", bordered ? "border border-border bg-background" : "bg-muted")}>
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
