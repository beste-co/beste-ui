"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface FilterChipsOption {
  label: string;
  value: string;
}

interface FilterChipsProps {
  /** Optional group heading rendered above the chips */
  label?: string;
  options?: FilterChipsOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string[];
  /** Initial selection when uncontrolled */
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

export const filterChipsDemo: FilterChipsProps = {
  label: "Size",
  defaultValue: ["m", "l"],
  options: [
    { label: "XS", value: "xs" },
    { label: "S", value: "s" },
    { label: "M", value: "m" },
    { label: "L", value: "l" },
    { label: "XL", value: "xl" },
    { label: "XXL", value: "xxl" },
  ],
};

export function FilterChips({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  className,
}: FilterChipsProps) {
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
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={index}
              type="button"
              onClick={() => toggle(option.value)}
              aria-pressed={isSelected}
              className={cn(
                "h-9 min-w-11 cursor-pointer rounded-md border px-3 text-sm font-medium transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
