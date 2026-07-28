# Feature177: Bento Feature Cards

Feature cards arranged in a 3-then-2 bento layout: three cards fill a top row and two shorter cards fill the row below, each card pairing a text block with an edge-to-edge image flush against the bottom of the card.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature177"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature177"
```

This installs the block to `components/beste/block/feature177.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `feature177Demo` alongside the block: the exact props behind the preview above. Spread it to get a working bento grid in one line.

```tsx
import { Feature177, feature177Demo } from "@/components/beste/block/feature177";

export default function Page() {
  return <Feature177 {...feature177Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Feature177 } from "@/components/beste/block/feature177";

export default function Page() {
  return (
    <Feature177
      badge={{ label: "Features", variant: "secondary" }}
      heading="Everything you need to <strong>build faster</strong>"
      description="All the tools you need to ship products quickly."
      items={[
        {
          title: "Analytics Dashboard",
          description: "Track your metrics in real time.",
          image: { src: "https://images.unsplash.com/photo-1697133081695-90070de25bc3?w=800&h=500&fit=crop", alt: "Analytics dashboard" },
        },
        {
          title: "Team Collaboration",
          description: "Work together with built-in tools.",
          image: { src: "https://images.unsplash.com/photo-1574281160075-6eb5f7bfe645?w=800&h=500&fit=crop", alt: "Team collaboration" },
        },
        {
          title: "Automated Workflows",
          description: "Automate the repetitive tasks.",
          image: { src: "https://images.unsplash.com/photo-1592838981793-f3ebf267056d?w=800&h=500&fit=crop", alt: "Automated workflows" },
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional eyebrow badge above the heading |
| `heading` | `string` | – | Section heading. Supports inline `<strong>` markup, rendered via `dangerouslySetInnerHTML` |
| `description` | `string` | – | Section intro text |
| `items` | `FeatureCardItem[]` | `[]` | Bento cards; only the first 5 are rendered |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureCardItem = {
  title: string;
  description?: string;
  image?: { src: string; alt: string };
};
```

## Behavior notes

- The 3-then-2 layout is hardcoded from `items`, not driven by a separate prop: `items.slice(0, 3)` renders in a `md:grid-cols-3` top row and `items.slice(3, 5)` renders in a `md:grid-cols-2` bottom row. A 6th item and beyond is silently dropped; fewer than 4 items just means the bottom row block never renders (it's conditional on `bottomItems.length > 0`).
- `heading` accepts inline `<strong>` HTML for partial highlighting (the demo highlights "build faster"), styled `[&>strong]:text-primary [&>strong]:font-semibold`.
- Each card's `image` is optional; when present it sits flush at the bottom of the card (`aspect-[16/10]`, absolutely positioned, `object-cover`) with no padding, while the text block above it keeps `p-6`.
- There is no `buttons`/CTA prop on this block: it stops at the badge/heading/description header and the card grid.
