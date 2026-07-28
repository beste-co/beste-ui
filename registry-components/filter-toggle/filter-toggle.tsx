"use client";

import { useId, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FilterToggleOption {
  label: string;
  value: string;
}

interface FilterToggleProps {
  /** Optional group heading rendered above the rows */
  label?: string;
  options?: FilterToggleOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string[];
  /** Initial selection when uncontrolled */
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

export const filterToggleDemo: FilterToggleProps = {
  label: "Deals",
  className: "w-56",
  defaultValue: ["sale"],
  options: [
    { label: "On sale", value: "sale" },
    { label: "New arrivals", value: "new" },
    { label: "In stock only", value: "in-stock" },
  ],
};

export function FilterToggle({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  className,
}: FilterToggleProps) {
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
          <div
            key={index}
            className="flex items-center justify-between gap-3"
          >
            <Label
              htmlFor={`${uid}-${option.value}`}
              className="cursor-pointer font-normal"
            >
              {option.label}
            </Label>
            <Switch
              id={`${uid}-${option.value}`}
              checked={selected.includes(option.value)}
              onCheckedChange={() => toggle(option.value)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
