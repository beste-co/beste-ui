"use client";

import { useId, useState } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FilterRadioOption {
  label: string;
  value: string;
  /** Muted result count shown at the end of the row */
  count?: number;
}

interface FilterRadioProps {
  /** Optional group heading rendered above the list */
  label?: string;
  options?: FilterRadioOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string | null;
  /** Initial selection when uncontrolled */
  defaultValue?: string;
  /** Clicking the active option clears the selection (default true) */
  allowClear?: boolean;
  onChange?: (value: string | null) => void;
  className?: string;
}

export const filterRadioDemo: FilterRadioProps = {
  label: "Fit",
  className: "w-56",
  defaultValue: "regular",
  options: [
    { label: "Regular", value: "regular", count: 32 },
    { label: "Oversized", value: "oversized", count: 14 },
    { label: "Slim", value: "slim", count: 21 },
  ],
};

export function FilterRadio({
  label,
  options = [],
  value,
  defaultValue,
  allowClear = true,
  onChange,
  className,
}: FilterRadioProps) {
  const uid = useId();
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
      <RadioGroup
        value={selected ?? ""}
        onValueChange={(next) => select(next)}
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <RadioGroupItem
              id={`${uid}-${option.value}`}
              value={option.value}
              onClick={() => {
                if (allowClear && selected === option.value) select(null);
              }}
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
      </RadioGroup>
    </div>
  );
}
