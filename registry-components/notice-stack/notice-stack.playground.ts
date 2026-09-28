/**
 * Playground for `notice-stack`: where the stack sits and how each notice looks.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "F8 / Alt + T", does: "Move the focus to the newest notice." },
    { keys: "Tab", does: "Walk through the notices and their buttons; the stack fans out while it has focus." },
    { keys: "Escape", does: "Dismiss the focused notice and return the focus to where it was." },
    { keys: "Hover", does: "Fan the stack out and pause every countdown." },
    { keys: "Swipe", does: "Flick a notice sideways or off the edge to dismiss it." },
  ],
  controls: [
    {
      prop: "position",
      label: "Position",
      kind: "select",
      options: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"],
      default: "bottom-center",
      group: "Stack",
    },
    { prop: "max", label: "Visible", kind: "stepper", min: 1, max: 6, step: 1, default: 3, group: "Stack" },
    { prop: "duration", label: "Duration", kind: "slider", min: 1000, max: 10000, step: 500, default: 4000, unit: "ms", group: "Stack" },
    { prop: "expand", label: "Always expanded", kind: "switch", default: false, group: "Stack" },
    { prop: "closeButton", label: "Close button", kind: "switch", default: false, group: "Notice" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "outline", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
