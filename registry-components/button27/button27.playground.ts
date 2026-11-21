/** Playground for `button27`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Start free" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["primary", "outline", "soft", "inverse", "ghost", "ink"], default: "primary" },
    { prop: "size", label: "Size", kind: "segmented", options: ["sm", "default"], default: "default" },
  ],
};
