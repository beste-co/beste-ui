# Cta8: Centered Newsletter CTA

Centered call-to-action for newsletter and conversion sections: an optional badge (always paired with a mail icon), a highlightable heading, a description, a wrapping row of buttons, and a small footnote line beneath them.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/cta8"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/cta8"
```

This installs the block to `components/beste/block/cta8.tsx` and the `Badge` and `Button` shadcn/ui primitives it uses.

## Quick start

The installed file exports `cta8Demo` alongside the block: the exact props behind the preview above. Spread it to get a working CTA in one line.

```tsx
import { Cta8, cta8Demo } from "@/components/beste/block/cta8";

export default function Page() {
  return <Cta8 {...cta8Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Cta8 } from "@/components/beste/block/cta8";

export default function Page() {
  return (
    <Cta8
      badge={{ label: "Newsletter" }}
      heading="Never miss a <strong>release</strong>"
      description="One email a month, product notes only, no filler."
      buttons={[
        { label: "Subscribe", href: "/subscribe" },
        { label: "See an example", href: "/archive", variant: "outline" },
      ]}
      footnote="No spam. Unsubscribe anytime."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional pill badge above the heading, always rendered with a leading mail icon |
| `heading` | `string` | – | Headline HTML; wrap a phrase in `<strong>` to color-highlight it |
| `description` | `string` | – | Supporting paragraph under the heading |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons, centered and wrapping |
| `footnote` | `string` | – | Small muted line under the buttons |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- The badge always renders a hardcoded `Mail` icon before its label, regardless of `variant`; there's no way to swap or hide the icon short of omitting `badge` entirely.
- When `badge` is set without a `variant`, it falls back to `"secondary"` rather than `"default"`.
- `heading` is rendered via `dangerouslySetInnerHTML` following the project's highlight convention: only text wrapped in `<strong>` gets `text-primary`, the rest stays the default heading color.
- `footnote` renders at `text-xs text-muted-foreground` beneath the button row and is entirely optional; the demo uses it for "No spam. Unsubscribe anytime."
- Buttons default to `variant="default"` per item and link to `button.href ?? "#"`; the row is centered (`justify-center`) rather than left-aligned, matching this block's fully centered layout.
