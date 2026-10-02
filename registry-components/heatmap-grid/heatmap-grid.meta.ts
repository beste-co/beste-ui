import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "heatmap-grid",
  title: "Heatmap Grid",
  description:
    "A heatmap by two axes, weekday by hour out of the box: one shaded square per slot on the heatmap family's scale, with thresholds from the data's quantiles or your own. Weekday names and hours come from Intl in any locale, the week starts on Sunday or Monday, hours read in 12 or 24 hour style, and hour labels thin out as the grid narrows. Hovering or focusing a slot lifts it, dims everything outside its row and column into a soft crosshair and shows a tooltip; the grid is one tab stop with arrow keys, the busiest slot is named beside a Less to More legend, and slots can be made selectable. Custom row and column labels turn it into any two-axis grid. Cells share the width and never shrink below their size; a narrow frame scrolls sideways.",
  category: "Heatmap",
  cardScale: 0.6,
  registryComponents: ["heatmap-calendar"],
  usage: `import { HeatmapGrid } from "@/components/beste/component/heatmap-grid";

// data[weekday][hour], with data[0] as Sunday
<HeatmapGrid
  data={sessions}
  weekStartsOn={1}              // 0 Sunday (default) | 1 Monday
  unit={["session", "sessions"]}
  label="Listening sessions by weekday and hour"
/>

// Any two axes
<HeatmapGrid
  data={[[4, 9, 2], [7, 1, 5]]}
  rows={["Paris", "Lisbon"]}
  columns={["Q1", "Q2", "Q3"]}
  color="#10b981"               // any CSS color; defaults to the primary token
  onSelectedChange={(cell, value) => console.log(cell, value)}
  tone="outline"                // "muted" (default) | "outline" | "ghost"
  size="lg"                     // "sm" | "default" | "lg"
/>`,
};
