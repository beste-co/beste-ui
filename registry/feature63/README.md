# Feature63: Use Case Image Cards

Grid of full-bleed photo cards, each a fixed 3:2 tile with a dark scrim and title/description overlaid at the bottom; cards with an `href` become links and reveal an arrow icon on hover while the photo zooms slightly underneath.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature63"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature63"
```

This installs the block to `components/beste/block/feature63.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `feature63Demo` alongside the block: the exact props behind the preview above. Spread it to get a working use-case grid in one line.

```tsx
import { Feature63, feature63Demo } from "@/components/beste/block/feature63";

export default function Page() {
  return <Feature63 {...feature63Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Feature63 } from "@/components/beste/block/feature63";

export default function Page() {
  return (
    <Feature63
      badge={{ label: "Solutions", variant: "default" }}
      heading="Built for every team"
      description="Explore how different teams use our platform."
      items={[
        {
          title: "Marketing",
          description: "Track campaigns and measure ROI",
          image: {
            src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
            alt: "Marketing",
          },
          href: "/solutions/marketing",
        },
        {
          title: "Engineering",
          description: "Ship faster with better tools",
          image: {
            src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop",
            alt: "Engineering",
          },
          href: "/solutions/engineering",
        },
      ]}
      buttons={[{ label: "See all use cases", href: "/solutions" }]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; icon?: React.ReactNode; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading; unlike most feature blocks in this set, it accepts an optional leading `icon` |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `items` | `GridItem[]` | `[]` | Photo cards rendered in the grid |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type GridItem = {
  title: string;
  description?: string;
  image: { src: string; alt: string };
  href?: string;
};

type ButtonItem = {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};
```

## Behavior notes

- An item renders as a `Link` when `href` is set and as a plain `<div>` otherwise; the arrow icon (`ArrowUpRight`) only appears at all when `href` is present, and even then stays at `opacity-0` until the card is hovered.
- Hovering a card scales the background photo to `105%` over 500ms via a named hover group (`group/feature63`), while the dark overlay (`bg-black/40`) stays constant; only the image and the arrow icon animate.
- Images use a plain `<img>` tag rather than `next/image`, so no `next.config` `images.remotePatterns` entry is required for the demo Unsplash URLs or any replacement source.
- The grid is `sm:grid-cols-2 lg:grid-cols-3` with no dynamic column-count logic, so it does not adapt its column count to `items.length` the way feature126 does.
- Cards are keyed by array `index`, not `item.title` or a dedicated id field, since `GridItem` has no `id` property.
