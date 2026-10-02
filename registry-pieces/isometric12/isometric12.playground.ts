/** Playground for `isometric12`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import { ISOMETRIC_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    ...ISOMETRIC_CONTROLS,
    { prop: "count", label: "Switches", kind: "stepper", min: 2, max: 5, step: 1, default: 4, group: "Content" },
  ],
};
