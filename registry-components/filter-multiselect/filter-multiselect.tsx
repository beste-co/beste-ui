"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterMultiselectOption {
  label: string;
  value: string;
  /** Muted result count shown at the end of the row */
  count?: number;
}

interface FilterMultiselectProps {
  /** Optional group heading rendered above the trigger */
  label?: string;
  options?: FilterMultiselectOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string[];
  /** Initial selection when uncontrolled */
  defaultValue?: string[];
  /** Trigger text while nothing is selected */
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string[]) => void;
  className?: string;
}

export const filterMultiselectDemo: FilterMultiselectProps = {
  label: "Size",
  placeholder: "All sizes",
  className: "w-64",
  defaultValue: ["m", "l"],
  options: [
    { label: "XS", value: "xs", count: 6 },
    { label: "S", value: "s", count: 12 },
    { label: "M", value: "m", count: 28 },
    { label: "L", value: "l", count: 24 },
    { label: "XL", value: "xl", count: 11 },
  ],
};

export function FilterMultiselect({
  label,
  options = [],
  value,
  defaultValue,
  placeholder,
  disabled = false,
  onChange,
  className,
}: FilterMultiselectProps) {
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

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);
  const triggerText =
    selectedLabels.length === 0
      ? (placeholder ?? "Select")
      : selectedLabels.length <= 2
        ? selectedLabels.join(", ")
        : `${selectedLabels.length} selected`;

  return (
    <div className={className}>
      {label && (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
          {label}
        </h3>
      )}
      {/* modal keeps the popover interactive when the filter lives inside a dialog */}
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full cursor-pointer justify-between font-normal"
          >
            <span
              className={cn(
                "truncate",
                selectedLabels.length === 0 && "text-muted-foreground"
              )}
            >
              {triggerText}
            </span>
            <span className="flex items-center gap-1.5">
              {selectedLabels.length > 0 && (
                <Badge variant="secondary">{selectedLabels.length}</Badge>
              )}
              <ChevronDown className="size-4 text-muted-foreground" />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] min-w-56 p-3"
        >
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
