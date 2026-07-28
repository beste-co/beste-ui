"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

interface FilterSearchProps {
  /** Optional group heading rendered above the input */
  label?: string;
  placeholder?: string;
  /** Controlled text; omit to let the component manage its own state */
  value?: string;
  /** Initial text when uncontrolled */
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const filterSearchDemo: FilterSearchProps = {
  label: "Search",
  placeholder: "Search products",
  className: "w-64",
};

export function FilterSearch({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  className,
}: FilterSearchProps) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const text = value ?? internal;

  return (
    <div className={className}>
      {label && (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
          {label}
        </h3>
      )}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={text}
          onChange={(event) => {
            setInternal(event.target.value);
            onChange?.(event.target.value);
          }}
          className="pl-9"
        />
      </div>
    </div>
  );
}
