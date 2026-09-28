/**
 * Playground for `button24`: its label and tones.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Get a festival pass" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["dark", "primary", "light"], default: "dark" },
  ],
};
