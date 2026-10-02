/** Playground for `isometric92`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import { ISOMETRIC_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    ...ISOMETRIC_CONTROLS,
    { prop: "temperature", label: "Temperature", kind: "stepper", min: 10, max: 30, step: 1, default: 21, group: "Content" },
  ],
};
