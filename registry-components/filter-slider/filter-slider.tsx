"use client";

import { useState } from "react";

import { Slider } from "@/components/ui/slider";

interface FilterSliderProps {
  /** Optional group heading rendered above the slider */
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  /** Prefix shown before the numeric readouts, e.g. "$" */
  unit?: string;
  /** Controlled range; omit to let the component manage its own state */
  value?: [number, number];
  /** Initial range when uncontrolled */
  defaultValue?: [number, number];
  /** Fires on every thumb move */
  onChange?: (value: [number, number]) => void;
  /** Fires when the user releases a thumb; use it to trigger fetches */
  onCommit?: (value: [number, number]) => void;
  className?: string;
}

export const filterSliderDemo: FilterSliderProps = {
  label: "Price",
  className: "w-64",
  min: 0,
  max: 300,
  step: 5,
  unit: "$",
  defaultValue: [25, 180],
};

export function FilterSlider({
  label,
  min = 0,
  max = 100,
  step,
  unit,
  value,
  defaultValue,
  onChange,
  onCommit,
  className,
}: FilterSliderProps) {
  const [internal, setInternal] = useState<[number, number]>(
    defaultValue ?? [min, max]
  );
  const range = value ?? internal;
  const prefix = unit ?? "";

  const handleChange = (next: number[]) => {
    const pair: [number, number] = [next[0] ?? min, next[1] ?? max];
    setInternal(pair);
    onChange?.(pair);
  };

  return (
    <div className={className}>
      {label && (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
          {label}
        </h3>
      )}
      <Slider
        min={min}
        max={max}
        step={step}
        value={[range[0], Math.min(range[1], max)]}
        onValueChange={handleChange}
        onValueCommit={(next) =>
          onCommit?.([next[0] ?? min, next[1] ?? max])
        }
        className="cursor-pointer"
      />
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {prefix}
          {range[0]}
        </span>
        <span>
          {prefix}
          {Math.min(range[1], max)}
        </span>
      </div>
    </div>
  );
}
