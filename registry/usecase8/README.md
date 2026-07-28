# UseCase8: Vertical Timeline

Centered vertical timeline with a connecting line and dot markers; each stage's content card alternates sides of the line, mirroring its icon, heading, description, and feature list along with it.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/usecase8"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/usecase8"
```

This installs the block to `components/beste/block/usecase8.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `usecase8Demo` alongside the block: the exact props behind the preview above. Spread it to get a working section in one line.

```tsx
import { UseCase8, usecase8Demo } from "@/components/beste/block/usecase8";

export default function Page() {
  return <UseCase8 {...usecase8Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Rocket, Search } from "lucide-react";
import { UseCase8 } from "@/components/beste/block/usecase8";

export default function Page() {
  return (
    <UseCase8
      badge={{ label: "Journey", variant: "secondary" }}
      heading="Your Path to Success"
      description="Follow this proven journey to transform your business."
      items={[
        {
          id: "discovery",
          icon: <Search className="size-5" />,
          title: "Discovery & Planning",
          description: "We understand your challenges and create a roadmap.",
          image: { src: "https://images.unsplash.com/photo-1552664730-d307ca884978", alt: "Discovery" },
          features: [{ id: "d1", text: "Requirements analysis" }],
        },
        {
          id: "launch",
          icon: <Rocket className="size-5" />,
          title: "Launch & Optimize",
          description: "We deploy and continuously monitor performance.",
          image: { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4", alt: "Launch" },
          features: [{ id: "l1", text: "Global deployment" }],
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Pill shown above the heading; omitted when `badge.label` is falsy |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `items` | `UseCaseItem[]` | – | Ordered timeline stages |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type UseCaseItem = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  features?: UseCaseFeature[];
};

type UseCaseFeature = { id: string; text: string };
```

## Behavior notes

- The vertical connecting line and the per-item dot markers are both `hidden md:block`; below `md` the timeline collapses to a plain stacked list with no line or dots, and every item's content stacks above its image.
- Sides alternate purely by index parity: even-indexed items right-align their text column (`md:text-right`, icon row reversed with `md:flex-row-reverse`) and place the image on the visual right; odd-indexed items mirror this with `md:order-2` on the text column.
- Feature bullets also flip their internal row direction (`md:flex-row-reverse`) and right-align (`md:items-end`) on even (right-aligned) items, so the checkmark sits after the text rather than before it.
- The dot marker uses `border-4 border-primary` on a `bg-background` fill, positioned with `absolute left-1/2 -translate-x-1/2` so it always centers on the line regardless of which side the content card is on. Stage numbering is implicit; there is no numbered badge like usecase3.
- The icon swatch carries `group-hover/usecase8:*` classes, but no ancestor element in the item declares a `group/usecase8` class, so the icon never actually inverts color on hover; it stays `bg-primary/10 text-primary` at all times.
