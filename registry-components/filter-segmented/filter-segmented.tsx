"use client";

import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterSegmentedOption {
  label: string;
  value: string;
}

interface FilterSegmentedProps {
  /** Optional group heading rendered above the control */
  label?: string;
  options?: FilterSegmentedOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string | null;
  /** Initial selection when uncontrolled */
  defaultValue?: string;
  /** Clicking the active segment clears the selection (default true) */
  allowClear?: boolean;
  onChange?: (value: string | null) => void;
  className?: string;
}

export const filterSegmentedDemo: FilterSegmentedProps = {
  label: "Gender",
  defaultValue: "women",
  options: [
    { label: "All", value: "all" },
    { label: "Women", value: "women" },
    { label: "Men", value: "men" },
    { label: "Kids", value: "kids" },
  ],
};

export function FilterSegmented({
  label,
  options = [],
  value,
  defaultValue,
  allowClear = true,
  onChange,
  className,
}: FilterSegmentedProps) {
  const [internal, setInternal] = useState<string | null>(defaultValue ?? null);
  const selected = value !== undefined ? value : internal;

  const select = (next: string | null) => {
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
      {/* Single source of truth: each click computes the next value directly,
          so selection is driven purely by the controlled `value`. Radix's own
          value change is a no-op here (no onValueChange), avoiding the double
          update that dropped clicks. */}
      <Tabs value={selected ?? ""}>
        <TabsList>
          {options.map((option, index) => (
            <TabsTrigger
              key={index}
              value={option.value}
              onClick={() =>
                select(
                  allowClear && selected === option.value ? null : option.value
                )
              }
              className="cursor-pointer px-3"
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
