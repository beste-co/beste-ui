# Health1: Vitals Dashboard

Grid of health metric cards (heart rate, blood oxygen, activity, sleep, and similar vitals) with an icon, a big value plus unit, and an optional trend indicator, closed out by an optional row of CTA buttons.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/health1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/health1"
```

This installs the block to `components/beste/block/health1.tsx` and the shadcn/ui `badge` and `button` primitives it depends on.

## Quick start

The installed file exports `health1Demo` alongside the block: the exact props behind the preview above. Spread it to get a working dashboard in one line.

```tsx
import { Health1, health1Demo } from "@/components/beste/block/health1";

export default function DashboardPage() {
  return <Health1 {...health1Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Activity, Heart, Moon } from "lucide-react";
import { Health1 } from "@/components/beste/block/health1";

export default function DashboardPage() {
  return (
    <Health1
      badge={{ label: "Health Dashboard" }}
      heading="Your daily health overview"
      metrics={[
        { icon: Heart, label: "Heart Rate", value: "68", unit: "bpm", trend: "stable", trendValue: "Normal range", color: "rose" },
        { icon: Activity, label: "Steps", value: "9,120", unit: "steps", trend: "up", trendValue: "91% of goal", color: "emerald" },
        { icon: Moon, label: "Sleep", value: "7.2", unit: "hours", trend: "down", trendValue: "-20min from avg", color: "violet" },
      ]}
      columns={3}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `Badge` | – | Small label above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `metrics` | `HealthMetric[]` | `[]` | Metric cards rendered in the grid |
| `buttons` | `ButtonItem[]` | `[]` | CTA row under the grid |
| `cardStyle` | `"colorful" \| "minimal"` | `"minimal"` | Whether metric icon chips use each metric's `color` or a flat neutral chip |
| `columns` | `3 \| 4 \| "3" \| "4"` | `4` | Grid column count at the `lg` breakpoint |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Badge = { label: string; variant?: "default" | "secondary" | "outline" };

type HealthMetric = {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color: "rose" | "blue" | "emerald" | "violet" | "amber";
};

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};
```

## Behavior notes

- `cardStyle` defaults to `"minimal"`: every metric's icon chip renders in flat `bg-muted`/`text-foreground` regardless of its `color` field. The five-color palette (rose, blue, emerald, violet, amber) only activates when `cardStyle="colorful"` is passed explicitly.
- `columns` accepts `3 | 4 | "3" | "4"` and is coerced with `Number(columns)`; only a resolved value of `3` switches the grid to `lg:grid-cols-3`, every other value (including omission) falls back to 4 columns. Below `lg` the grid is always 2-up.
- Trend arrows are tied to direction, not to the metric's `color`: `"up"` always renders `text-emerald-500`, `"down"` always renders `text-amber-500` (not rose), and `"stable"` renders a flat dash instead of an arrow icon.
- A metric's trend row only appears when both `trend` and `trendValue` are set; either one alone hides the whole row.
