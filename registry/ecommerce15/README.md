# Ecommerce15: Shipping Info Cards

Row of icon cards summarizing shipping, delivery, tracking, and returns policy, meant for product pages or checkout, built entirely with hand-rolled cards and Lucide icons with no shadcn/ui dependency at all.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/ecommerce15"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/ecommerce15"
```

This installs the block file and its dependencies.

## Quick start

The installed file exports `ecommerce15Demo` alongside the block: the exact props behind the preview above. Spread it to get a working info-cards row in one line.

```tsx
import { Ecommerce15, ecommerce15Demo } from "@/components/beste/block/ecommerce15";

export default function ProductPage() {
  return <Ecommerce15 {...ecommerce15Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Ecommerce15 } from "@/components/beste/block/ecommerce15";

export default function ProductPage() {
  return (
    <Ecommerce15
      heading="Shipping & Returns"
      options={[
        { icon: "truck", title: "Free Shipping", description: "On all orders over $50" },
        { icon: "shield", title: "Easy Returns", description: "30-day return policy" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Section heading above the card row |
| `options` | `ShippingOption[]` | `[]` | Icon cards rendered in the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ShippingOption = {
  icon?: "truck" | "clock" | "location" | "shield";
  title: string;
  description: string;
};
```

## Behavior notes

- `icon` selects from a fixed four-entry map (`truck` → Truck, `clock` → Clock, `location` → MapPin, `shield` → Shield); omitting `icon` on an option still renders the Truck icon as a fallback rather than no icon at all.
- The grid is a static `sm:grid-cols-2 lg:grid-cols-4`, not the dynamic column-count logic used elsewhere in the Ecommerce category, so a 3-item `options` array leaves an empty fourth slot on large screens instead of re-flowing to 3 columns.
- No shadcn/ui primitives are used: each card is a hand-rolled `rounded-lg border bg-card p-6` box, which is why this block declares no `registryDependencies`.
- The block is purely presentational: there's no callback prop of any kind, so nothing here is clickable beyond the page's own default cursor behavior.
