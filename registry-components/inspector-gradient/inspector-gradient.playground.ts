/**
 * Playground for `inspector-gradient`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move between the stops on the bar." },
    { keys: "Arrow keys", does: "Move the focused stop one percent along the gradient." },
    { keys: "Shift + Arrow", does: "Ten percent." },
    { keys: "Double-click the bar", does: "Add a stop where you clicked." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Gradient" },
    { prop: "minStops", label: "Min stops", kind: "stepper", min: 2, max: 6, default: 2 },
    { prop: "maxStops", label: "Max stops", kind: "stepper", min: 2, max: 12, default: 8 },
    { prop: "format", label: "Colour format", kind: "select", options: ["hex", "oklch", "rgb"], default: "hex" },
    { prop: "alpha", label: "Alpha", kind: "switch", default: true },
    ...SURFACE_CONTROLS,
  ],
};
