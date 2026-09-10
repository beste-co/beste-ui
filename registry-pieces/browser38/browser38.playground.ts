/** Playground for `browser38`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "We use cookies" },
    { prop: "description", label: "Description", kind: "text" },
    { prop: "rejectLabel", label: "Refuse", kind: "text", default: "Reject All" },
    { prop: "customizeLabel", label: "Customise", kind: "text", default: "Customize" },
    { prop: "acceptLabel", label: "Accept", kind: "text", default: "Accept All" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
