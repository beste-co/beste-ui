/** Playground for `form39`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "Cookie Preferences" },
    { prop: "requiredLabel", label: "Required word", kind: "text", default: "Required" },
    { prop: "stepMs", label: "Decide", kind: "slider", min: 250, max: 1400, step: 20, unit: "ms", default: 620, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
