# Feature179: Sticky Stats Scroller

A two-column layout: a sticky left column carries the section header and a 2-up grid of headline stats, while a right column of bordered feature cards scrolls past it, separated by a single vertical divider.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature179"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature179"
```

This installs the block to `components/beste/block/feature179.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `feature179Demo` alongside the block: the exact props behind the preview above. Spread it to get a working sticky stats layout in one line.

```tsx
import { Feature179, feature179Demo } from "@/components/beste/block/feature179";

export default function Page() {
  return <Feature179 {...feature179Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Zap, Shield, BarChart3 } from "lucide-react";
import { Feature179 } from "@/components/beste/block/feature179";

export default function Page() {
  return (
    <Feature179
      badge={{ label: "Platform", variant: "secondary" }}
      heading="One platform to <strong>replace them all</strong>"
      description="Consolidate your entire workflow into a single platform."
      stats={[
        { value: "99.99%", label: "Uptime SLA" },
        { value: "50ms", label: "Avg Response" },
        { value: "10M+", label: "API Requests/Day" },
        { value: "4.9/5", label: "Customer Rating" },
      ]}
      features={[
        { icon: Zap, title: "Instant Performance Boost", description: "Sub-100ms response times." },
        { icon: Shield, title: "Enterprise-Grade Security", description: "SOC 2 Type II certified." },
        { icon: BarChart3, title: "Actionable Analytics", description: "Custom dashboards and cohort analysis." },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional eyebrow badge in the sticky column |
| `heading` | `string` | – | Sticky column heading. Supports inline `<strong>` markup, rendered via `dangerouslySetInnerHTML` |
| `description` | `string` | – | Sticky column intro text |
| `stats` | `StatItem[]` | `[]` | Headline value/label pairs shown in a 2-up grid |
| `features` | `FeatureItem[]` | `[]` | Bordered icon, title, and description cards in the scrolling right column |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type StatItem = { value: string; label: string };

type FeatureItem = { icon: LucideIcon; title: string; description: string };
```

## Behavior notes

- On `md` and up, the left column becomes `sticky` at `top-[100px]`, staying pinned while the right column's feature cards scroll past; below `md` the columns stack and stickiness is disabled entirely.
- `stats` always render in a fixed `grid-cols-2` grid, regardless of how many stat entries are passed; there is no dynamic column recalculation like in some other Feature blocks.
- Unlike Feature178's plain rows, each entry in `features` is wrapped in its own `rounded-md border bg-card p-6` card, so the right column reads as a stack of discrete panels rather than a continuous list.
- The vertical divider between columns (`hidden w-px bg-border md:block`) always renders once the two-column layout is active, independent of content.
