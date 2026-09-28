/**
 * Playground for `heatmap-grid`: the axes, the scale and the surface.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow keys", does: "Move between slots; the grid is one tab stop." },
    { keys: "Home / End", does: "The first or last slot of the row." },
    { keys: "Cmd or Ctrl + Home / End", does: "The first or last slot of the grid." },
    { keys: "Page Up / Page Down", does: "The top or bottom of the column." },
    { keys: "Enter / Space", does: "Select the slot, when slots are selectable." },
  ],
  controls: [
    { prop: "weekStartsOn", label: "Week starts", kind: "segmented", options: [{ value: "0", label: "Sunday" }, { value: "1", label: "Monday" }], default: "0", group: "Axes" },
    { prop: "hourCycle", label: "Hours", kind: "segmented", options: ["auto", "12", "24"], default: "auto", group: "Axes" },
    { prop: "color", label: "Color", kind: "color", default: "var(--primary)", group: "Scale" },
    { prop: "levels", label: "Levels", kind: "stepper", min: 3, max: 9, step: 1, default: 5, group: "Scale" },
    { prop: "showLegend", label: "Legend", kind: "switch", default: true, group: "Scale" },
    { prop: "showPeak", label: "Busiest slot", kind: "switch", default: true, group: "Scale" },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled"),
  ],
};
