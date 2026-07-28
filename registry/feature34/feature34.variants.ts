import type { VariantConfig } from "@/lib/variant-types";

export const feature34Variants: VariantConfig = {
  columns: {
    label: "Columns",
    type: "select",
    options: [
      { value: "1", label: "1 Column" },
      { value: "2", label: "2 Columns" },
    ],
    default: "2",
  },
};
