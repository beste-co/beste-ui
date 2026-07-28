# Feature30: Before/After Comparison Cards

Two-column comparison layout that renders a `firstColumn` and `secondColumn` side by side, each a bordered card with a label and a bulleted list, typically used to contrast a "before" pain-point list against an "after" solution list.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature30"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature30"
```

This installs the block to `components/beste/block/feature30.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `feature30Demo` alongside the block: the exact props behind the preview above. Spread it to get a working comparison section in one line.

```tsx
import { Feature30, feature30Demo } from "@/components/beste/block/feature30";

export default function Page() {
  return <Feature30 {...feature30Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Feature30 } from "@/components/beste/block/feature30";

export default function Page() {
  return (
    <Feature30
      badge={{ label: "Compare", variant: "secondary" }}
      heading="The difference is clear"
      description="See how your workflow transforms when you switch platforms."
      firstColumn={{
        id: "before",
        label: "Before",
        items: [
          { id: "b1", text: "Manual data entry across multiple tools" },
          { id: "b2", text: "Hours spent searching for information" },
        ],
      }}
      secondColumn={{
        id: "after",
        label: "After",
        highlighted: true,
        items: [
          { id: "a1", text: "Single source of truth, auto-synced" },
          { id: "a2", text: "Instant search with smart filters" },
        ],
      }}
      buttons={[{ id: "btn-1", label: "Start free trial", href: "/signup" }]}
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
| `firstColumn` | `ComparisonColumn` | – | Left card; the two-column grid is skipped entirely when both columns are omitted |
| `secondColumn` | `ComparisonColumn` | – | Right card |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the columns |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ComparisonColumn = {
  id: string;
  label: string;
  highlighted?: boolean;
  items: ComparisonItem[];
};

type ComparisonItem = { id: string; text: string };

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- `hasColumns` is `true` if either `firstColumn` or `secondColumn` is present, so a single column can be shown alone; the grid still reserves `md:grid-cols-2`, leaving an empty cell where the missing column would sit.
- The `highlighted` flag on `ComparisonColumn` is accepted by the type and set to `true` on the demo's "after" column, but `renderColumn` never reads it, so it currently has no visual effect on the rendered card.
- Both columns render through the same `renderColumn` helper, so "Before" and "After" cards are visually identical (border, shadow, hover lift) aside from their content; there is no color-coding between the two.
- Each list item is a plain bullet dot (`bg-muted-foreground/40`) plus text, not a check or x icon, so the block relies entirely on copy (and the `highlighted` intent, if wired up) to signal which column is the improvement.
- Cards share the same hover treatment as feature26/feature34 (`hover:shadow-xl hover:-translate-y-1` over 300ms).
