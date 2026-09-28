/**
 * Playground for `reaction-rating`: the scale, what it shows and how it looks.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover", does: "Previews the rating under the pointer; with half steps the left half of a star is a half." },
    { keys: "Click", does: "Sets the rating. Clicking the current rating again clears it." },
    { keys: "Arrow keys / Home / End", does: "Step through the rating from the keyboard." },
    { keys: "0 to 9", does: "Jump straight to that many stars." },
    { keys: "Backspace / Delete", does: "Clear the rating." },
  ],
  controls: [
    { prop: "max", label: "Stars", kind: "stepper", min: 3, max: 10, step: 1, default: 5, group: "Scale" },
    { prop: "allowHalf", label: "Half stars", kind: "switch", default: false, group: "Scale" },
    { prop: "clearable", label: "Clearable", kind: "switch", default: true, group: "Scale" },
    { prop: "readOnly", label: "Read only", kind: "switch", default: false, group: "Scale" },
    { prop: "showValue", label: "Show value", kind: "switch", default: false, group: "Label" },
    { prop: "count", label: "Count", kind: "stepper", min: 0, max: 100000, step: 100, group: "Label" },
    { prop: "color", label: "Color", kind: "segmented", options: ["amber", "primary", "foreground"], default: "amber", group: "Surface" },
    ...SURFACE_CONTROLS.map((control) => (control.prop === "tone" ? { ...control, default: "ghost" } : control)),
  ],
};
