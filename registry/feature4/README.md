# Feature4: Two-By-Two With Icon Tiles

Centered headline and description above a fixed two-column grid of icon-led feature tiles, closed by a row of CTA buttons. There is no badge prop, so the header is copy-only.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature4"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature4"
```

This installs the block to `components/beste/block/feature4.tsx` and the shadcn/ui `button` component it depends on.

## Quick start

The installed file exports `feature4Demo` alongside the block: the exact props behind the preview above. Spread it to get a working two-by-two feature grid in one line.

```tsx
import { Feature4, feature4Demo } from "@/components/beste/block/feature4";

export default function Page() {
  return <Feature4 {...feature4Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { BarChart3, Rocket, Target, Users } from "lucide-react";
import { Feature4 } from "@/components/beste/block/feature4";

export default function Page() {
  return (
    <Feature4
      heading="Why teams pick our agency"
      description="We combine data-driven strategy with creative execution."
      features={[
        { icon: BarChart3, title: "Data-driven strategies", description: "Every campaign is backed by analytics." },
        { icon: Users, title: "Expert team and support", description: "A dedicated lead for every account." },
        { icon: Rocket, title: "Multi-channel approach", description: "One integrated plan across channels." },
        { icon: Target, title: "Results-focused campaigns", description: "Measured against revenue impact." },
      ]}
      buttons={[{ label: "Get started today", href: "/contact" }]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Section heading; there is no `badge` prop on this block |
| `description` | `string` | – | Section intro text |
| `features` | `FeatureItem[]` | `[]` | Icon-led tiles in the 2x2 grid |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureItem = {
  icon?: LucideIcon;
  title: string;
  description: string;
};

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- There is no `badge` prop at all on this block, so the header is limited to `heading` and `description`, unlike most other feature blocks in this set.
- The grid is a fixed `md:grid-cols-2` regardless of item count, but with an unusually wide horizontal gap (`md:gap-x-32`) that visually separates the two columns instead of reading as a tight grid.
- Icons are rendered at `size-8` with `mb-6` spacing, noticeably larger and more spaced than `feature3`/`feature5`'s `size-6` icons, giving each tile a bigger visual anchor.
- `features` and `buttons` are gated independently by their own `.length > 0` checks, so either can be supplied without the other.
