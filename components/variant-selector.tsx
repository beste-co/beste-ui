"use client";

import { PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePreviewVariants } from "@/lib/preview-variants-store";
import type { VariantConfig, VariantFieldConfig } from "@/lib/variant-types";

interface VariantSelectorProps {
  variantConfig: VariantConfig;
  onOpen?: () => void;
}

export function VariantSelector({
  variantConfig,
  onOpen,
}: VariantSelectorProps) {
  const { variants, setVariant } = usePreviewVariants();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      onOpen?.();
    }
  };

  // Close popover when window loses focus (e.g., clicking inside iframe)
  useEffect(() => {
    const handleBlur = () => {
      setOpen(false);
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  const configEntries = Object.entries(variantConfig);

  if (configEntries.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          title="Customize"
        >
          <HugeiconsIcon icon={PreferenceHorizontalIcon} size={16} strokeWidth={2} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="space-y-3">
          <h4 className="font-medium text-base">Variants</h4>

          {configEntries.map(([propName, fieldConfig]) => {
            const config = fieldConfig as VariantFieldConfig;
            const currentValue =
              (variants[propName] as string) ??
              (config.default as string) ??
              "";

            if (config.type === "select" && config.options) {
              // Check if default is a number to determine if we should convert values
              const isNumeric = typeof config.default === "number";
              const handleChange = (value: string) => {
                setVariant(propName, isNumeric ? Number(value) : value);
              };

              return (
                <div key={propName} className="space-y-2">
                  <Label className="text-base text-muted-foreground">
                    {config.label}
                  </Label>
                  <Select
                    value={String(currentValue)}
                    onValueChange={handleChange}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {config.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }

            if (config.type === "info") {
              return (
                <div key={propName} className="space-y-1">
                  <Label className="text-base text-muted-foreground">
                    {config.label}
                  </Label>
                  <p className="text-sm font-mono bg-muted px-2 py-1.5 rounded-md">
                    {config.message}
                  </p>
                </div>
              );
            }

            if (config.type === "boolean") {
              const boolValue =
                (variants[propName] as boolean) ??
                (config.default as boolean) ??
                false;
              return (
                <div
                  key={propName}
                  className="flex items-center justify-between"
                >
                  <Label className="text-base text-muted-foreground">
                    {config.label}
                  </Label>
                  <Switch
                    checked={boolValue}
                    onCheckedChange={(checked) => setVariant(propName, checked)}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
