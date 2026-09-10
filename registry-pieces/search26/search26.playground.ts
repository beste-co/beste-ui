/**
 * Playground for `search26`: the props its documentation page lets a reader turn.
 *
 * Sits beside the piece rather than in one shared file, the same way the meta does.
 * Site-only: `shadcn add` copies the .tsx and nothing else.
 *
 * `matches` is left out. The control kinds cover scalars, and a list editor for
 * three rows would crowd the panel with the one prop a reader is least likely to
 * want to change while looking at the surface options.
 */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "brief", label: "Brief", kind: "text", placeholder: "What the business does" },
    { prop: "scanningLabel", label: "While reading", kind: "text", default: "Reading the brief" },
    { prop: "resultsLabel", label: "Once matched", kind: "text", default: "matched" },
    { prop: "restLabel", label: "Rest", kind: "text", placeholder: "24 more" },
    {
      prop: "stepMs",
      label: "Step",
      kind: "slider",
      min: 200,
      max: 900,
      step: 20,
      unit: "ms",
      default: 460,
      group: "Motion",
    },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
