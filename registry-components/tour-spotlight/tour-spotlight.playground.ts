/**
 * Playground for `tour-spotlight`: how the overlay behaves and every key it answers.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow right / Arrow left", does: "Next or previous step." },
    { keys: "Escape", does: "Skip the tour." },
    { keys: "Tab", does: "Move between the card's buttons. Focus stays in the card until the tour closes." },
    { keys: "Click a dot", does: "Jump straight to that step." },
  ],
  controls: [
    { prop: "allowTargetClick", label: "Click through", kind: "switch", default: false, group: "Overlay" },
    { prop: "closeOnOverlayClick", label: "Skip on outside click", kind: "switch", default: false, group: "Overlay" },
    { prop: "ring", label: "Ring", kind: "switch", default: true, group: "Overlay" },
    { prop: "dim", label: "Dim", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.55, group: "Overlay" },
    { prop: "openDelay", label: "Open delay", kind: "slider", min: 0, max: 5000, step: 250, unit: "ms", default: 3000, group: "Overlay" },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled").map((control) =>
      control.prop === "tone" ? { ...control, default: "ghost" } : control,
    ),
  ],
};
