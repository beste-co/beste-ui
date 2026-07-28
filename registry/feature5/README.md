# Feature5: Compact Two-Column Capabilities

Left-aligned headline and description above a compact two-column grid of icon-led capability rows. The simplest header in this batch: no badge, no CTA button, just heading, description, and the grid.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature5"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature5"
```

This installs the block to `components/beste/block/feature5.tsx` and its dependencies.

## Quick start

The installed file exports `feature5Demo` alongside the block: the exact props behind the preview above. Spread it to get a working capability grid in one line.

```tsx
import { Feature5, feature5Demo } from "@/components/beste/block/feature5";

export default function Page() {
  return <Feature5 {...feature5Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { RefreshCw, Shield, Zap } from "lucide-react";
import { Feature5 } from "@/components/beste/block/feature5";

export default function Page() {
  return (
    <Feature5
      heading="Why teams pick our platform"
      description="Capabilities you can rely on from the first day."
      features={[
        { icon: Zap, title: "Lightning fast performance", description: "Sub-second load times across the product." },
        { icon: Shield, title: "Enterprise security", description: "End-to-end encryption on every request." },
        { icon: RefreshCw, title: "Real-time sync", description: "Changes propagate instantly across devices." },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `features` | `FeatureItem[]` | `[]` | Icon-led capability rows |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureItem = {
  icon?: LucideIcon;
  title: string;
  description: string;
};
```

## Behavior notes

- The header is left-aligned inside a `max-w-2xl` block, not centered like `feature3`'s or the education blocks' headers, and has neither a `badge` prop nor a CTA button prop, the smallest header surface in this batch.
- The grid caps at two columns even on large screens (`grid-cols-1 sm:grid-cols-2` with no `lg` override), unlike `feature3`'s three-column grid or `feature4`'s wide-gapped two-column grid.
- Each card description gets `max-w-md`, keeping line length readable even though the surrounding grid column can stretch wider on large viewports.
- `registryDependencies` is an empty array in `feature5.meta.ts`: the component only imports `lucide-react` icons and `cn()`, no shadcn/ui primitives.
