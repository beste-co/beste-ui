# Feature2: Alternating Rows With Mixed Media

Header with a badge, heading, description, and CTA buttons, followed by a stack of rows that alternate media-left/media-right by position. Each row's media slot follows the Media Slot Standard, so it can hold a static image, a looping video, or a live registry-piece asset.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature2"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature2"
```

This installs the block to `components/beste/block/feature2.tsx`, the shadcn/ui `badge` and `button` components it depends on, and the `browser27`, `browser28`, and `calendar19` pieces it embeds as media-slot fillers (installed to `components/beste/piece/{name}.tsx`).

## Quick start

The installed file exports `feature2Demo` alongside the block: the exact props behind the preview above. Spread it to get a working alternating-rows section in one line.

```tsx
import { Feature2, feature2Demo } from "@/components/beste/block/feature2";

export default function Page() {
  return <Feature2 {...feature2Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup mixing an image row and a live-asset row looks like this:

```tsx
import { Browser27 } from "@/components/beste/piece/browser27";
import { Feature2 } from "@/components/beste/block/feature2";

export default function Page() {
  return (
    <Feature2
      badge={{ label: "Product tour", variant: "secondary" }}
      heading="Three pieces of the toolkit"
      description="Tiny cards you can drop into hero shots and product walkthroughs."
      buttons={[{ label: "Read the playbook", href: "/playbook" }]}
      rows={[
        {
          title: "Site identity, made glanceable",
          description: "A site-info popover that mirrors browser chrome users already know.",
          media: { type: "component", component: <Browser27 domain="acme.com" /> },
        },
        {
          title: "Show the finished product",
          description: "A static screenshot of the workspace your customers land in.",
          media: {
            type: "image",
            src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
            alt: "Dashboard screen",
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
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the description |
| `rows` | `FeatureRow[]` | `[]` | Alternating media/copy rows |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};

type FeatureRow = {
  title: string;
  description: string;
  media: RowMedia;
};

type RowMedia =
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

- Rows alternate sides by index: `index % 2 === 1` applies `md:flex-row-reverse`, so the first row (index 0) shows media on the left and copy on the right, the second flips, and so on.
- Below `md` every row collapses to a single column with the media stacked above the copy, since the reverse/order classes only apply at `md` and up.
- The media surface uses a `16:9` (`aspect-video`) box with a `rounded-md border` and a `bg-muted/30` dotted-grid default background behind `component`-variant media, distinct from `feature1`'s `4:3` box.
- All three demo rows use the `component` media variant to embed browser-chrome and calendar pieces; the `image`/`video` variants exist on the `RowMedia` type but are not used by the shipped demo.
- Buttons render only when `buttons.length > 0`, right after the description inside the same left-aligned header block, using the standard `gap-3` spacing.
