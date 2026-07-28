"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

interface FilterRangeProps {
  /** Optional group heading rendered above the inputs */
  label?: string;
  /** Placeholder for the minimum input */
  min?: number;
  /** Placeholder for the maximum input */
  max?: number;
  /**
   * Controlled raw input values as [min, max] strings; either side may be
   * empty for an open-ended range. Omit to let the component manage state.
   */
  value?: [string, string];
  /** Initial values when uncontrolled */
  defaultValue?: [string, string];
  onChange?: (value: [string, string]) => void;
  className?: string;
}

export const filterRangeDemo: FilterRangeProps = {
  label: "Price",
  className: "w-64",
  min: 0,
  max: 500,
  defaultValue: ["25", ""],
};

export function FilterRange({
  label,
  min,
  max,
  value,
  defaultValue,
  onChange,
  className,
}: FilterRangeProps) {
  const [internal, setInternal] = useState<[string, string]>(
    defaultValue ?? ["", ""]
  );
  const [rawMin, rawMax] = value ?? internal;

  const handleInput = (minStr: string, maxStr: string) => {
    const next: [string, string] = [minStr, maxStr];
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
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder={String(min ?? 0)}
          aria-label={`Minimum ${label ?? "value"}`}
          value={rawMin}
          onChange={(event) => handleInput(event.target.value, rawMax)}
        />
        <span className="text-sm text-muted-foreground">to</span>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder={String(max ?? "")}
          aria-label={`Maximum ${label ?? "value"}`}
          value={rawMax}
          onChange={(event) => handleInput(rawMin, event.target.value)}
        />
      </div>
    </div>
  );
}
