/**
 * Playground for `toolbar`: the bar's own props, and every key it answers.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Enter or leave the bar. The whole toolbar is one stop, landing on the item used last." },
    { keys: "Arrow keys", does: "Move along the bar: left and right in a row, up and down in a column. Wraps at the ends." },
    { keys: "Home / End", does: "Jump to the first or the last item." },
    { keys: "Enter / Space", does: "Press the button, or turn the toggle on or off." },
    { keys: "Escape", does: "Close the tooltip." },
  ],
  controls: [
    { prop: "orientation", label: "Orientation", kind: "segmented", options: ["horizontal", "vertical"], default: "horizontal" },
    { prop: "side", label: "Tooltip side", kind: "select", options: ["top", "bottom", "left", "right"] },
    { prop: "floating", label: "Floating", kind: "switch", default: false },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled"),
  ],
};
