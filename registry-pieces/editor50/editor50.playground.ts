/** Playground for `editor50`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "sectionId", label: "Section id", kind: "text", placeholder: "hero181" },
    { prop: "title", label: "Title", kind: "text", placeholder: "Portrait Hero" },
    { prop: "description", label: "Description", kind: "text" },
    { prop: "addLabel", label: "Button", kind: "text", default: "Add to Page" },
    {
      prop: "loadMs",
      label: "Skeleton",
      kind: "slider",
      min: 400,
      max: 3000,
      step: 100,
      unit: "ms",
      default: 1400,
      group: "Motion",
    },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
