# Feature144: Service Offerings with Arrows

A responsive grid of clickable service cards: each card is a full-bleed link pairing a title and description on the left with an arrow icon that slides right on hover, capped with an optional CTA row.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature144"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature144"
```

This installs the block to `components/beste/block/feature144.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `feature144Demo` alongside the block: the exact props behind the preview above. Spread it to get a working service list in one line.

```tsx
import { Feature144, feature144Demo } from "@/components/beste/block/feature144";

export default function Page() {
  return <Feature144 {...feature144Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Feature144 } from "@/components/beste/block/feature144";

export default function Page() {
  return (
    <Feature144
      badge={{ label: "Services", variant: "secondary" }}
      heading="What we offer"
      description="Comprehensive solutions for your business."
      services={[
        { title: "Consulting", description: "Strategic guidance from industry experts.", href: "https://beste.co" },
        { title: "Development", description: "Custom software built for your needs.", href: "https://beste.co" },
        { title: "Design", description: "Beautiful interfaces that users love.", href: "https://beste.co" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional eyebrow badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `services` | `ServiceItem[]` | `[]` | Service cards rendered in the grid |
| `buttons` | `ButtonItem[]` | `[]` | Optional CTA row below the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ServiceItem = { title: string; description?: string; href?: string };

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- The component returns `null` when `services` is empty, so this block renders nothing at all without at least one service, unlike most Feature blocks which still show the header on an empty item array.
- Column count is computed from `services.length` with the standard dynamic-grid formula: exactly 1 service stays single-column, 2 gets `sm:grid-cols-2`, a count divisible by 3 gets `grid-cols-1 md:grid-cols-3`, a count divisible by 4 gets `sm:grid-cols-2 lg:grid-cols-4`, and anything else falls back to `sm:grid-cols-2 lg:grid-cols-3`. The demo's 4 services resolve to the 4-column formula.
- The entire card is a `next/link`, not just the title: hovering anywhere on the card tints the title `text-primary` and translates the arrow icon `group-hover:translate-x-1`.
- `href` on a service or button falls back to `"#"` when omitted.
