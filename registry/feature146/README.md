# Feature146: Benefits Checklist

A checklist-style grid of benefit items, each pairing a circular checkmark badge with a title and description, centered in a narrow column and capped with an optional CTA row.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature146"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature146"
```

This installs the block to `components/beste/block/feature146.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `feature146Demo` alongside the block: the exact props behind the preview above. Spread it to get a working benefits list in one line.

```tsx
import { Feature146, feature146Demo } from "@/components/beste/block/feature146";

export default function Page() {
  return <Feature146 {...feature146Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Feature146 } from "@/components/beste/block/feature146";

export default function Page() {
  return (
    <Feature146
      badge={{ label: "Benefits", variant: "secondary" }}
      heading="Why choose us"
      description="Key advantages of working with our platform."
      benefits={[
        { title: "Save time", description: "Automate repetitive tasks and focus on what matters." },
        { title: "Reduce costs", description: "Cut operational expenses significantly." },
        { title: "Scale easily", description: "Grow without worrying about infrastructure." },
      ]}
      buttons={[{ label: "See all benefits", href: "https://beste.co" }]}
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
| `benefits` | `BenefitItem[]` | `[]` | Benefit rows rendered in the grid |
| `buttons` | `ButtonItem[]` | `[]` | Optional CTA row below the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type BenefitItem = { title: string; description?: string };

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- The component returns `null` when `benefits` is empty, so nothing renders at all without at least one benefit.
- Column count follows the standard dynamic-grid formula on `benefits.length` (1 stays single-column, 2 gets `sm:grid-cols-2`, a multiple of 3 gets `md:grid-cols-3`, a multiple of 4 gets `lg:grid-cols-4`, otherwise `lg:grid-cols-3`), but the resulting grid is additionally wrapped in `mx-auto max-w-3xl`, so even a wide column count stays narrower than the full section width.
- The checkmark icon is fixed: every benefit gets the same `Check` icon in a `text-primary` circle on `bg-primary/10`; only the title and description text vary per item, there is no per-item icon prop.
