/**
 * Playground for `file-avatar`: the shape, the saved image and the progress ring.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Click, drop or paste", does: "Pick an image and open the crop step" },
    { keys: "Drag / pinch", does: "Move the picture / zoom it inside the crop" },
    { keys: "Arrows (Shift for bigger steps)", does: "Move the picture in the focused crop area" },
    { keys: "+ / -", does: "Zoom in or out" },
    { keys: "Enter / Escape", does: "Save the crop / cancel it" },
  ],
  controls: [
    { prop: "name", label: "Name", kind: "text", placeholder: "Björk" },
    { prop: "shape", label: "Shape", kind: "segmented", options: ["circle", "rounded"], default: "circle" },
    { prop: "outputSize", label: "Output size", kind: "stepper", min: 64, max: 1024, step: 64, unit: "px", default: 256 },
    { prop: "progress", label: "Progress", kind: "slider", min: 0, max: 1, step: 0.05 },
    { prop: "removable", label: "Removable", kind: "switch", default: true },
    { prop: "hint", label: "Hint", kind: "text", placeholder: "PNG or JPG, up to 5 MB" },
    ...SURFACE_CONTROLS,
  ],
};
