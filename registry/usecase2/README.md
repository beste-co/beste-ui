# UseCase2: Use Case Card Grid

Responsive card grid for pitching a product at different audiences: each card pairs a 16:9 hover-zoom image with a title, description, and a checklist of feature bullets. The grid runs two or three columns.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/usecase2"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/usecase2"
```

This installs the block to `components/beste/block/usecase2.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `usecase2Demo` alongside the block: the exact props behind the preview above. Spread it to get a working section in one line.

```tsx
import { UseCase2, usecase2Demo } from "@/components/beste/block/usecase2";

export default function Page() {
  return <UseCase2 {...usecase2Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { UseCase2 } from "@/components/beste/block/usecase2";

export default function Page() {
  return (
    <UseCase2
      badge={{ label: "Solutions", variant: "secondary" }}
      heading="Tailored for Your Needs"
      description="Explore how our platform adapts to different industries."
      columns={2}
      items={[
        {
          id: "startup",
          title: "Startups",
          description: "Launch faster with pre-built templates and scalable infrastructure.",
          image: { src: "https://images.unsplash.com/photo-1497366216548-37526070297c", alt: "Startup workspace" },
          features: [
            { id: "f1", text: "Quick setup in minutes" },
            { id: "f2", text: "Scalable from day one" },
          ],
        },
        {
          id: "enterprise",
          title: "Enterprise",
          description: "Security, compliance, and customization for large organizations.",
          image: { src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2", alt: "Enterprise building" },
          features: [{ id: "f3", text: "SOC 2 compliant" }],
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
| `columns` | `2 \| 3` | `3` | Grid column count at `md`/`lg` |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type UseCaseItem = {
  id: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  features?: UseCaseFeature[];
};

type UseCaseFeature = { id: string; text: string };
```

## Behavior notes

- `columns={2}` renders `md:grid-cols-2`; any other value (including the default `3`) renders `md:grid-cols-2 lg:grid-cols-3`, so the grid is always single-column below `md` regardless of the prop.
- Each card's image scales to `105%` on hover (`group-hover/usecase2:scale-105`) inside an `overflow-hidden` wrapper, driven by the `group/usecase2` named group on the card root.
- The image block, and the features list, are each conditionally rendered only when present, so a card with no `image` collapses to just title, description, and (if given) the checklist.
- Feature bullets use a `Check` icon from lucide-react in `text-primary`, not a custom bullet character.
