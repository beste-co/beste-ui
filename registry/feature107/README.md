# Feature107: Icon-Centered Grid Cards

Simple centered feature grid: each card stacks a large icon above a title and a short description, all center-aligned inside a bordered card, with no hover-driven color transitions or stat rows.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature107"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature107"
```

This installs the block to `components/beste/block/feature107.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `feature107Demo` alongside the block: the exact props behind the preview above. Spread it to get a working feature grid in one line.

```tsx
import { Feature107, feature107Demo } from "@/components/beste/block/feature107";

export default function Page() {
  return <Feature107 {...feature107Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Cloud, Lock, Users } from "lucide-react";
import { Feature107 } from "@/components/beste/block/feature107";

export default function Page() {
  return (
    <Feature107
      badge={{ label: "Platform", variant: "default" }}
      heading="Everything you need"
      description="A complete toolkit for modern teams."
      items={[
        { icon: <Cloud className="size-8" />, title: "Cloud Native", description: "Built for the cloud with automatic scaling." },
        { icon: <Lock className="size-8" />, title: "Enterprise Security", description: "Bank-level encryption and compliance." },
        { icon: <Users className="size-8" />, title: "Team Collaboration", description: "Real-time editing and shared workspaces." },
      ]}
      buttons={[{ label: "Explore Features", href: "/features" }]}
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
| `items` | `FeatureItem[]` | `[]` | Cards rendered in the grid |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureItem = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
};

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- Unlike feature26 and feature29, cards here have no hover transition classes at all (no shadow lift, no icon color inversion, no `group`), so the grid is fully static.
- The icon wrapper (`text-primary`, no background square) only renders when `item.icon` is present, and there is no fallback icon, so an item without one shows just the title and description, vertically re-centered.
- The grid is a fixed `md:grid-cols-2 lg:grid-cols-3`, independent of `items.length`, so it does not shift column count dynamically the way feature126 does.
- `title` is required by the `FeatureItem` type while `description` is optional, so a card can be icon-plus-title only; the description paragraph simply does not render when omitted.
- Items are keyed by array `index`; `FeatureItem` carries no `id` field.
