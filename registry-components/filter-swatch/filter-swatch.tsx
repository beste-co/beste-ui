"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface FilterSwatchOption {
  label: string;
  value: string;
  /** CSS color painted inside the circle, e.g. "#2563eb" */
  swatch: string;
}

interface FilterSwatchProps {
  /** Optional group heading rendered above the swatches */
  label?: string;
  options?: FilterSwatchOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string[];
  /** Initial selection when uncontrolled */
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

export const filterSwatchDemo: FilterSwatchProps = {
  label: "Color",
  defaultValue: ["black"],
  options: [
    { label: "Black", value: "black", swatch: "#18181b" },
    { label: "White", value: "white", swatch: "#fafafa" },
    { label: "Blue", value: "blue", swatch: "#2563eb" },
    { label: "Red", value: "red", swatch: "#dc2626" },
    { label: "Green", value: "green", swatch: "#16a34a" },
  ],
};

export function FilterSwatch({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  className,
}: FilterSwatchProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  const selected = value ?? internal;

  const toggle = (optionValue: string) => {
    const next = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue];
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className={className}>
      {label && (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
          {label}
        </h3>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map((option, index) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={index}
              type="button"
              onClick={() => toggle(option.value)}
              title={option.label}
              aria-pressed={isSelected}
              className={cn(
                "size-8 cursor-pointer rounded-full border-2 transition-all",
                isSelected
                  ? "border-primary ring-2 ring-primary/25"
                  : "border-border hover:border-muted-foreground"
              )}
              style={{ backgroundColor: option.swatch }}
            >
              <span className="sr-only">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
