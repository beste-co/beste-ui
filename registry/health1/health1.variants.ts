import type { VariantConfig } from "@/lib/variant-types";

export const health1Variants: VariantConfig = {
  cardStyle: {
    label: "Card Style",
    type: "select",
    options: [
      { value: "colorful", label: "Colorful" },
      { value: "minimal", label: "Minimal" },
    ],
    default: "minimal",
  },
  columns: {
    label: "Columns",
    type: "select",
    options: [
      { value: "3", label: "3 Columns" },
      { value: "4", label: "4 Columns" },
    ],
    default: "4",
  },
};
