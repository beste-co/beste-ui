# Travel21: Custom Trip Builder CTA

A split-layout promo card for a "build your own trip" offering: an icon badge, heading, description, and a two-column feature checklist with CTA buttons on one side, and a large photo filling the other. The image side can swap to the left.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/travel21"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/travel21"
```

This installs the block to `components/beste/block/travel21.tsx` and the `button` and `card` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `travel21Demo` alongside the block: the exact props behind the preview above. Spread it to get a working trip-builder CTA in one line.

```tsx
import { Travel21, travel21Demo } from "@/components/beste/block/travel21";

export default function TripBuilderPage() {
  return <Travel21 {...travel21Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Compass } from "lucide-react";
import { Travel21 } from "@/components/beste/block/travel21";

export default function TripBuilderPage() {
  return (
    <Travel21
      icon={Compass}
      heading="Build Your Dream Trip"
      description="Create a personalized itinerary tailored to your preferences and budget."
      features={["Choose your destinations", "Set your own pace", "Pick your accommodations"]}
      image={{
        src: "https://images.unsplash.com/photo-1711995624805-890dd169192c?w=800&h=600&fit=crop",
        alt: "Custom tour builder",
      }}
      buttons={[{ label: "Start Building", href: "https://beste.co" }]}
      displayPosition="left"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `LucideIcon` | – | Icon shown in a circular badge above the heading |
| `heading` | `string` | – | Card heading |
| `description` | `string` | – | Card body text |
| `features` | `string[]` | `[]` | Bullet checklist rendered in a two-column list |
| `image` | `{ src: string; alt: string }` | – | Photo filling the other half of the card; omitted entirely when not set |
| `buttons` | `ButtonItem[]` | `[]` | CTAs rendered below the feature list |
| `displayPosition` | `"left" \| "right"` | `"right"` | Which side the image sits on at the `lg` breakpoint |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- `displayPosition` flips the image to the left by applying `lg:[&>*:first-child]:order-2` to the grid rather than reordering the JSX, so it only takes effect at the `lg` breakpoint; below `lg`, content always stacks in source order (text block, then image).
- The feature checklist renders as a `sm:grid-cols-2` grid of small primary-colored dot bullets and is skipped entirely when `features` is empty.
- The icon badge is entirely optional; when `icon` is omitted, the heading starts the content column with no leading spacer for the missing badge.
- The image column fills a square aspect ratio on mobile (`aspect-square`) and stretches to match the row's natural height at `lg:` (`lg:aspect-auto`); the whole column is skipped when `image` is not provided, leaving the text column as the only content.
- The outer `rounded-md border bg-card` wrapper is the single visual container for both halves, so the split appears as one unified card rather than two separate boxes.
