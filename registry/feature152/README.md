# Feature152: Icon Badge Pills Row

A centered, wrapping row of pill-shaped inline chips, each pairing a small icon with a short label, for a quick list of feature highlights beneath an optional section header and CTA row.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature152"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature152"
```

This installs the block to `components/beste/block/feature152.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `feature152Demo` alongside the block: the exact props behind the preview above. Spread it to get a working pill row in one line.

```tsx
import { Feature152, feature152Demo } from "@/components/beste/block/feature152";

export default function Page() {
  return <Feature152 {...feature152Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Zap, Shield, Globe } from "lucide-react";
import { Feature152 } from "@/components/beste/block/feature152";

export default function Page() {
  return (
    <Feature152
      badge={{ label: "Features", variant: "secondary" }}
      heading="Built for speed"
      description="Key features that make us different."
      items={[
        { icon: <Zap className="size-4" />, label: "Lightning Fast" },
        { icon: <Shield className="size-4" />, label: "Secure" },
        { icon: <Globe className="size-4" />, label: "Global CDN" },
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
| `items` | `FeatureItem[]` | `[]` | Pill chips rendered in the row |
| `buttons` | `ButtonItem[]` | `[]` | Optional CTA row below the pills |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureItem = { icon?: React.ReactNode; label: string };

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- `icon` is typed `React.ReactNode`, not the usual `LucideIcon` component reference: the demo passes already-rendered elements (`<Zap className="size-4" />`) and the block just drops `item.icon` straight into a `<span>`, so callers control the icon's size and styling directly at the call site.
- The component returns `null` when `items` is empty.
- Pills use `flex flex-wrap justify-center` rather than a grid, so they wrap naturally with the number of items and available width instead of snapping to fixed columns.
- Each pill is a plain `rounded-full border bg-card` chip, not a shadcn `Badge`; the `Badge` import is used only for the header eyebrow.
