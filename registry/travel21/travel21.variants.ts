import type { VariantConfig } from "@/lib/variant-types";

export const travel21Variants: VariantConfig = {
  displayPosition: {
    label: "Display Position",
    type: "select",
    options: [
      { value: "left", label: "Image Left" },
      { value: "right", label: "Image Right" },
    ],
    default: "right",
  },
};
