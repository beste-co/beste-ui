/**
 * Playground for `image-loupe`: the mode, the lens and how far it magnifies.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover", does: "The lens follows the pointer; the wheel changes the zoom." },
    { keys: "Press and hold", does: "On touch, opens the lens above the finger. A quick swipe still scrolls." },
    { keys: "Enter", does: "Magnifies from the keyboard; press again or Escape to close." },
    { keys: "Arrows", does: "Move the magnified area, Shift for fine steps." },
    { keys: "+ / -", does: "Zoom in or out while magnified." },
  ],
  controls: [
    { prop: "mode", label: "Mode", kind: "segmented", options: ["lens", "side"], default: "lens", group: "Loupe" },
    { prop: "side", label: "Pane side", kind: "segmented", options: ["right", "left"], default: "right", group: "Loupe" },
    { prop: "defaultZoom", label: "Zoom", kind: "slider", min: 1.5, max: 6, step: 0.1, unit: "x", default: 2.5, group: "Loupe" },
    { prop: "lensShape", label: "Lens", kind: "segmented", options: ["circle", "rounded"], default: "circle", group: "Loupe" },
    { prop: "lensSize", label: "Lens size", kind: "slider", min: 100, max: 320, step: 10, unit: "px", group: "Loupe" },
    { prop: "wheelZoom", label: "Wheel zoom", kind: "switch", default: true, group: "Loupe" },
    { prop: "aspectRatio", label: "Aspect", kind: "select", options: ["1 / 1", "4 / 3", "3 / 4", "16 / 9"], group: "Frame" },
    { prop: "hint", label: "Hint", kind: "text", placeholder: "Hover to zoom", group: "Frame" },
    ...SURFACE_CONTROLS,
  ],
};
