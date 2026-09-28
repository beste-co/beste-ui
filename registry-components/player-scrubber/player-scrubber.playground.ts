/**
 * Playground for `player-scrubber`: the timeline's surface and its readouts.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Left / Right", does: "Seek back or forward 5 seconds." },
    { keys: "Shift + Arrow", does: "Seek 1 second, for fine placement." },
    { keys: "Page Up / Page Down", does: "A tenth of the duration." },
    { keys: "Home / End", does: "Jump to the start or the end." },
    { keys: "Space / K", does: "Play or pause, with the play button shown." },
    { keys: "Drag", does: "The playhead follows the pointer exactly and seeks once on release." },
  ],
  controls: [
    { prop: "duration", label: "Duration", kind: "stepper", min: 10, max: 7200, step: 10, unit: "s", default: 242 },
    { prop: "buffered", label: "Buffered", kind: "slider", min: 0, max: 242, step: 1, unit: "s" },
    { prop: "defaultPlaying", label: "Playing", kind: "switch", default: false },
    { prop: "loop", label: "Loop", kind: "switch", default: false },
    { prop: "rate", label: "Rate", kind: "slider", min: 0.25, max: 8, step: 0.25, unit: "x", default: 1 },
    { prop: "showPlay", label: "Play button", kind: "switch", default: false },
    { prop: "showChapter", label: "Chapter line", kind: "switch", default: false },
    { prop: "showTime", label: "Show times", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
