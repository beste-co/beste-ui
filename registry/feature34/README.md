# Feature34: Numbered Reasons List

List of features tagged with zero-padded circular numbers ("01", "02", ...) instead of icons, laid out as either a single centered column or a two-column grid depending on the `columns` prop.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature34"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature34"
```

This installs the block to `components/beste/block/feature34.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `feature34Demo` alongside the block: the exact props behind the preview above. Spread it to get a working numbered list in one line.

```tsx
import { Feature34, feature34Demo } from "@/components/beste/block/feature34";

export default function Page() {
  return <Feature34 {...feature34Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Feature34 } from "@/components/beste/block/feature34";

export default function Page() {
  return (
    <Feature34
      badge={{ label: "Why us", variant: "default" }}
      heading="Four reasons teams choose us"
      description="We've spent years refining the details."
      columns={1}
      features={[
        {
          id: "feature-1",
          title: "No learning curve",
          description: "Familiar interface patterns mean your team can start immediately.",
        },
        {
          id: "feature-2",
          title: "Transparent pricing",
          description: "One plan, one price. No hidden fees.",
        },
      ]}
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
| `features` | `NumberedFeature[]` | `[]` | Numbered rows; the section renders nothing when this is empty |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the list |
| `columns` | `1 \| 2` | `2` | `2` lays out a `md:grid-cols-2` grid; `1` centers a single `max-w-3xl` column |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type NumberedFeature = {
  id: string;
  title: string;
  description: string;
};

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- The component returns `null` when `features` is empty, so it never renders a header with no rows beneath it.
- The number badge is always the item's 1-based array index, zero-padded to two digits with `padStart(2, "0")` ("01", "02", ...); it is not a prop and cannot be overridden per item.
- `columns` is coerced with `Number(columns)` before the `=== 2` check, so it tolerates a stringified `"2"` being passed even though the type only declares `1 | 2`.
- There is no per-item icon slot: every row's marker is the same bordered circle with `border-primary text-primary`, unlike feature23/feature26/feature29/feature107 which accept a custom `icon` node per item.
- Rows have no hover or interaction state; the only dynamic layout behavior is the `columns` grid switch itself.
