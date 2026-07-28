# Health16: Health Statistics Display

Large-format statistics grid for proof-point numbers like member counts, satisfaction rates, and years in business, each with a big value, a label, and an optional supporting line, closed out with a decorative gradient hairline.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/health16"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/health16"
```

This installs the block to `components/beste/block/health16.tsx` and its dependencies.

## Quick start

The installed file exports `health16Demo` alongside the block: the exact props behind the preview above. Spread it to get a working statistics section in one line.

```tsx
import { Health16, health16Demo } from "@/components/beste/block/health16";

export default function AboutPage() {
  return <Health16 {...health16Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Health16 } from "@/components/beste/block/health16";

export default function AboutPage() {
  return (
    <Health16
      eyebrow="By The Numbers"
      heading="A decade of measurable outcomes"
      description="Results our members track alongside their care team."
      statistics={[
        { value: "12,400+", label: "Active Members" },
        { value: "96%", label: "Satisfaction Rate", description: "Members who renew after year one" },
        { value: "10", label: "Years of Practice" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `eyebrow` | `string` | – | Small uppercase label above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `statistics` | `Statistic[]` | `[]` | Stat cards rendered in the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Statistic = {
  value: string;
  label: string;
  description?: string;
};
```

## Behavior notes

- The component returns `null` entirely when `statistics` is empty, so unlike most section blocks in this registry it will not render its heading or eyebrow without at least one statistic.
- Column count at the `lg` breakpoint is derived from `statistics.length`: 1 stat centers in a single `max-w-md` column, 2 stats use 2 columns, counts divisible by 3 use 3 columns, and everything else (including 4) falls back to 4 columns. Below `lg` the grid is always 2-up (or 1-up for a single stat).
- A decorative gradient hairline (`bg-gradient-to-r from-transparent via-border to-transparent`) always renders beneath the grid, regardless of props.
- Each statistic's `description` line is optional and only rendered when present; `value` and `label` are always shown.
