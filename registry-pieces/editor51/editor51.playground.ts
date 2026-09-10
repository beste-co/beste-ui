/** Playground for `editor51`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    {
      prop: "character",
      label: "Character",
      kind: "select",
      options: [
        { value: "serif", label: "Serif" },
        { value: "hairline", label: "Hairline" },
        { value: "mono", label: "Mono" },
        { value: "editorial", label: "Editorial" },
      ],
      default: "serif",
    },
    { prop: "setName", label: "Set", kind: "text", placeholder: "Altair" },
    { prop: "heading", label: "Heading", kind: "text" },
    { prop: "buttonLabel", label: "Button", kind: "text", placeholder: "See the set" },
    { prop: "stepMs", label: "Step", kind: "slider", min: 120, max: 600, step: 20, unit: "ms", default: 260, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
