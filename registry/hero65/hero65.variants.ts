import type { VariantConfig } from "@/lib/variant-types";

export const hero65Variants: VariantConfig = {
  displayPosition: {
    label: "Video Position",
    type: "select",
    options: [
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
    ],
    default: "right",
  },
};
