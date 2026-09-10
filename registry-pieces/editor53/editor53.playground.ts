/** Playground for `editor53`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "fileName", label: "File", kind: "text", placeholder: "hero-photograph.jpg" },
    { prop: "slotLabel", label: "Slot", kind: "text", placeholder: "Hero media" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
