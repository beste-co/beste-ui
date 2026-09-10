/** Playground for `editor52`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "Appearance" },
    { prop: "stepMs", label: "Step", kind: "slider", min: 150, max: 700, step: 10, unit: "ms", default: 340, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
