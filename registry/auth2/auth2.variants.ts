import type { VariantConfig } from "@/lib/variant-types";

export const auth2Variants: VariantConfig = {
  mediaPosition: {
    label: "Image Position",
    type: "select",
    options: [
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
    ],
    default: "right",
  },
};
