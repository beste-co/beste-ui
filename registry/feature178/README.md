# Feature178: Sticky Benefits Timeline

A two-column benefits section: a left column with the section header and an optional pill-tag row stays pinned in place on desktop while a right column of icon, title, and description rows scrolls past it, separated by a single vertical divider.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature178"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature178"
```

This installs the block to `components/beste/block/feature178.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `feature178Demo` alongside the block: the exact props behind the preview above. Spread it to get a working sticky timeline in one line.

```tsx
import { Feature178, feature178Demo } from "@/components/beste/block/feature178";

export default function Page() {
  return <Feature178 {...feature178Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Zap, Shield, BarChart3 } from "lucide-react";
import { Feature178 } from "@/components/beste/block/feature178";

export default function Page() {
  return (
    <Feature178
      badge={{ label: "Why choose us", variant: "secondary" }}
      heading="Ship faster, scale smarter, <strong>grow confidently</strong>"
      description="Everything your team needs to go from idea to production."
      tags={[{ label: "No-Code Friendly" }, { label: "SOC 2 Certified" }, { label: "99.99% Uptime" }]}
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
| `tags` | `TagItem[]` | `[]` | Pill labels shown below the description |
| `features` | `FeatureItem[]` | `[]` | Icon, title, and description rows in the scrolling right column |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type TagItem = { label: string };

type FeatureItem = { icon: LucideIcon; title: string; description: string };
```

## Behavior notes

- On `md` and up, the left column becomes `sticky` at `top-[100px]` (`md:sticky md:top-[100px]`), so it stays pinned in the viewport while the right column's feature list scrolls past it; below `md` there is no stickiness and the columns stack top to bottom.
- `tags` render as plain `<span>` pills (`bg-muted`, `rounded-full`), not shadcn `Badge` components, and the row only appears when `tags` is non-empty.
- The vertical divider between columns (`hidden md:block w-px bg-border`) is unconditional above `md`: it always renders once the layout goes two-column, regardless of content.
- Every feature icon sits inside an identically sized `bg-muted` circle; there is no per-feature color or size variation, only the icon, title, and description text change.
