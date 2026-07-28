/**
 * Playground for `inspector-slider`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow keys", does: "One step. Up and Right raise it, Down and Left lower it." },
    { keys: "Shift + Arrow", does: "Ten steps, for crossing a long range without dragging." },
    { keys: "Page Up / Page Down", does: "A tenth of the range, never less than one step." },
    { keys: "Home / End", does: "Jump to the minimum or the maximum." },
    { keys: "Enter", does: "Turn the readout into a field and type an exact value." },
    { keys: "Double-click the readout", does: "The same, with a pointer." },
    { keys: "Wheel over a focused row", does: "One step per tick, ten with Shift. Turn it off with `wheel={false}`." },
    { keys: "Shift while dragging", does: "Fine mode: the handle follows the pointer at a fraction of the distance." },
  ],
  props: { label: "Opacity", min: 0, max: 100, step: 1, defaultValue: 60, unit: "%" },
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Opacity" },
    { prop: "min", label: "Min", kind: "stepper", min: -1000, max: 1000, default: 0 },
    { prop: "max", label: "Max", kind: "stepper", min: -1000, max: 1000, default: 100 },
    { prop: "step", label: "Step", kind: "stepper", min: 0.1, max: 50, default: 1 },
    { prop: "unit", label: "Unit", kind: "text", placeholder: "px" },
    { prop: "ticks", label: "Ticks", kind: "switch", default: true },
    { prop: "snap", label: "Snap on click", kind: "switch", default: true },
    ...SURFACE_CONTROLS,
  ],
};
