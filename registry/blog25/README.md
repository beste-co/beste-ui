# Blog25: Split Image with List

Two-column blog module: a heading and description sit above a single featured image on the left, while the right column holds a divider-separated list of article rows, each showing only its first tag as a small eyebrow line and revealing an arrow on hover.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/blog25"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/blog25"
```

This installs the block to `components/beste/block/blog25.tsx`, plus the `badge` shadcn/ui primitive it uses for the section badge.

## Quick start

The installed file exports `blog25Demo` alongside the block: the exact props behind the preview above. Spread it to get a working split layout in one line.

```tsx
import { Blog25, blog25Demo } from "@/components/beste/block/blog25";

export default function BlogIndexPage() {
  return <Blog25 {...blog25Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Blog25 } from "@/components/beste/block/blog25";

export default function BlogIndexPage() {
  return (
    <Blog25
      badge={{ label: "Editor's Choice" }}
      heading="Recent reads"
      description="Handpicked by the team."
      featuredImage={{
        src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&fit=crop",
        alt: "Code on screen",
      }}
      posts={[
        {
          image: { src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&fit=crop", alt: "" },
          title: "Shipping faster with feature flags",
          summary: "How we roll out risky changes without breaking prod.",
          date: "March 2, 2026",
          readTime: "6 min",
          tags: [{ label: "Engineering" }],
          href: "/blog/feature-flags",
        },
        {
          image: { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop", alt: "" },
          title: "Reading a funnel report",
          summary: "A short primer on where users drop off.",
          date: "February 20, 2026",
          readTime: "4 min",
          href: "/blog/funnel-report",
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Section eyebrow badge |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `featuredImage` | `{ src: string; alt: string }` | – | Shared image rendered once on the left column |
| `posts` | `BlogPost[]` | `[]` | Rows rendered in the right-column list |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type BlogPost = {
  image: { src: string; alt: string };
  title: string;
  summary: string;
  date?: string;
  readTime?: string;
  author?: Author;
  tags?: Tag[];
  href?: string;
};

type Author = {
  name: string;
  title?: string;
  avatar?: { src: string; alt: string };
  href?: string;
};

type Tag = { label: string; href?: string };
```

## Behavior notes

- Only `posts[].tags[0]` is read for the eyebrow line above each title; any additional tags are ignored, and if `tags` is empty nothing renders above the title.
- Each `BlogPost` still requires an `image` field per its type even though the list rendering never uses it: only the shared `featuredImage` on the left column is displayed.
- List rows are separated with `divide-y`, and the first and last rows drop their extra vertical padding (`first:pt-0 last:pb-0`).
- Hovering a row (the whole row is one `Link`, grouped as `group/blog25`) moves the trailing arrow icon right (`translate-x-1`) and tints both the title and arrow to the primary color.
- On `lg` and up the layout becomes two columns; the featured image stretches to fill the available column height (`lg:flex-1 lg:aspect-auto`), while on mobile it keeps a fixed `aspect-video`.
