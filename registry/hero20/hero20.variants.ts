import type { VariantConfig } from "@/lib/variant-types";

export const hero20Variants: VariantConfig = {
  transition: {
    label: "Transition",
    type: "select",
    options: [
      { value: "fade", label: "Fade" },
      { value: "parallax", label: "Parallax" },
      { value: "reveal", label: "Reveal" },
      { value: "morphism", label: "Morphism" },
      { value: "curtain", label: "Curtain" },
    ],
    default: "fade",
  },
  showThumbnails: { label: "Show Thumbnails", type: "boolean", default: true },
  showArrows: { label: "Show Arrows", type: "boolean", default: true },
  showProgress: { label: "Show Progress", type: "boolean", default: true },
};
