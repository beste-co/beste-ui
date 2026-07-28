/**
 * Playground for `color-picker`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow keys on the plane", does: "Move the swatch. Up and Down change lightness while keeping the colour as saturated as it was; Left and Right change chroma." },
    { keys: "Shift + Arrow", does: "A coarse step, for crossing the plane without dragging." },
    { keys: "Arrow keys on a slider", does: "One step of hue or alpha \u2014 the sliders are the inspector's own rows, so they answer everything those answer." },
    { keys: "Enter in the field", does: "Commit what was typed. An unparseable value is marked invalid rather than silently dropped." },
    { keys: "Escape in the field", does: "Throw the draft away and put the committed colour back." },
    { keys: "The eyedropper", does: "Offered only where the browser has `EyeDropper`; picks a colour from anywhere on screen." },
  ],
  controls: [
    { prop: "color", label: "Colour", kind: "color" },
    { prop: "format", label: "Format", kind: "select", options: ["hex", "oklch", "rgb"], default: "hex" },
    { prop: "alpha", label: "Alpha", kind: "switch", default: false },
    { prop: "oklch", label: "OKLCH plane", kind: "switch", default: true },
    { prop: "hideInput", label: "Hide the field", kind: "switch", default: false },
  ],
};
