"use client";

import { useId, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterCheckboxOption {
  label: string;
  value: string;
  /** Muted result count shown at the end of the row */
  count?: number;
}

interface FilterCheckboxProps {
  /** Optional group heading rendered above the list */
  label?: string;
  options?: FilterCheckboxOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string[];
  /** Initial selection when uncontrolled */
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

export const filterCheckboxDemo: FilterCheckboxProps = {
  label: "Category",
  className: "w-56",
  defaultValue: ["sneakers"],
  options: [
    { label: "Sneakers", value: "sneakers", count: 24 },
    { label: "T-Shirts", value: "t-shirts", count: 18 },
    { label: "Hoodies", value: "hoodies", count: 9 },
    { label: "Accessories", value: "accessories", count: 12 },
  ],
};

export function FilterCheckbox({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  className,
}: FilterCheckboxProps) {
  const uid = useId();
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
      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <Checkbox
              id={`${uid}-${option.value}`}
              checked={selected.includes(option.value)}
              onCheckedChange={() => toggle(option.value)}
              className="cursor-pointer"
            />
            <Label
              htmlFor={`${uid}-${option.value}`}
              className="flex-1 cursor-pointer font-normal"
            >
              {option.label}
            </Label>
            {typeof option.count === "number" && (
              <span className="text-sm text-muted-foreground">
                {option.count}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
