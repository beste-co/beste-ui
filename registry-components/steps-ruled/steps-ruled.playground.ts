/**
 * Playground for `steps-ruled`: numbering, size and the numeral color.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "numbering", label: "Numbering", kind: "segmented", options: ["roman", "decimal", "none"], default: "roman" },
    { prop: "size", label: "Size", kind: "segmented", options: ["default", "lg"], default: "default" },
    { prop: "markerTone", label: "Numeral", kind: "segmented", options: ["primary", "secondary", "current"], default: "primary" },
  ],
};
