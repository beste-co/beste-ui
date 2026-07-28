# Blog3: Card Grid with Authors

Three-column card grid for a blog index or archive page: every card zooms its cover image on hover, carries individually clickable tag badges, and closes with an author avatar next to a date/read-time meta line.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/blog3"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/blog3"
```

This installs the block to `components/beste/block/blog3.tsx`, plus the `badge` and `avatar` shadcn/ui primitives it uses for tags and author avatars.

## Quick start

The installed file exports `blog3Demo` alongside the block: the exact props behind the preview above. Spread it to get a working blog grid in one line.

```tsx
import { Blog3, blog3Demo } from "@/components/beste/block/blog3";

export default function BlogIndexPage() {
  return <Blog3 {...blog3Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Blog3 } from "@/components/beste/block/blog3";

export default function BlogIndexPage() {
  return (
    <Blog3
      badge={{ label: "Blog" }}
      heading="Latest articles"
      description="Notes on shipping product."
      posts={[
        {
          image: {
            src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&fit=crop",
            alt: "Code on screen",
          },
          title: "Shipping faster with feature flags",
          summary: "How we roll out risky changes without breaking prod.",
          date: "March 2, 2026",
          readTime: "6 min read",
          author: { name: "Sam Rivera", title: "Staff Engineer" },
          tags: [{ label: "Engineering", href: "/blog/tag/engineering" }],
          href: "/blog/feature-flags",
        },
        {
          image: {
            src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop",
            alt: "Analytics dashboard",
          },
          title: "Reading a funnel report",
          summary: "A short primer on where users actually drop off.",
          date: "February 20, 2026",
          readTime: "4 min read",
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
| `posts` | `BlogPost[]` | `[]` | Cards rendered in the grid |
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

- The grid runs `sm:grid-cols-2 lg:grid-cols-3`; each card's cover image scales to 105% on hover via a `group/blog3` wrapper.
- Tags render as individually clickable outline badges, each wrapping its own `Link`, not a single combined tag row; a post with no `tags` simply skips that block.
- The author avatar falls back to initials (the first letter of each word in `author.name`) via `AvatarFallback` when `author.avatar` is missing.
- Date and read time are joined with a middle dot and hidden between the `sm` and `xl` breakpoints (visible on mobile, hidden on tablet/small desktop, visible again on large desktops) via `block sm:hidden xl:block`.
- Title and summary are clamped to two lines (`line-clamp-2`) no matter how long the source text is.
