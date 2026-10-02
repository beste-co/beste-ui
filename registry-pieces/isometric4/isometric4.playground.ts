/** Playground for `isometric4`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import { ISOMETRIC_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    ...ISOMETRIC_CONTROLS,
    { prop: "units", label: "Units", kind: "stepper", min: 3, max: 7, step: 1, default: 5, group: "Content" },
  ],
};
