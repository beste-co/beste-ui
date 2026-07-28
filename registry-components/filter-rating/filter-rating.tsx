"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface FilterRatingOption {
  label: string;
  /** Numeric threshold as a string, e.g. "4" for "4 stars and up" */
  value: string;
}

interface FilterRatingProps {
  /** Optional group heading rendered above the rows */
  label?: string;
  options?: FilterRatingOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string | null;
  /** Initial selection when uncontrolled */
  defaultValue?: string;
  /** Clicking the active row clears the selection (default true) */
  allowClear?: boolean;
  onChange?: (value: string | null) => void;
  className?: string;
}

export const filterRatingDemo: FilterRatingProps = {
  label: "Rating",
  className: "w-56",
  defaultValue: "4",
  options: [
    { label: "4 & up", value: "4" },
    { label: "3 & up", value: "3" },
    { label: "2 & up", value: "2" },
  ],
};

export function FilterRating({
  label,
  options = [],
  value,
  defaultValue,
  allowClear = true,
  onChange,
  className,
}: FilterRatingProps) {
  const [internal, setInternal] = useState<string | null>(defaultValue ?? null);
  const selected = value !== undefined ? value : internal;

  const select = (optionValue: string) => {
    const next =
      allowClear && selected === optionValue ? null : optionValue;
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
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selected === option.value;
          const starCount = Math.min(5, Math.max(0, Number(option.value)));
          return (
            <button
              key={index}
              type="button"
              onClick={() => select(option.value)}
              aria-pressed={isSelected}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary"
              )}
            >
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={cn(
                      "size-4",
                      starIndex < starCount
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
