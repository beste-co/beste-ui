# UseCase7: Solutions Accordion

Single-open accordion where each row expands into a two-column panel with a screenshot on one side and a description plus feature checklist on the other. Only one panel is open at a time.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/usecase7"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/usecase7"
```

This installs the block to `components/beste/block/usecase7.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `usecase7Demo` alongside the block: the exact props behind the preview above. Spread it to get a working section in one line.

```tsx
import { UseCase7, usecase7Demo } from "@/components/beste/block/usecase7";

export default function Page() {
  return <UseCase7 {...usecase7Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Bot, LineChart } from "lucide-react";
import { UseCase7 } from "@/components/beste/block/usecase7";

export default function Page() {
  return (
    <UseCase7
      badge={{ label: "Solutions", variant: "secondary" }}
      heading="Explore Our Solutions"
      description="Click on each solution to learn more about how we can help."
      items={[
        {
          id: "automation",
          icon: <Bot className="size-5" />,
          title: "Process Automation",
          description: "Automate repetitive tasks and workflows to save time.",
          image: { src: "https://images.unsplash.com/photo-1518770660439-4636190af475", alt: "Automation" },
          features: [{ id: "a1", text: "Visual workflow builder" }],
        },
        {
          id: "analytics",
          icon: <LineChart className="size-5" />,
          title: "Advanced Analytics",
          description: "Real-time dashboards and predictive insights.",
          image: { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71", alt: "Analytics" },
          features: [{ id: "b1", text: "Custom reports" }],
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
| `items` | `UseCaseItem[]` | – | Accordion rows, one panel per item |
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

- This is a hand-rolled accordion driven by a single `useState<number | null>` (`expandedIndex`), not the shadcn/ui `Accordion` primitive. The first item (index `0`) is expanded by default, and clicking an open row's header collapses it back to `null`.
- Expansion is implemented with a `grid-rows-[0fr]` to `grid-rows-[1fr]` transition plus an opacity fade (`duration-300`), not a height/max-height animation and not conditional mounting, so collapsed panel markup stays in the DOM at all times.
- Because only one `expandedIndex` is tracked, opening any row always closes whichever other row was open; there is no multi-open mode. The chevron icon rotates 180 degrees on the expanded row.
- Inside an expanded panel, image and content sit in a `md:grid-cols-2` row; on mobile they stack with the image first when present.
- The icon swatch and title carry `group-hover/usecase7:*` classes, but no ancestor in the row declares a `group/usecase7` class, so those hover styles never actually apply; only the button's own `hover:bg-foreground/[0.02]` wash is visible on hover.
