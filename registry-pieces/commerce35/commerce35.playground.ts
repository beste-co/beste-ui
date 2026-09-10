/** Playground for `commerce35`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "Products" },
    { prop: "variantsWord", label: "Variants word", kind: "text", default: "variants" },
    { prop: "stepMs", label: "Step", kind: "slider", min: 180, max: 900, step: 20, unit: "ms", default: 440, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
