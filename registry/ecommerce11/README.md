# Ecommerce11: Size Guide Table

Measurement chart for clothing product pages: a titled table whose columns (chest, waist, hips, length, or any other fields you pass) are derived from your data rather than hardcoded, with zebra-striped rows and a unit suffix on each header.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/ecommerce11"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/ecommerce11"
```

This installs the block to `components/beste/block/ecommerce11.tsx` and the `Table` shadcn/ui primitive it uses.

## Quick start

The installed file exports `ecommerce11Demo` alongside the block: the exact props behind the preview above. Spread it to get a working size table in one line.

```tsx
import { Ecommerce11, ecommerce11Demo } from "@/components/beste/block/ecommerce11";

export default function ProductPage() {
  return <Ecommerce11 {...ecommerce11Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Ecommerce11 } from "@/components/beste/block/ecommerce11";

export default function ProductPage() {
  return (
    <Ecommerce11
      heading="Size Guide"
      description="Measurements are in centimeters."
      unit="cm"
      sizes={[
        { size: "S", chest: "86-91", waist: "71-76" },
        { size: "M", chest: "97-102", waist: "81-86" },
        { size: "L", chest: "107-112", waist: "91-96" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Section heading above the table |
| `description` | `string` | – | Supporting text under the heading |
| `unit` | `"in" \| "cm"` | `"in"` | Suffix appended to each measurement column header |
| `sizes` | `SizeRow[]` | `[]` | Table rows, one per size |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type SizeRow = {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  length?: string;
};
```

## Behavior notes

- Table columns are computed at render time from `Object.keys(sizes[0])` (excluding `size`), not hardcoded to chest/waist/hips/length; the column set follows whichever fields the *first* row happens to have, so a later row with an extra field the first row lacks won't get a column at all.
- `unit` is purely a label suffix appended to each column header (e.g. "Chest (in)"); the component does not convert or recompute the underlying numeric values between inches and centimeters.
- Rows alternate `bg-background` and `bg-muted/30` by index for zebra striping, inside the shadcn `Table` primitive.
- A missing value for a given column on a given row renders a literal "-" rather than a blank cell.
- Each row is keyed by `row.size`, so every size label passed into `sizes` must be unique.
