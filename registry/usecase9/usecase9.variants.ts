import type { VariantConfig } from "@/lib/variant-types";

export const usecase9Variants: VariantConfig = {
  columns: {
    label: "Columns",
    type: "select",
    options: [
      { value: "2", label: "2 Columns" },
      { value: "3", label: "3 Columns" },
    ],
    default: 3,
  },
};
