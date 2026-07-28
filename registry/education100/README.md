# Education100: Institutional Quick Facts

Centered header above a grid of quick-fact tiles, each pairing a large stat value with a label and an optional supporting line. Built for university "at a glance" or admissions pages that need to surface institutional numbers fast.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/education100"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/education100"
```

This installs the block to `components/beste/block/education100.tsx` and the shadcn/ui `badge` component it depends on.

## Quick start

The installed file exports `education100Demo` alongside the block: the exact props behind the preview above. Spread it to get a working quick-facts section in one line.

```tsx
import { Education100, education100Demo } from "@/components/beste/block/education100";

export default function Page() {
  return <Education100 {...education100Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Education100 } from "@/components/beste/block/education100";

export default function Page() {
  return (
    <Education100
      badge={{ label: "At a Glance", variant: "secondary" }}
      heading="Quick facts"
      description="Key numbers that define who we are."
      facts={[
        { value: "1890", label: "Year Founded" },
        { value: "22,000+", label: "Students", description: "Undergraduate and graduate" },
        { value: "95%", label: "Placement Rate" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading |
| `heading` | `string` | – | Section heading; unlike the rest of this batch it is a required prop with no optional guard around it |
| `description` | `string` | – | Section intro text |
| `facts` | `QuickFact[]` | `[]` | Quick-fact tiles |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type QuickFact = {
  value: string;
  label: string;
  description?: string;
};
```

## Behavior notes

- `heading` is a required, non-optional prop and is rendered without an `{heading && ...}` guard, unlike `badge`/`description`/`facts`, which are all conditionally rendered.
- The facts grid is fixed at `sm:grid-cols-2 lg:grid-cols-4` regardless of how many items are passed; there is no dynamic column logic like `education99`'s organization grid.
- Each fact card has a hover state (`hover:bg-muted/50` with `transition-colors`), giving the tiles a subtle highlight on pointer hover even though nothing is clickable.
- The outer wrapper uses `<div className="container mx-auto px-4 md:px-6">` rather than an explicit `mx-auto max-w-Xxl` width like the other blocks in this batch, so its content width follows the consuming project's Tailwind `container` breakpoints instead of a fixed max-width.
