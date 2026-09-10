/** Playground for `ai52`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "Give Claude access" },
    { prop: "subject", label: "Site", kind: "text", placeholder: "yourdomain.com" },
    { prop: "deniedLabel", label: "Never word", kind: "text", default: "Never" },
    { prop: "denied", label: "Withheld", kind: "text", placeholder: "Publish to the live site" },
    { prop: "approveLabel", label: "Button", kind: "text", default: "Approve" },
    { prop: "stepMs", label: "Step", kind: "slider", min: 180, max: 900, step: 20, unit: "ms", default: 400, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
