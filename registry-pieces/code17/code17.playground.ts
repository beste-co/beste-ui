/** Playground for `code17`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "Tools" },
    { prop: "countLabel", label: "Count", kind: "text", placeholder: "62 available" },
    { prop: "readLabel", label: "Read word", kind: "text", default: "reads" },
    { prop: "writeLabel", label: "Write word", kind: "text", default: "writes draft" },
    { prop: "withheldLabel", label: "Withheld word", kind: "text", default: "not exposed" },
    { prop: "stepMs", label: "Step", kind: "slider", min: 200, max: 900, step: 20, unit: "ms", default: 460, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
