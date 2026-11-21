/** Playground for `terminal16`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "title", label: "Title", kind: "text", group: "Content" },
    { prop: "prompt", label: "Prompt", kind: "text", group: "Content" },
    { prop: "summary", label: "Summary", kind: "text", group: "Content" },
    { prop: "stepMs", label: "Step", kind: "slider", min: 150, max: 1000, step: 25, unit: "ms", default: 450, group: "Motion" },
    { prop: "framed", label: "Framed", kind: "switch", default: true, group: "Surface" },
  ],
};
