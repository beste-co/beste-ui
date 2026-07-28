/**
 * Playground for `inspector-position`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow keys", does: "One step on the focused axis." },
    { keys: "Shift + Arrow", does: "Ten steps." },
    { keys: "Home / End", does: "Send the axis to 0% or 100%." },
    { keys: "Page Up", does: "Centre the axis at 50%." },
    { keys: "Drag on the pad", does: "Moves the point; `snap` pulls it towards the thirds and the centre." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Position" },
    { prop: "step", label: "Step", kind: "stepper", min: 0.5, max: 25, default: 1, unit: "%" },
    { prop: "snap", label: "Snap to thirds", kind: "switch", default: true },
    { prop: "preview", label: "Preview image", kind: "text", placeholder: "https://…" },
    ...SURFACE_CONTROLS,
  ],
};
