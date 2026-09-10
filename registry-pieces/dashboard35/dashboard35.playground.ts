/** Playground for `dashboard35`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "limit", label: "Seats", kind: "stepper", min: 1, max: 100, step: 1, default: 25 },
    { prop: "ofWord", label: "Of word", kind: "text", default: "of" },
    { prop: "billingValue", label: "Billing", kind: "text", default: "One invoice" },
    { prop: "stepMs", label: "Step", kind: "slider", min: 180, max: 900, step: 20, unit: "ms", default: 420, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
