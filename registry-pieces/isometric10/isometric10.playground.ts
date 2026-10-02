/** Playground for `isometric10`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import { ISOMETRIC_CONTROLS, ISOMETRIC_GLASS_STAGE, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: ISOMETRIC_GLASS_STAGE,
  controls: [
    ...ISOMETRIC_CONTROLS,
    { prop: "day", label: "Day", kind: "stepper", min: 3, max: 31, step: 1, default: 24, group: "Content" },
  ],
};
