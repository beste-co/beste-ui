import type { VariantConfig } from "@/lib/variant-types";

export const reveal2Variants: VariantConfig = {
  orientation: {
    label: "Orientation",
    type: "select",
    options: [
      { value: "horizontal", label: "Horizontal" },
      { value: "vertical", label: "Vertical" },
    ],
    default: "horizontal",
  },
  showLabels: { label: "Show Labels", type: "boolean", default: true },
};
