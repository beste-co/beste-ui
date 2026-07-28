/**
 * Playground for `inspector-date`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Publish" },
    { prop: "mode", label: "Mode", kind: "segmented", options: ["date", "time", "datetime"], default: "date" },
    { prop: "step", label: "Minute step", kind: "stepper", min: 1, max: 60, default: 1 },
    { prop: "emptyLabel", label: "Empty label", kind: "text", placeholder: "Pick a date" },
    { prop: "clearable", label: "Clearable", kind: "switch", default: false },
    { prop: "weekStartsOn", label: "Week starts on", kind: "stepper", min: 0, max: 6, default: 1 },
    { prop: "readOnly", label: "Read only", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
