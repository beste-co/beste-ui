/**
 * Playground for `aperture-reveal`: the photo, the blades and the pace.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "imageSrc", label: "Photo", kind: "text", default: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2400&q=80", group: "Photo" },
    { prop: "bladeColor", label: "Blades", kind: "color", default: "#1b1c1f", group: "Color" },
    { prop: "highlightColor", label: "Highlight", kind: "color", default: "#f3ede2", group: "Color" },
    { prop: "bodyColor", label: "Body", kind: "color", default: "#0b0b0c", group: "Color" },
    { prop: "blades", label: "Blades", kind: "stepper", min: 5, max: 16, step: 1, default: 9, group: "Iris" },
    { prop: "rotation", label: "Rotation", kind: "slider", min: 0, max: 360, step: 1, default: 0, unit: "°", group: "Iris" },
    { prop: "twist", label: "Twist", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Iris" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Iris" },
    { prop: "progress", label: "Progress (autoplay off)", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.36, group: "Motion" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.2, max: 3, step: 0.1, default: 1, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
