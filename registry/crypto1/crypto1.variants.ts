import type { VariantConfig } from "@/lib/variant-types";

export const crypto1Variants: VariantConfig = {
  displayPosition: {
    label: "Display Position",
    type: "select",
    options: [
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
    ],
    default: "left",
  },
};
