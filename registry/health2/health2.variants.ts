import type { VariantConfig } from "@/lib/variant-types";

export const health2Variants: VariantConfig = {
  columns: {
    label: "Columns",
    type: "select",
    options: [
      { value: "3", label: "3 Columns" },
      { value: "4", label: "4 Columns" },
    ],
    default: 4,
  },
};
