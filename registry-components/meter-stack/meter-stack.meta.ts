import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "meter-stack",
  title: "Meter Stack",
  description:
    "A stacked usage bar for storage, quotas and budgets: each part a colored segment with a small gap in a bar with rounded ends, growing in from empty on mount while the total above it counts up in step, and easing to new values later. Hover a segment or its legend entry to single it out with a tooltip of its label, value and share while the rest dim. The legend lists every part and the free space, values are written by your own formatter (a locale-aware formatBytes ships with it), and the total turns amber and red as the bar nears full. It is a real meter with its reading spelled out for screen readers. Theme chart colors by default, three track tones and three sizes.",
  category: "Meter",
  cardScale: 0.6,
  usage: `import { MeterStack, formatBytes } from "@/components/beste/component/meter-stack";

<MeterStack
  label="Studio drive"
  segments={[
    { label: "Stems", value: 18.6e9 },
    { label: "Mixes", value: 9.2e9 },
    { label: "Video", value: 7.1e9, color: "#8b5cf6" }, // any CSS color
  ]}
  max={50e9}
  formatValue={(value) => formatBytes(value)}
/>

// A monthly budget: plain numbers, earlier warning, no free entry
<MeterStack
  label="Tour budget"
  segments={[{ label: "Travel", value: 12400 }, { label: "Crew", value: 8600 }]}
  max={25000}
  formatValue={(value) => \`$\${Math.round(value).toLocaleString("en-US")}\`}
  warningAt={0.7}           // amber from 70%
  freeLabel={null}          // leave the unused part out of the legend
  size="lg"                 // "sm" | "default" | "lg"
/>`,
};
