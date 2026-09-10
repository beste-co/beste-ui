/** Playground for `form40`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
} from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  stage: PIECE_GLASS_STAGE,
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "This site is private" },
    { prop: "domain", label: "Domain", kind: "text", placeholder: "yourdomain.com" },
    { prop: "placeholder", label: "Field ghost", kind: "text", default: "Enter a password" },
    { prop: "submitLabel", label: "Button", kind: "text", default: "Apply" },
    { prop: "note", label: "Note", kind: "text" },
    { prop: "length", label: "Characters", kind: "stepper", min: 4, max: 16, step: 1, default: 8, group: "Motion" },
    { prop: "stepMs", label: "Keystroke", kind: "slider", min: 80, max: 400, step: 10, unit: "ms", default: 190, group: "Motion" },
    ...PIECE_SURFACE_CONTROLS,
  ],
};
