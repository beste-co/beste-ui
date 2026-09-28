/**
 * Playground for `signature-pad`: the ink and the guides.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Draw", does: "Mouse, finger or pen. A stylus draws with its real pressure." },
    { keys: "Cmd / Ctrl + Z", does: "Undo the last stroke while the pad has focus." },
  ],
  controls: [
    { prop: "color", label: "Ink", kind: "color", group: "Ink" },
    { prop: "minWidth", label: "Thin", kind: "slider", min: 0.2, max: 3, step: 0.1, unit: "px", default: 0.8, group: "Ink" },
    { prop: "maxWidth", label: "Thick", kind: "slider", min: 1, max: 8, step: 0.1, unit: "px", default: 3.2, group: "Ink" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "Sign here", group: "Guides" },
    { prop: "showBaseline", label: "Baseline", kind: "switch", default: true, group: "Guides" },
    ...SURFACE_CONTROLS,
  ],
};
