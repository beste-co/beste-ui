/**
 * Playground for `button3`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Click", does: "Runs the handler. If it returns a promise the button stays busy until it settles, so a double click cannot fire it twice." },
    { keys: "Enter / Space", does: "The same: it is a real button, not a div with a handler." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Create account" },
    { prop: "loadingLabel", label: "Loading label", kind: "text", placeholder: "Creating account\u2026" },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false },
    { prop: "tone", label: "Tone", kind: "select", options: ["dark", "primary", "outline"], default: "dark", group: "Surface" },
  ],
};
