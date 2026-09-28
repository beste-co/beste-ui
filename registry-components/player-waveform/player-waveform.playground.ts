/**
 * Playground for `player-waveform`: the bars, the clock and the readouts.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Left / Right", does: "Seek back or forward 5 seconds." },
    { keys: "Shift + Arrow", does: "Seek 1 second, for fine placement." },
    { keys: "Page Up / Page Down", does: "A tenth of the duration." },
    { keys: "Home / End", does: "Jump to the start or the end." },
    { keys: "Space / K", does: "Play or pause, with the play button shown." },
    { keys: "Drag", does: "The playhead follows the pointer and seeks once on release." },
  ],
  controls: [
    { prop: "defaultPlaying", label: "Playing", kind: "switch", default: false, group: "Playback" },
    { prop: "loop", label: "Loop", kind: "switch", default: false, group: "Playback" },
    { prop: "rate", label: "Rate", kind: "slider", min: 0.25, max: 8, step: 0.25, unit: "x", default: 1, group: "Playback" },
    { prop: "showPlay", label: "Play button", kind: "switch", default: false, group: "Playback" },
    { prop: "showTime", label: "Show times", kind: "switch", default: false, group: "Playback" },
    { prop: "barWidth", label: "Bar width", kind: "slider", min: 1, max: 8, step: 1, unit: "px", default: 3, group: "Bars" },
    { prop: "gap", label: "Gap", kind: "slider", min: 0, max: 6, step: 1, unit: "px", default: 2, group: "Bars" },
    { prop: "radius", label: "Radius", kind: "slider", min: 0, max: 4, step: 0.5, unit: "px", group: "Bars" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "ghost", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false, group: "Surface" },
  ],
};
