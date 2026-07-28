# Showcase3: Project Gallery Grid

Responsive photo grid for a portfolio or case-study page: up to three columns of image cards with an optional caption, each card zooming its image slightly on hover, and rendering as a real link whenever an `href` is supplied.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/showcase3"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/showcase3"
```

This installs the block to `components/beste/block/showcase3.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `showcase3Demo` alongside the block: the exact props behind the preview above. Spread it to get a working gallery in one line.

```tsx
import { Showcase3, showcase3Demo } from "@/components/beste/block/showcase3";

export default function WorkPage() {
  return <Showcase3 {...showcase3Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Showcase3 } from "@/components/beste/block/showcase3";

export default function WorkPage() {
  return (
    <Showcase3
      heading="See our work in action"
      description="Browse through our collection of successful projects."
      images={[
        {
          src: "https://images.unsplash.com/photo-1565768502719-571073a68b4c?w=500&fit=crop",
          alt: "Enterprise dashboard",
          caption: "Enterprise Dashboard",
          href: "https://beste.co",
        },
        {
          src: "https://images.unsplash.com/photo-1583265101492-bfe6ef35cef8?w=500&fit=crop",
          alt: "Mobile app",
          caption: "Mobile Application",
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `images` | `GalleryItem[]` | `[]` | Grid tiles, in order |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
};
```

## Behavior notes

- Grid columns are fixed responsive breakpoints (`md:grid-cols-2 lg:grid-cols-3`), not a data-driven column count.
- A card renders as a `<Link>` when `image.href` is set and as a plain `<div>` when it's omitted, sharing identical visual chrome either way, so mixing linked and non-linked tiles in the same grid is supported.
- The hover zoom on the image (`scale-105`) is driven by the named group `group/showcase3` on the card wrapper, so it works the same whether the wrapper is a link or a div.
- The caption block only renders when `image.caption` is present; captionless tiles are just the image with no text area beneath it.
- The section header (badge, heading, description) is skipped entirely when none of the three props are set, and the grid itself is skipped when `images` is empty.
