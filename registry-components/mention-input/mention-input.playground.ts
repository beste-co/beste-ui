/**
 * Playground for `mention-input`: typing, picking and removing mentions.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";
import { SURFACE_CONTROLS } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "@ or #", does: "Opens the suggestion list at the caret, filtered by what follows." },
    { keys: "Up / Down", does: "Moves through the suggestions." },
    { keys: "Enter or Tab", does: "Inserts the highlighted suggestion as a mention." },
    { keys: "Escape", does: "Closes the list until the caret leaves this trigger." },
    { keys: "Backspace / Delete", does: "Removes a whole mention next to the caret." },
    { keys: "Left / Right", does: "Steps over a mention in one press." },
    { keys: "Mod + Enter", does: "Calls onSubmit with the markup, when one is given." },
  ],
  controls: [
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "Write a comment", group: "Content" },
    { prop: "rows", label: "Rows", kind: "stepper", min: 1, max: 6, step: 1, default: 2, group: "Content" },
    { prop: "maxRows", label: "Max rows", kind: "stepper", min: 2, max: 16, step: 1, default: 8, group: "Content" },
    { prop: "limit", label: "Suggestions", kind: "stepper", min: 3, max: 12, step: 1, default: 6, group: "Content" },
    ...SURFACE_CONTROLS,
  ],
};
