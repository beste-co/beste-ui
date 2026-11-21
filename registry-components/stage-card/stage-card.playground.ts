/** Playground for `stage-card`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "With Bestie" },
    { prop: "layout", label: "Layout", kind: "segmented", options: ["stack", "inline"], default: "stack" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default" },
    { prop: "titleSize", label: "Title size", kind: "segmented", options: ["md", "lg"], default: "md" },
  ],
};
