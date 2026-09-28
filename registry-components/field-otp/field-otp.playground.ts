/**
 * Playground for `field-otp`: the slots, what they accept and how they look.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Type", does: "Fills the slot under the caret and moves to the next one." },
    { keys: "Backspace", does: "Clears the slot before the caret and steps back." },
    { keys: "Left / Right", does: "Move between slots; typing then overwrites the slot you land on." },
    { keys: "Paste or SMS autofill", does: "Fills every slot at once." },
    { keys: "Click a slot", does: "Puts the caret there, up to the first empty slot." },
  ],
  controls: [
    { prop: "length", label: "Slots", kind: "stepper", min: 4, max: 8, step: 1, default: 6, group: "Code" },
    { prop: "separator", label: "Dash after", kind: "stepper", min: 0, max: 7, step: 1, group: "Code" },
    { prop: "pattern", label: "Accepts", kind: "segmented", options: [{ value: "numeric", label: "Digits" }, { value: "alphanumeric", label: "Letters and digits" }], default: "numeric", group: "Code" },
    { prop: "mask", label: "Mask", kind: "switch", default: false, group: "Code" },
    { prop: "status", label: "Status", kind: "select", options: ["idle", "checking", "error", "success"], group: "Code" },
    ...SURFACE_CONTROLS.map((control) => (control.prop === "tone" ? { ...control, default: "outline" } : control)),
  ],
};
