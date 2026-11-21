/** Playground for `editor63`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "heading", label: "Heading", kind: "text", default: "Skin care that takes its time" },
    { prop: "intervalMs", label: "Interval", kind: "slider", min: 1600, max: 6000, step: 200, unit: "ms", default: 3200, group: "Motion" },
  ],
};
