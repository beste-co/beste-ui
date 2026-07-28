# Feature194: Three Cards With Asset Media

Three feature cards where the usual icon slot is swapped for a real, live micro-asset: a bar chart, a before/after stat pair, and a terminal command line, each optionally sitting on its own dotted-grid, image, or video backdrop. This is the reference implementation of the Media Slot Standard: registry-piece components dropped straight into a block's card media.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature194"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature194"
```

This installs the block to `components/beste/block/feature194.tsx`, the `chart1`, `stats5`, and `terminal1` registry pieces used as media-slot fillers (a bar chart card, a before/after stat pair, and a terminal prompt line, respectively), and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `feature194Demo` alongside the block: the exact props behind the preview above. Spread it to get a working three-card layout in one line.

```tsx
import { Feature194, feature194Demo } from "@/components/beste/block/feature194";

export default function Page() {
  return <Feature194 {...feature194Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup mixing an `image` card with a `component` card looks like this:

```tsx
import { Chart1 } from "@/components/beste/piece/chart1";
import { Feature194 } from "@/components/beste/block/feature194";

export default function Page() {
  return (
    <Feature194
      badge={{ label: "Built for builders", variant: "secondary" }}
      heading="Ship faster, measure everything"
      description="A toolkit that meets your team where it works."
      cards={[
        {
          eyebrow: "Analytics",
          title: "Insights you trust",
          description: "Live dashboards with the metrics that matter.",
          media: {
            type: "component",
            component: <Chart1 label="Sessions" value="8,214" data={[42, 68, 54, 81]} tone="primary" />,
          },
        },
        {
          eyebrow: "Design",
          title: "Crafted for builders",
          description: "A workspace built around how developers actually work.",
          media: {
            type: "image",
            src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=900&fit=crop",
            alt: "Developer workspace with code on screen",
          },
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
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `cards` | `FeatureCard[]` | `[]` | The three (or more) cards, each with its own eyebrow, title, description, and media slot |
| `buttons` | `ButtonItem[]` | `[]` | Optional CTA row below the card grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureCard = {
  eyebrow: string;
  title: string;
  description: string;
  media: CardMedia;
};

type CardMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string }
  | {
      type: "component";
      component: React.ReactNode;
      background?: ComponentBackground;
    };

type ComponentBackground =
  | { type: "dots" }
  | { type: "none" }
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- Every card's media sits in a fixed `aspect-[4/3]` surface with a bottom border, regardless of which `CardMedia` variant is used, so `image`, `video`, and `component` cards stay visually aligned in the same 3-column grid.
- The `image` and `video` variants always fill the surface edge to edge (`absolute inset-0 object-cover`) and ignore `background` entirely; `background` only applies to the `component` variant.
- A `component` card with no `background` set defaults to the dotted-grid backdrop (`{ type: "dots" }`), which is drawn with a `radial-gradient` sized `16px 16px`, not an image. The demo's first two cards (`Chart1`, `Stats5`) rely on this default; only the third card (`Terminal1`) overrides it with `{ type: "image", ... }`.
- The live asset component always renders inside a `relative` wrapper so it visually stacks above any image/video background placed behind it.
- The three registry pieces are imported through their install-target path (`@/components/beste/piece/{name}`), which is what makes the same import resolve both in this dev workspace and after a consumer runs `shadcn add`.
