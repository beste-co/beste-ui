# UseCase4: Industry Solutions Grid

Card grid built for vertical/industry pitches: each card leads with a wide image, then an icon-plus-title row, a two-line-clamped description, and feature text rendered as small rounded pill tags rather than a checklist.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/usecase4"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/usecase4"
```

This installs the block to `components/beste/block/usecase4.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `usecase4Demo` alongside the block: the exact props behind the preview above. Spread it to get a working section in one line.

```tsx
import { UseCase4, usecase4Demo } from "@/components/beste/block/usecase4";

export default function Page() {
  return <UseCase4 {...usecase4Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { HeartPulse, Landmark } from "lucide-react";
import { UseCase4 } from "@/components/beste/block/usecase4";

export default function Page() {
  return (
    <UseCase4
      badge={{ label: "Industries", variant: "secondary" }}
      heading="Trusted Across Industries"
      description="See how leading companies use our platform to drive growth."
      columns={4}
      items={[
        {
          id: "healthcare",
          icon: <HeartPulse className="size-5" />,
          title: "Healthcare",
          description: "HIPAA-compliant solutions for patient data and telehealth.",
          image: { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d", alt: "Healthcare" },
          features: [{ id: "h1", text: "HIPAA compliant" }],
        },
        {
          id: "fintech",
          icon: <Landmark className="size-5" />,
          title: "Financial Services",
          description: "Secure banking solutions with real-time fraud detection.",
          image: { src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f", alt: "Finance" },
          features: [{ id: "f1", text: "Bank-grade security" }],
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
| `items` | `UseCaseItem[]` | – | Cards rendered in the grid |
| `columns` | `2 \| 3 \| 4` | `3` | Grid column count at `sm`/`lg` |
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

- `columns` maps to breakpoints via a lookup: `2` → `md:grid-cols-2`, `4` → `sm:grid-cols-2 lg:grid-cols-4`, and the default (`3` or anything unrecognized) → `sm:grid-cols-2 lg:grid-cols-3`.
- The icon swatch inverts on card hover: `bg-primary/10 text-primary` becomes `bg-primary text-background` via `group-hover/usecase4:*`, using the `group/usecase4` named group.
- `item.description` is clamped to two lines with `line-clamp-2`, so long descriptions are truncated rather than growing the card.
- Feature entries render as pill-shaped tags (`rounded-full bg-foreground/5`) with a small `Check` icon, wrapped with `flex-wrap`, rather than a stacked list, distinguishing this block from usecase2's checklist style.
- Cards use a flat `bg-muted/30 ring-1 ring-foreground/5` surface instead of a bordered outline, and have no shadow-on-hover treatment.
