# Feature195: Four Cards With Centered Icon

Four equal-width cards on a plain background, each centering a large circular icon badge above a bold title. Suited to laying out the steps, pillars, or promises of a service offering rather than long-form feature descriptions.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature195"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature195"
```

This installs the block to `components/beste/block/feature195.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `feature195Demo` alongside the block: the exact props behind the preview above. Spread it to get a working four-card layout in one line.

```tsx
import { Feature195, feature195Demo } from "@/components/beste/block/feature195";

export default function Page() {
  return <Feature195 {...feature195Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { FileText, Gem, ClipboardCheck, PointerIcon } from "lucide-react";
import { Feature195 } from "@/components/beste/block/feature195";

export default function Page() {
  return (
    <Feature195
      badge={{ label: "Process", variant: "secondary" }}
      heading="Let us guide you through your transformation"
      features={[
        { icon: FileText, title: "Understanding your requirements" },
        { icon: Gem, title: "Strategy powered by expertise" },
        { icon: ClipboardCheck, title: "Fast implementation" },
        { icon: PointerIcon, title: "Effortless operations" },
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
| `features` | `FeatureItem[]` | `[]` | The icon and title cards rendered in the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureItem = { icon: LucideIcon; title: string };
```

## Behavior notes

- The grid is fixed at `sm:grid-cols-2 lg:grid-cols-4`, not computed from item count like the dynamic-column formula used in sibling Feature blocks (feature144, feature146): a card count that is not a multiple of 2 or 4 simply leaves a gap in the last row instead of automatically re-balancing.
- Every icon renders at `size-9` inside a fixed `size-20` circular `bg-muted` badge, with `strokeWidth={1.75}` explicitly set, a lighter stroke than lucide-react's default weight of 2.
- `FeatureItem` only has `icon` and `title`, no per-item `description`: each card is icon-plus-headline only, so longer copy has to live in the section-level `description` instead.
- `heading`, `description`, and every card's `title` carry `text-balance` for more even line wrapping at larger sizes.
- The header block (badge/heading/description) only renders when at least one of the three is present; the demo itself only sets `heading` and omits `badge` and `description`.
