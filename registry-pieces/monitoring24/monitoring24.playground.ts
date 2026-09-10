/** Playground for `monitoring24`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "Downloaded by this page" },
    { prop: "totalLabel", label: "Total word", kind: "text", default: "Total" },
    { prop: "unit", label: "Unit", kind: "text", default: "KB" },
    { prop: "countMs", label: "Count", kind: "slider", min: 400, max: 2500, step: 50, unit: "ms", default: 1100, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
