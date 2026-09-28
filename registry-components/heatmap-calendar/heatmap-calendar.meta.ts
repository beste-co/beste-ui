import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "heatmap-calendar",
  title: "Heatmap Calendar",
  description:
    "A contribution calendar in the GitHub style: one square per day in week columns, shaded from a single color in five steps whose thresholds follow the data's quantiles or your own. Month and weekday labels, a Less to More legend and an optional total frame the grid; a rolling range of weeks or a whole calendar year, weeks starting on Sunday or Monday, and names and numbers in any locale. Hovering or focusing a day lifts it with a tooltip of its date and value; the grid is one tab stop with arrow keys by day and week, and days can be made selectable. All date maths is in UTC, so a day never shifts with the reader's time zone, and wide ranges scroll sideways, opening on the latest week.",
  category: "Heatmap",
  usage: `import { HeatmapCalendar } from "@/components/beste/component/heatmap-calendar";

// A rolling year that ends on the latest date in the data
<HeatmapCalendar data={[{ date: "2026-09-27", value: 4 }, { date: "2026-09-26", value: 1 }]} />

<HeatmapCalendar
  data={activity}
  year={2026}                     // a whole calendar year instead of a rolling range
  weekStartsOn={1}                // Monday
  locale="de-DE"
  color="#16a34a"                 // any CSS color; lighter steps are mixed from it
  levels={5}                      // shades including the empty one
  thresholds={[1, 3, 6, 10]}      // lowest value of each non-empty level
  unit={["session", "sessions"]}
  showTotal
  onSelectedChange={(date, day) => console.log(date, day.value)}
/>`,
};
