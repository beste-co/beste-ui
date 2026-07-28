# Feature8: Capability Carousel

Centered header with a badge, heading, description, and CTA buttons, above a looping shadcn Carousel of capability cards. Each card's media slot follows the Media Slot Standard, and every card in the shipped demo fills it with a live registry-piece asset over a photographic background.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature8"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature8"
```

This installs the block to `components/beste/block/feature8.tsx`, the shadcn/ui `badge`, `button`, and `carousel` components it depends on, and the `ai8`, `ai22`, `code1`, `keyboard1`, `search1`, and `weather2` pieces it embeds as media-slot fillers (installed to `components/beste/piece/{name}.tsx`).

## Quick start

The installed file exports `feature8Demo` alongside the block: the exact props behind the preview above. Spread it to get a working carousel in one line.

```tsx
import { Feature8, feature8Demo } from "@/components/beste/block/feature8";

export default function Page() {
  return <Feature8 {...feature8Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup mixing an image card and a live-asset card looks like this:

```tsx
import { Search1 } from "@/components/beste/piece/search1";
import { Feature8 } from "@/components/beste/block/feature8";

export default function Page() {
  return (
    <Feature8
      badge={{ label: "Capabilities", variant: "outline" }}
      heading="A toolkit for every surface you ship"
      description="Swipe through the assets that come prebuilt."
      buttons={[{ label: "Browse all assets", href: "/components" }]}
      items={[
        {
          title: "Lightning-fast search",
          description: "A type-aware search field with a keyboard hint.",
          media: { type: "component", component: <Search1 placeholder="Search anything..." shortcut={["⌘", "K"]} /> },
        },
        {
          title: "See it in the product",
          description: "A screenshot of the finished search experience.",
          media: {
            type: "image",
            src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop",
            alt: "Product dashboard on a laptop",
          },
        },
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
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons under the description |
| `items` | `CarouselItemData[]` | `[]` | Carousel cards |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};

type CarouselItemData = {
  title: string;
  description: string;
  media: ItemMedia;
};

type ItemMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string }
  | {
      type: "component";
      component: React.ReactNode;
      background?: ComponentBackground;
    };

type ComponentBackground =
  | { type: "dots" }
  | { type: "none" }
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };
```

## Behavior notes

- The carousel loops (`opts={{ loop: true, align: "center" }}`), so dragging past the last card wraps back to the first; the dot indicators below the carousel exactly mirror `items.length`.
- `activeIndex` state tracks the Carousel API's `"select"` event via a `useEffect` that calls `api.on`/`api.off`; clicking a dot calls `api.scrollTo(index)` to jump straight to that card.
- Visible-card count scales with viewport: `basis-4/5` on mobile shows one card with the next peeking in, `md:basis-1/2` shows two, `lg:basis-1/3` shows three.
- The media surface sits above the card body inside a `border-b` strip, while the outer card itself is `overflow-hidden rounded-md border`, so only the card's outer corners are rounded and the media area reads as a flat top section.
- Every item in the shipped demo uses the `component` media variant with an explicit `background: { type: "image", ... }`, giving each card a photographic backdrop behind its embedded piece instead of the default dotted grid.
