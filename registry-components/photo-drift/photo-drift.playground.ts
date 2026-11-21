/**
 * Playground for `photo-drift`: how far it drifts and whether it blurs in.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "drift", label: "Drift", kind: "slider", min: 0, max: 0.2, step: 0.01, default: 0.08, group: "Motion" },
    { prop: "reveal", label: "Blur in", kind: "switch", default: true, group: "Motion" },
  ],
};
