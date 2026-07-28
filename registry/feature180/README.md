# Feature180: Sticky Image Scroller

A two-column layout: a sticky left column carries the section header and a single supporting image, while a right column of bordered feature cards scrolls past it, separated by a vertical divider.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature180"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature180"
```

This installs the block to `components/beste/block/feature180.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `feature180Demo` alongside the block: the exact props behind the preview above. Spread it to get a working sticky image layout in one line.

```tsx
import { Feature180, feature180Demo } from "@/components/beste/block/feature180";

export default function Page() {
  return <Feature180 {...feature180Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Zap, Shield, BarChart3 } from "lucide-react";
import { Feature180 } from "@/components/beste/block/feature180";

export default function Page() {
  return (
    <Feature180
      badge={{ label: "How it works", variant: "secondary" }}
      heading="From idea to launch in <strong>record time</strong>"
      description="Our end-to-end platform handles the heavy lifting."
      image={{ src: "https://images.unsplash.com/photo-1697133081695-90070de25bc3?w=800&h=900&fit=crop", alt: "Platform dashboard" }}
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
| `image` | `{ src: string; alt: string }` | – | Supporting image shown below the description in the sticky column |
| `features` | `FeatureItem[]` | `[]` | Bordered icon, title, and description cards in the scrolling right column |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureItem = { icon: LucideIcon; title: string; description: string };
```

## Behavior notes

- On `md` and up, the left column becomes `sticky` at `top-[100px]`, staying pinned while the right column's feature cards scroll past; below `md` the columns stack and stickiness is disabled.
- `image` is a single slot, not a gallery: it renders in a fixed `aspect-[4/3] rounded-md` box with `object-cover`, and if omitted the sticky column simply ends after the description with no placeholder.
- Each entry in `features` is wrapped in its own `rounded-md border bg-card p-6` card, matching Feature179's bordered-card treatment rather than Feature178's plain rows.
- The vertical divider between columns (`hidden w-px bg-border md:block`) always renders once the two-column layout is active, independent of content.
