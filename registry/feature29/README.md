# Feature29: Platform Feature Cards with Metrics

Feature grid where each card pairs an icon, title, and description with an optional stat row (a bold value like "3x" or "99.99%" next to its label) pinned to the bottom of the card with a top border, so metrics read as a footer rather than body copy.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature29"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature29"
```

This installs the block to `components/beste/block/feature29.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `feature29Demo` alongside the block: the exact props behind the preview above. Spread it to get a working metrics grid in one line.

```tsx
import { Feature29, feature29Demo } from "@/components/beste/block/feature29";

export default function Page() {
  return <Feature29 {...feature29Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Sparkles, Globe, Lock } from "lucide-react";
import { Feature29 } from "@/components/beste/block/feature29";

export default function Page() {
  return (
    <Feature29
      badge={{ label: "Platform", variant: "secondary" }}
      heading="Everything you need to scale"
      description="A complete toolkit designed to grow with your business."
      features={[
        {
          id: "feature-1",
          icon: <Sparkles className="size-6" />,
          title: "AI-Powered Insights",
          description: "Get actionable recommendations based on your data.",
          stat: { value: "3x", label: "faster decisions" },
        },
        {
          id: "feature-2",
          icon: <Globe className="size-6" />,
          title: "Global CDN",
          description: "Content delivered from edge locations worldwide.",
          stat: { value: "<50ms", label: "avg. latency" },
        },
        {
          id: "feature-3",
          icon: <Lock className="size-6" />,
          title: "Enterprise Security",
          description: "SOC 2 Type II certified with end-to-end encryption.",
        },
      ]}
      buttons={[{ id: "btn-1", label: "Explore all features", href: "/features" }]}
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
| `features` | `FeatureCard[]` | `[]` | Cards rendered in the grid; the section renders nothing when this is empty |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureCard = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  stat?: { value: string; label: string };
};

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- The component returns `null` when `features` is empty, so it never renders a bare header with an empty grid.
- The stat row is conditional per card: cards without a `stat` simply have no footer and no top border, so mixing stat and non-stat cards in the same `features` array produces cards of visibly different heights within a row.
- Each card uses a named hover group (`group/feature29`); hovering inverts the icon square from `bg-primary/10 text-primary` to a solid `bg-primary text-primary-foreground` fill, independent of any other card.
- Cards also gain a `hover:border-primary/50` border tint and `hover:shadow-lg` on hover, layered on top of the icon color transition, all over a 300ms transition.
- The icon wrapper renders even when `feature.icon` is omitted (unlike feature26/feature107, there is no fallback icon), leaving an empty tinted square in that case.
