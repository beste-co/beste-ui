/** Playground for `isometric147`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import { ISOMETRIC_CONTROLS, ISOMETRIC_GLASS_STAGE, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: ISOMETRIC_GLASS_STAGE,
  controls: [
    ...ISOMETRIC_CONTROLS,
    { prop: "total", label: "Total", kind: "slider", min: 5, max: 95, step: 0.05, default: 34.55, group: "Content" },
  ],
};
