/**
 * Playground for `readout-compare`: the two figures, how they are written and the surface.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Streams", group: "Figures" },
    { prop: "value", label: "Value", kind: "stepper", min: 0, max: 5_000_000, step: 10_000, group: "Figures" },
    { prop: "previous", label: "Previous", kind: "stepper", min: 0, max: 5_000_000, step: 10_000, group: "Figures" },
    { prop: "format", label: "Format", kind: "select", options: ["number", "currency", "percent", "compact"], default: "number", group: "Figures" },
    { prop: "goodDirection", label: "Good when", kind: "segmented", options: ["up", "down"], default: "up", group: "Figures" },
    { prop: "currentLabel", label: "This period", kind: "text", placeholder: "This period", group: "Periods" },
    { prop: "previousLabel", label: "Last period", kind: "text", placeholder: "Last period", group: "Periods" },
    { prop: "caption", label: "Caption", kind: "text", placeholder: "Every release", group: "Periods" },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled"),
  ],
};
