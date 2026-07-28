# Feature26: Feature Card Grid with Hover Effects

Six-card feature grid where each card's icon sits in a rounded square that inverts from a tinted background to a solid `primary` fill on hover, alongside a title and description. A centered badge, heading, and description sit above the grid.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature26"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature26"
```

This installs the block to `components/beste/block/feature26.tsx` and the shadcn/ui `badge` component it depends on.

## Quick start

The installed file exports `feature26Demo` alongside the block: the exact props behind the preview above. Spread it to get a working feature grid in one line.

```tsx
import { Feature26, feature26Demo } from "@/components/beste/block/feature26";

export default function Page() {
  return <Feature26 {...feature26Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Leaf, Shield, Heart } from "lucide-react";
import { Feature26 } from "@/components/beste/block/feature26";

export default function Page() {
  return (
    <Feature26
      badge={{ label: "Features", variant: "default" }}
      heading="Why Wellory?"
      description="A lifestyle plan that is actionable, sustainable, and unique to you."
      features={[
        {
          id: "feature-1",
          icon: <Leaf className="size-6" />,
          title: "Holistic Nutrition",
          description: "Smart meal plans that optimize your energy levels.",
        },
        {
          id: "feature-2",
          icon: <Shield className="size-6" />,
          title: "Data Privacy",
          description: "End-to-end encryption keeps your data in your control.",
        },
        {
          id: "feature-3",
          icon: <Heart className="size-6" />,
          title: "Cardio Analysis",
          description: "Manage stress levels with HRV analysis.",
        },
      ]}
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
| `features` | `Feature[]` | `[]` | Cards rendered in the grid; the grid wrapper itself is omitted when empty |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Feature = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
};
```

## Behavior notes

- Each card carries its own named hover group (`group/feature26`), so the icon's background/text inversion (`bg-primary/10 text-primary` to `bg-primary text-background`) is scoped to that card and does not leak to sibling cards.
- A card with no `icon` falls back to a `Check` icon rather than an empty square, so the icon slot is never blank.
- Hovering a card lifts it (`hover:-translate-y-1`) and expands its shadow (`hover:shadow-xl`) over a 300ms transition, in addition to the icon color inversion.
- The description paragraph uses `text-balance` on the intro copy so multi-line headers/descriptions wrap more evenly, but individual card descriptions do not use `text-balance`.
- The grid section itself has `overflow-hidden`, which clips the `-translate-y-1` hover lift's shadow slightly at the section edges on cards in the outer columns.
