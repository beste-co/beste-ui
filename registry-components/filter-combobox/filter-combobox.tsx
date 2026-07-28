"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterComboboxOption {
  label: string;
  value: string;
  /** Muted result count shown at the end of the row */
  count?: number;
}

interface FilterComboboxProps {
  /** Optional group heading rendered above the trigger */
  label?: string;
  options?: FilterComboboxOption[];
  /** Controlled selection; omit to let the component manage its own state */
  value?: string[];
  /** Initial selection when uncontrolled */
  defaultValue?: string[];
  /** Allow selecting more than one option (default false) */
  multiple?: boolean;
  /** Trigger text while nothing is selected */
  placeholder?: string;
  /** Placeholder of the search input inside the dropdown */
  searchPlaceholder?: string;
  /** Message shown when the search matches nothing */
  emptyText?: string;
  disabled?: boolean;
  onChange?: (value: string[]) => void;
  className?: string;
}

export const filterComboboxDemo: FilterComboboxProps = {
  label: "Brand",
  placeholder: "All brands",
  searchPlaceholder: "Search brands",
  className: "w-64",
  multiple: true,
  defaultValue: ["acme"],
  options: [
    { label: "Acme Supply", value: "acme", count: 18 },
    { label: "Northwind", value: "northwind", count: 12 },
    { label: "Globex", value: "globex", count: 9 },
    { label: "Initech", value: "initech", count: 7 },
    { label: "Umbra Works", value: "umbra", count: 5 },
    { label: "Vandelay", value: "vandelay", count: 4 },
  ],
};

export function FilterCombobox({
  label,
  options = [],
  value,
  defaultValue,
  multiple = false,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled = false,
  onChange,
  className,
}: FilterComboboxProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  const [open, setOpen] = useState(false);
  const selected = value ?? internal;

  const toggle = (optionValue: string) => {
    let next: string[];
    if (selected.includes(optionValue)) {
      next = selected.filter((v) => v !== optionValue);
    } else {
      next = multiple ? [...selected, optionValue] : [optionValue];
    }
    setInternal(next);
    onChange?.(next);
    if (!multiple) setOpen(false);
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
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
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
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] min-w-56 p-0"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder ?? "Search"} />
            <CommandList>
              <CommandEmpty>{emptyText ?? "No results found."}</CommandEmpty>
              <CommandGroup>
                {options.map((option, index) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={index}
                      value={option.label}
                      onSelect={() => toggle(option.value)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "size-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex-1">{option.label}</span>
                      {typeof option.count === "number" && (
                        <span className="text-sm text-muted-foreground">
                          {option.count}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
