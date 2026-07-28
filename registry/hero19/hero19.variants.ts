import type { VariantConfig } from "@/lib/variant-types";

export const hero19Variants: VariantConfig = {
  transition: {
    label: "Transition",
    type: "select",
    options: [
      { value: "fade", label: "Fade" },
      { value: "slide", label: "Slide" },
      { value: "zoom", label: "Zoom" },
      { value: "blur", label: "Blur" },
      { value: "kenBurns", label: "Ken Burns" },
    ],
    default: "fade",
  },
  showDots: { label: "Show Dots", type: "boolean", default: true },
  showArrows: { label: "Show Arrows", type: "boolean", default: false },
  showPreview: { label: "Show Preview", type: "boolean", default: true },
};
