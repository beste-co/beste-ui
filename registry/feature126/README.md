# Feature126: Impact Stats with Large Numbers

Stat grid where each card shows a large bold number (like "500+" or "99.9%") above a label and an optional description. The grid's column count adapts automatically to how many stats are passed in, rather than using a single fixed breakpoint layout.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature126"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature126"
```

This installs the block to `components/beste/block/feature126.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `feature126Demo` alongside the block: the exact props behind the preview above. Spread it to get a working stats grid in one line.

```tsx
import { Feature126, feature126Demo } from "@/components/beste/block/feature126";

export default function Page() {
  return <Feature126 {...feature126Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Feature126 } from "@/components/beste/block/feature126";

export default function Page() {
  return (
    <Feature126
      badge={{ label: "Impact", variant: "default" }}
      heading="Numbers that speak"
      description="Our impact by the numbers."
      stats={[
        { number: "500+", label: "Customers", description: "Trusted by companies worldwide" },
        { number: "99.9%", label: "Uptime", description: "Enterprise-grade reliability" },
        { number: "50M+", label: "Requests/day", description: "Processed daily at scale" },
      ]}
      buttons={[{ label: "See the report", href: "/impact" }]}
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
| `stats` | `StatItem[]` | `[]` | Stat cards; the section renders nothing when this is empty |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type StatItem = {
  number: string;
  label: string;
  description?: string;
};

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- The component returns `null` when `stats` is empty, so no header renders without stats beneath it.
- The grid column count is derived from `stats.length`, not a fixed breakpoint: exactly 1 stat gets no grid classes (single block), 2 gets `sm:grid-cols-2`, a count divisible by 3 gets `grid-cols-1 md:grid-cols-3`, a count divisible by 4 (and not by 3) gets `sm:grid-cols-2 lg:grid-cols-4`, and everything else falls back to `sm:grid-cols-2 lg:grid-cols-3`.
- Because the length check for "divisible by 3" runs before "divisible by 4", a count like 12 resolves to the 3-column branch, not the 4-column one, since `count % 3 === 0` is checked first.
- `number` is a free-form string, not a numeric type, so values like `"<10ms"` or `"99.9%"` render as-is with no formatting, parsing, or count-up animation.
- Cards have no hover state and are not links; `buttons` is the only interactive element in the section.
