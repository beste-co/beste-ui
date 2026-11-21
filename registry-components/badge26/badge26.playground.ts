/**
 * Playground for `badge26`: its label and the four tones.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Most chosen" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["secondary", "primary", "accent", "glass"], default: "secondary" },
  ],
};
