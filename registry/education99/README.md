# Education99: Global Partnerships Grid

Centered header (badge, heading, description) followed by an inline row of headline stats and a responsive grid of partner-institution cards, each pairing a Lucide icon with the institution's name and location.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/education99"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/education99"
```

This installs the block to `components/beste/block/education99.tsx` and the shadcn/ui `badge` component it depends on.

## Quick start

The installed file exports `education99Demo` alongside the block: the exact props behind the preview above. Spread it to get a working partnerships section in one line.

```tsx
import { Education99, education99Demo } from "@/components/beste/block/education99";

export default function Page() {
  return <Education99 {...education99Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Globe } from "lucide-react";
import { Education99 } from "@/components/beste/block/education99";

export default function Page() {
  return (
    <Education99
      badge={{ label: "Global Network", variant: "secondary" }}
      heading="International partnerships"
      description="We collaborate with leading institutions worldwide."
      stats={[
        { label: "Countries", value: "30+" },
        { label: "Partner Institutions", value: "80+" },
      ]}
      organizations={[
        { name: "University of Oxford", location: "United Kingdom" },
        { name: "ETH Zurich", location: "Switzerland", icon: Globe },
        { name: "CERN", location: "Switzerland", icon: Globe },
      ]}
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
| `stats` | `StatItem[]` | `[]` | Headline numbers rendered as a centered inline row above the grid |
| `organizations` | `OrganizationItem[]` | `[]` | Partner institution cards |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type StatItem = { label: string; value: string };

type OrganizationItem = {
  id?: string;
  name: string;
  location: string;
  icon?: LucideIcon;
};
```

## Behavior notes

- The organization grid uses dynamic column-count logic keyed on `organizations.length`: 3 columns once there are 5 or more items, otherwise 4 when the count divides evenly by 4, 3 when it divides evenly by 3, and 2 otherwise.
- That logic has a bug worth knowing about: when the computed `columnCount` is `4`, the ternary produces the class string `"lg:grid-cols-"` with no trailing digit. Tailwind doesn't recognize this class, so a 4-item (or 8-, 12-item) `organizations` list silently falls back to the `sm:grid-cols-2` base at the `lg` breakpoint instead of actually showing 4 columns.
- `stats` renders as a horizontal `flex` row (not a grid), centered and gapped, and is skipped entirely when the array is empty.
- Each organization card falls back to the `Building` icon when `icon` is omitted; the card's `key` is `org.id ?? org.name` rather than the array index.
