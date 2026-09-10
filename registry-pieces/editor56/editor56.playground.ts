/** Playground for `editor56`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "Integrations" },
    { prop: "activeLabel", label: "Active word", kind: "text", default: "Active" },
    { prop: "stepMs", label: "Step", kind: "slider", min: 150, max: 900, step: 10, unit: "ms", default: 420, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
