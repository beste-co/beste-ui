import type { VariantConfig } from "@/lib/variant-types";

export const health4Variants: VariantConfig = {
  imagePosition: {
    label: "Image Position",
    type: "select",
    options: [
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
    ],
    default: "right",
  },
};
