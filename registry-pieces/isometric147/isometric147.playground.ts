/** Playground for `isometric147`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import { ISOMETRIC_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    ...ISOMETRIC_CONTROLS,
    { prop: "total", label: "Total", kind: "slider", min: 5, max: 95, step: 0.05, default: 34.55, group: "Content" },
  ],
};
