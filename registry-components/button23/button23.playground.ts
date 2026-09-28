/**
 * Playground for `button23`: its label and the four tones.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Enter the studio" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["light", "outline", "dark", "primary"], default: "light" },
    { prop: "direction", label: "Direction", kind: "segmented", options: ["up-right", "right"], default: "up-right" },
    { prop: "size", label: "Size", kind: "segmented", options: ["default", "sm"], default: "default" },
  ],
};
