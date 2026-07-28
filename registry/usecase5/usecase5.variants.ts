import type { VariantConfig } from "@/lib/variant-types";

export const usecase5Variants: VariantConfig = {
  columns: {
    label: "Columns",
    type: "select",
    options: [
      { value: "2", label: "2 Columns" },
      { value: "3", label: "3 Columns" },
      { value: "4", label: "4 Columns" },
    ],
    default: 4,
  },
};
