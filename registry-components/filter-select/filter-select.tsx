"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Sentinel item value used internally to represent "clear the selection". */
const CLEAR_VALUE = "__filter-select-clear__";

interface FilterSelectOption {
  label: string;
  value: string;
  /** Muted result count shown at the end of the row */
  count?: number;
}

interface FilterSelectProps {
  /** Optional group heading rendered above the trigger */
  label?: string;
  options?: FilterSelectOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string | null;
  /** Initial selection when uncontrolled */
  defaultValue?: string;
  /** Placeholder shown while nothing is selected */
  placeholder?: string;
  /**
   * When set, renders a first item (e.g. "All categories") that clears the
   * selection and reports null through onChange.
   */
  clearLabel?: string;
  disabled?: boolean;
  onChange?: (value: string | null) => void;
  className?: string;
}

export const filterSelectDemo: FilterSelectProps = {
  label: "Category",
  placeholder: "All categories",
  clearLabel: "All categories",
  className: "w-64",
  defaultValue: "sneakers",
  options: [
    { label: "Sneakers", value: "sneakers", count: 24 },
    { label: "T-Shirts", value: "t-shirts", count: 18 },
    { label: "Hoodies", value: "hoodies", count: 9 },
    { label: "Accessories", value: "accessories", count: 12 },
  ],
};

export function FilterSelect({
  label,
  options = [],
  value,
  defaultValue,
  placeholder,
  clearLabel,
  disabled = false,
  onChange,
  className,
}: FilterSelectProps) {
  const [internal, setInternal] = useState<string | null>(defaultValue ?? null);
  const selected = value !== undefined ? value : internal;

  const handleChange = (next: string) => {
    const resolved = next === CLEAR_VALUE ? null : next;
    setInternal(resolved);
    onChange?.(resolved);
  };

  return (
    <div className={className}>
      {label && (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
          {label}
        </h3>
      )}
      <Select
        value={selected ?? ""}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full cursor-pointer">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {clearLabel && (
            <SelectItem value={CLEAR_VALUE} className="cursor-pointer">
              {clearLabel}
            </SelectItem>
          )}
          {options.map((option, index) => (
            <SelectItem
              key={index}
              value={option.value}
              className="cursor-pointer"
            >
              {option.label}
              {typeof option.count === "number" && (
                <span className="text-muted-foreground"> ({option.count})</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
