# Feature135: Integration Logos Grid

A centered, flex-wrapped row of customer or partner logos with a grayscale-to-color hover reveal, framed by an optional badge/heading/description header and a single CTA row underneath.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature135"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature135"
```

This installs the block to `components/beste/block/feature135.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `feature135Demo` alongside the block: the exact props behind the preview above. Spread it to get a working logo grid in one line.

```tsx
import { Feature135, feature135Demo } from "@/components/beste/block/feature135";

export default function Page() {
  return <Feature135 {...feature135Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Feature135 } from "@/components/beste/block/feature135";

export default function Page() {
  return (
    <Feature135
      badge={{ label: "Integrations", variant: "secondary" }}
      heading="Works with your stack"
      description="Connect with the tools you already use."
      logos={[
        { name: "Acme", logo: "https://example.com/logos/acme.svg" },
        { name: "Northwind", logo: "https://example.com/logos/northwind.svg" },
        { name: "Globex", logo: "https://example.com/logos/globex.svg" },
      ]}
      buttons={[{ label: "View all integrations", href: "https://beste.co" }]}
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
| `logos` | `LogoItem[]` | `[]` | Logos rendered in the centered row |
| `buttons` | `ButtonItem[]` | `[]` | Optional CTA row below the logos |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type LogoItem = { name: string; logo: string };

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- Each logo sits inside a fixed `h-10 w-24` box at `opacity-50 grayscale`; hovering an individual logo transitions only that one to `opacity-100 grayscale-0`, while the rest stay dimmed.
- Logos are laid out with `flex flex-wrap items-center justify-center` rather than a CSS grid, so row length and wrapping follow the container width and the number of logos, not a fixed column count.
- The badge/heading/description header block renders only when at least one of the three is set; the button row is centered below the logos and only appears when `buttons` is non-empty.
- `href` on a button falls back to `"#"` when omitted.
