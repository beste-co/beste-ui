/** Playground for `sky-gradient`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "preset", label: "Look", kind: "select", options: ["dawn", "haze", "azure", "dusk", "mist", "apricot", "lilac", "sage", "stone", "night"], default: "dawn" },
    { prop: "clouds", label: "Clouds", kind: "slider", min: 0, max: 1, step: 0.05 },
    { prop: "cloudX", label: "Cloud X", kind: "slider", min: 0, max: 1, step: 0.01 },
    { prop: "cloudY", label: "Cloud Y", kind: "slider", min: 0, max: 1, step: 0.01 },
    { prop: "cloudSize", label: "Cloud size", kind: "slider", min: 0.2, max: 1.5, step: 0.05 },
    { prop: "scatter", label: "Scatter", kind: "slider", min: 0, max: 1, step: 0.05 },
    { prop: "opacity", label: "Opacity", kind: "slider", min: 0, max: 1, step: 0.05, default: 1 },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 8, step: 0.1, default: 2.5 },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05 },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1 },
  ],
};
