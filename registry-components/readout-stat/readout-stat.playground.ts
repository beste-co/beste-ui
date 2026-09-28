/**
 * Playground for `readout-stat`: the figure, how it is written and what it is compared with.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Monthly revenue" },
    { prop: "value", label: "Value", kind: "stepper", min: 0, max: 1_000_000, step: 1_000 },
    { prop: "previous", label: "Previous", kind: "stepper", min: 0, max: 1_000_000, step: 1_000 },
    { prop: "format", label: "Format", kind: "select", options: ["number", "currency", "percent", "compact"], default: "number" },
    { prop: "goodDirection", label: "Good when", kind: "segmented", options: ["up", "down"], default: "up" },
    { prop: "caption", label: "Caption", kind: "text", placeholder: "Compared with August" },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled"),
  ],
};
