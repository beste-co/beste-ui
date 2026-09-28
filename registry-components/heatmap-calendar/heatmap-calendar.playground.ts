/**
 * Playground for `heatmap-calendar`: the range, the scale and the labels around it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Up / Down", does: "The day before or after." },
    { keys: "Left / Right", does: "The same weekday a week earlier or later." },
    { keys: "Page Up / Page Down", does: "Four weeks back or forward." },
    { keys: "Home / End", does: "The first or last day of the week; with Cmd or Ctrl, of the whole range." },
  ],
  controls: [
    { prop: "weeks", label: "Weeks", kind: "stepper", min: 4, max: 53, step: 1, default: 53, group: "Range" },
    { prop: "weekStartsOn", label: "Week starts", kind: "segmented", options: [{ value: "0", label: "Sun" }, { value: "1", label: "Mon" }], group: "Range" },
    { prop: "color", label: "Color", kind: "color", group: "Scale" },
    { prop: "levels", label: "Levels", kind: "stepper", min: 3, max: 9, step: 1, default: 5, group: "Scale" },
    { prop: "showMonthLabels", label: "Months", kind: "switch", default: true, group: "Labels" },
    { prop: "showWeekdayLabels", label: "Weekdays", kind: "switch", default: true, group: "Labels" },
    { prop: "showLegend", label: "Legend", kind: "switch", default: true, group: "Labels" },
    { prop: "showTotal", label: "Total", kind: "switch", default: false, group: "Labels" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
