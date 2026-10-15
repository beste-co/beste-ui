/**
 * Playground for `button25`: its label, the four tones and the two sizes.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Register your interest" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["dark", "outline", "primary", "neutral"], default: "dark" },
    { prop: "size", label: "Size", kind: "segmented", options: ["default", "sm"], default: "default" },
  ],
};
