/**
 * Playground for `meter-stack`: the capacity, when it warns and what is shown around the bar.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover a segment or legend entry", does: "Singles it out with its value and share" },
    { keys: "Tab through the legend", does: "The same highlight from the keyboard" },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Studio drive" },
    { prop: "warningAt", label: "Warning at", kind: "slider", min: 0.5, max: 1, step: 0.05, default: 0.8 },
    { prop: "dangerAt", label: "Danger at", kind: "slider", min: 0.5, max: 1, step: 0.05, default: 0.95 },
    { prop: "showTotal", label: "Total", kind: "switch", default: true },
    { prop: "showLegend", label: "Legend", kind: "switch", default: true },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled"),
  ],
};
