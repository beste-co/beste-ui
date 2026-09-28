/**
 * Playground for `qr-code`: what it encodes and how the modules are drawn.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "value", label: "Value", kind: "text", placeholder: "https://beste.co", group: "Content" },
    { prop: "ecc", label: "Correction", kind: "segmented", options: ["L", "M", "Q", "H"], default: "M", group: "Content" },
    { prop: "moduleStyle", label: "Modules", kind: "segmented", options: ["square", "rounded", "dots"], default: "square", group: "Shape" },
    { prop: "finderStyle", label: "Eyes", kind: "segmented", options: ["square", "rounded", "circle"], default: "square", group: "Shape" },
    { prop: "quietZone", label: "Quiet zone", kind: "stepper", min: 0, max: 6, step: 1, default: 2, group: "Shape" },
    { prop: "color", label: "Color", kind: "color", default: "currentColor", group: "Color" },
    { prop: "background", label: "Background", kind: "color", default: "transparent", group: "Color" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
