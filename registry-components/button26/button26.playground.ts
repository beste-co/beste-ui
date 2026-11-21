/**
 * Playground for `button26`: its label, the four tones and the three sizes.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Start free" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["secondary", "primary", "outline", "glass"], default: "secondary" },
    { prop: "size", label: "Size", kind: "segmented", options: ["sm", "default", "lg"], default: "lg" },
  ],
};
