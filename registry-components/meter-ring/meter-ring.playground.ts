/**
 * Playground for `meter-ring`: the reading, how the ring is split and how it spins while waiting.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "value", label: "Value", kind: "slider", min: 0, max: 100, step: 1 },
    { prop: "label", label: "Label", kind: "text", placeholder: "Storage used" },
    { prop: "unit", label: "Unit", kind: "text", placeholder: "GB" },
    { prop: "segments", label: "Segments", kind: "stepper", min: 0, max: 24, step: 1, default: 0, group: "Ring" },
    { prop: "gap", label: "Gap", kind: "slider", min: 0, max: 6, step: 0.5, default: 2, unit: "%", group: "Ring" },
    { prop: "indeterminate", label: "Indeterminate", kind: "switch", default: false, group: "Ring" },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled"),
  ],
};
