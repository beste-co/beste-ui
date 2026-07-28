# Cta11: Banner CTA

Horizontal banner CTA meant to sit inline between content blocks: a bordered, muted card holding a badge, heading, and description on one side and a cluster of buttons on the other, stacking vertically on mobile.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/cta11"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/cta11"
```

This installs the block to `components/beste/block/cta11.tsx` and the `Badge` and `Button` shadcn/ui primitives it uses.

## Quick start

The installed file exports `cta11Demo` alongside the block: the exact props behind the preview above. Spread it to get a working banner in one line.

```tsx
import { Cta11, cta11Demo } from "@/components/beste/block/cta11";

export default function Page() {
  return <Cta11 {...cta11Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { ArrowRight } from "lucide-react";
import { Cta11 } from "@/components/beste/block/cta11";

export default function Page() {
  return (
    <Cta11
      badge={{ label: "New" }}
      heading="Ship your first workflow today"
      description="Set up automation in minutes, no code required."
      buttons={[
        { label: "Get Started", href: "/signup", icon: <ArrowRight className="size-4" /> },
        { label: "Talk to Sales", href: "/contact", variant: "outline" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional pill badge above the heading |
| `heading` | `string` | – | Headline HTML; wrap a phrase in `<strong>` to color-highlight it |
| `description` | `string` | – | Supporting text under the heading |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons rendered on the trailing side of the banner |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  icon?: React.ReactNode;
};
```

## Behavior notes

- The whole block is a single bordered card (`rounded-md border bg-muted p-6 md:p-10`), not a bare full-bleed section; content and buttons sit in a `flex-col` on mobile and switch to a `flex-row` with `items-center` from `md` up.
- `ButtonItem.icon` renders *after* the label inside the link (`{button.label}{button.icon}`), the opposite order from CTA blocks that lead with the icon.
- The badge defaults to `variant="default"` when omitted from the item (not `"secondary"`, unlike `cta8`), and sits with `mb-3` above the heading.
- There's no footnote or secondary text row; this is a compact two-part layout, content block plus button cluster, with no third element.
- Buttons don't stretch to fill the row: the button cluster is `shrink-0`, so it keeps its intrinsic width even as the content column grows.
