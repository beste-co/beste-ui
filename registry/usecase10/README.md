# UseCase10: Split Content Card

Single two-column card, not a grid of many: one side carries a badge, heading, description, dot-bulleted list, and CTA buttons, the other side is a full-height image. The image side can be flipped to either edge of the card.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/usecase10"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/usecase10"
```

This installs the block to `components/beste/block/usecase10.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `usecase10Demo` alongside the block: the exact props behind the preview above. Spread it to get a working section in one line.

```tsx
import { UseCase10, usecase10Demo } from "@/components/beste/block/usecase10";

export default function Page() {
  return <UseCase10 {...usecase10Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Calendar } from "lucide-react";
import { UseCase10 } from "@/components/beste/block/usecase10";

export default function Page() {
  return (
    <UseCase10
      badge={{ label: "Private Events", icon: <Calendar className="size-3.5" />, variant: "outline" }}
      heading="Celebrate With Us"
      description="From intimate dinners to corporate gatherings, our private room offers seclusion for groups up to 40."
      listItems={[
        { id: "item-1", text: "Custom Menus" },
        { id: "item-2", text: "Dedicated Sommelier" },
      ]}
      buttons={[{ id: "btn-1", label: "Inquire for Events", href: "https://beste.co" }]}
      image={{ src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", alt: "Private Dining" }}
      imagePosition="left"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; icon?: React.ReactNode; variant?: "default" \| "secondary" \| "outline" }` | – | Pill above the heading; omitted when `badge.label` is falsy |
| `heading` | `string` | – | Card heading |
| `description` | `string` | – | Card body text |
| `listItems` | `ListItem[]` | – | Dot-bulleted list under the description |
| `buttons` | `ButtonItem[]` | – | CTA buttons under the list |
| `image` | `{ src: string; alt: string }` | – | Full-height image filling the other column |
| `imagePosition` | `"left" \| "right"` | `"right"` | Which side of the card the image column sits on |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ListItem = { id: string; text: string };

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
};
```

## Behavior notes

- `imagePosition` is implemented with `md:flex-row-reverse` on the row when set to `"left"`; below `md` content and image always stack content-first regardless of the prop.
- The first button in `buttons` defaults to `variant="default"` and every subsequent button defaults to `"outline"` unless it sets its own `variant`, so an unstyled two-button array automatically reads as one primary and one secondary action.
- Buttons render via `Button asChild` wrapping a `next/link`, with `href ?? "#"` as the fallback target when a button omits `href`.
- The image column has no fallback background pattern; when `image` is omitted, that column renders as a bare `bg-muted` panel with nothing inside it.
- The whole block is a single `bg-card` panel with `rounded-lg overflow-hidden shadow-lg`, distinguishing it from the borderless, full-width layout of the other usecase blocks in this set.
