/** Playground for `code16`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "command", label: "Command", kind: "text" },
    { prop: "note", label: "Note", kind: "text", placeholder: "MIT licensed, no account needed" },
    { prop: "stepMs", label: "Tick", kind: "slider", min: 200, max: 1200, step: 20, unit: "ms", default: 520, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
