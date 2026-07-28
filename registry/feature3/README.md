# Feature3: Service Grid With Icons

Centered header above a three-column grid of capability cards, each leading with a Lucide icon over a title and description, closed off by a single centered CTA button with an optional line of supporting text underneath.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature3"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature3"
```

This installs the block to `components/beste/block/feature3.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `feature3Demo` alongside the block: the exact props behind the preview above. Spread it to get a working service grid in one line.

```tsx
import { Feature3, feature3Demo } from "@/components/beste/block/feature3";

export default function Page() {
  return <Feature3 {...feature3Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Globe, Shield, Zap } from "lucide-react";
import { Feature3 } from "@/components/beste/block/feature3";

export default function Page() {
  return (
    <Feature3
      badge={{ label: "Services", variant: "default" }}
      heading="All-in-one web solutions"
      description="A complete suite of tools to build, grow, and optimize your site."
      features={[
        { icon: Zap, title: "Blazing fast websites", description: "Optimized for speed and UX." },
        { icon: Shield, title: "Robust security", description: "Encryption on every touchpoint." },
        { icon: Globe, title: "Global scalability", description: "Cloud infrastructure worldwide." },
      ]}
      button={{ label: "Launch your site", href: "/contact" }}
      bottomText="No upfront costs. Start your free consultation today."
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
| `features` | `FeatureItem[]` | `[]` | Capability cards in the grid |
| `button` | `ButtonItem` | – | A single centered CTA button below the grid; unlike most feature blocks this is one object, not a `buttons` array |
| `bottomText` | `string` | – | Line of supporting text under the button |
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

- `button` is a single optional object rather than an array, so this block renders at most one CTA, unlike `feature2`/`feature4`/`feature8`, which all accept a `buttons` array.
- `button` and `bottomText` share one wrapper gated by `(button || bottomText)`, stacked and centered; either can be supplied independently, so `bottomText` alone renders without a button.
- Each card's icon is rendered only when `feature.icon` is set (`{Icon && <Icon .../>}`), with no fallback icon, unlike `education99`'s grid which defaults to `Building`.
- The grid is a fixed `sm:grid-cols-2 lg:grid-cols-3`; there is no item-count-based dynamic column logic.
- Cards use a `bg-muted/30` tinted surface rather than the plain bordered `bg-card` treatment other feature grids in this set use.
