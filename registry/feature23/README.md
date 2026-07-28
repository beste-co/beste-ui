# Feature23: Quality Scorecard Grid

Card grid built for status dashboards: each card pairs an icon, a title, and a description with a numeric score and a `Progress` bar, so a reader can scan health metrics like performance, security, or reliability at a glance. A centered header and an optional footer note with action buttons frame the grid.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature23"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature23"
```

This installs the block to `components/beste/block/feature23.tsx` and the shadcn/ui `badge`, `button`, and `progress` components it depends on.

## Quick start

The installed file exports `feature23Demo` alongside the block: the exact props behind the preview above. Spread it to get a working scorecard grid in one line.

```tsx
import { Feature23, feature23Demo } from "@/components/beste/block/feature23";

export default function Page() {
  return <Feature23 {...feature23Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Gauge, Shield, Users } from "lucide-react";
import { Feature23 } from "@/components/beste/block/feature23";

export default function Page() {
  return (
    <Feature23
      badge={{ label: "Quality", variant: "secondary" }}
      heading="Make quality visible"
      description="A lightweight scoreboard that turns 'it feels better' into measurable signals."
      areas={[
        {
          id: "area-1",
          icon: <Gauge className="size-5" />,
          title: "Performance",
          description: "Track Core Web Vitals and spot regressions early.",
          score: 92,
          footnote: "Based on last 7 days",
        },
        {
          id: "area-2",
          icon: <Shield className="size-5" />,
          title: "Security posture",
          description: "Surface dependency risk and access anomalies.",
          score: 88,
        },
        {
          id: "area-3",
          icon: <Users className="size-5" />,
          title: "UX clarity",
          description: "Validate copy and accessibility without slowing releases.",
          score: 90,
        },
      ]}
      footerNote="Tip: keep scores directional, use them to spot trends."
      buttons={[{ id: "btn-1", label: "See dashboard sample", href: "/dashboard", variant: "outline" }]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `areas` | `Area[]` | `[]` | Scorecards rendered in the grid; the section renders nothing when this is empty |
| `footerNote` | `string` | – | Small caption shown above the footer buttons |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons in the footer row |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Area = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  score: number;
  footnote?: string;
};

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- The component returns `null` when `areas` is empty, so an empty scorecard list renders nothing rather than an empty header.
- Every `score` passes through `clampScore`, which coerces non-numeric values with `Number()`, falls back to `0` on `NaN`, and clamps the result to the 0-100 range before it reaches the `Progress` bar and the numeric label, so out-of-range or malformed input can never overflow the bar.
- Cards use `hover:-translate-y-0.5` for a subtle lift on hover; there is no click behavior on the card itself.
- The grid is fixed at `md:grid-cols-2 lg:grid-cols-3` regardless of how many `areas` are supplied, so five or seven items will leave a ragged last row rather than reflowing to a different column count.
- Each card's icon sits inside a bordered `bg-background` square that only renders when `area.icon` is provided; omitting it collapses the layout to title and description alone.
