/** Playground for `editor55`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "sectionLabel", label: "Section", kind: "text", placeholder: "Feature" },
    { prop: "sectionId", label: "Anchor", kind: "text", placeholder: "#feature283" },
    { prop: "dwellMs", label: "Dwell", kind: "slider", min: 400, max: 2000, step: 50, unit: "ms", default: 900, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
