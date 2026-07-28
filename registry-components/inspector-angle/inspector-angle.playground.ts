/**
 * Playground for `inspector-angle`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow keys", does: "One step around the dial. Up and Right turn it clockwise, Down and Left back." },
    { keys: "Shift + Arrow", does: "Ten steps, for crossing a quadrant without dragging." },
    { keys: "Page Up / Page Down", does: "One `snapStep`, so a dial that snaps to 15° moves a notch at a time." },
    { keys: "Home / End", does: "Zero, or one step short of a full turn." },
    { keys: "Drag the dial", does: "Follows the pointer; the readout stays a field you can type into." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Rotation" },
    { prop: "step", label: "Step", kind: "stepper", min: 0.5, max: 45, default: 1, unit: "°" },
    { prop: "snapStep", label: "Snap step", kind: "stepper", min: 0, max: 90, default: 15, unit: "°" },
    ...SURFACE_CONTROLS,
  ],
};
