import type { VariantConfig } from "@/lib/variant-types";

export const hero21Variants: VariantConfig = {
  transition: {
    label: "Transition",
    type: "select",
    options: [
      { value: "fade", label: "Fade" },
      { value: "slide", label: "Slide" },
      { value: "scale", label: "Scale" },
      { value: "flip", label: "Flip" },
      { value: "cube", label: "Cube" },
    ],
    default: "fade",
  },
  showCounter: { label: "Show Counter", type: "boolean", default: true },
  showNavDots: { label: "Show Nav Dots", type: "boolean", default: true },
  showArrows: { label: "Show Arrows", type: "boolean", default: true },
};
