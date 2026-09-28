/**
 * Playground for `text21`: the text, the particles and how they answer the cursor.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Every letter, loose." },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "span"], default: "p" },
    { prop: "color", label: "Ink", kind: "color", default: "currentColor", group: "Particles" },
    { prop: "accentColor", label: "Moving", kind: "color", default: "var(--primary)", group: "Particles" },
    { prop: "density", label: "Density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Particles" },
    { prop: "size", label: "Size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Particles" },
    { prop: "shimmer", label: "Shimmer", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Particles" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "force", label: "Push", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
    { prop: "reach", label: "Reach", kind: "slider", min: 40, max: 400, step: 10, default: 160, unit: "px", group: "Cursor" },
    { prop: "swirl", label: "Swirl", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
    { prop: "spring", label: "Return", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
    { prop: "entrance", label: "Fly in", kind: "switch", default: true, group: "Motion" },
    { prop: "idle", label: "Idle drift", kind: "switch", default: true, group: "Motion" },
  ],
};
