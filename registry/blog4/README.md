# Blog4: Featured Hero with Grid

Blog index that promotes the first entry in `posts` into a large side-by-side hero card (cover image on one side, content on the other) and drops the remaining entries into a three-column grid underneath it. The hero and grid cards share the same author, tag, and date structure, just at different sizes.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/blog4"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/blog4"
```

This installs the block to `components/beste/block/blog4.tsx`, plus the `badge`, `avatar`, and `button` shadcn/ui primitives it uses for tags, author avatars, and the featured post's "Read more" button.

## Quick start

The installed file exports `blog4Demo` alongside the block: the exact props behind the preview above. Spread it to get a working featured blog layout in one line.

```tsx
import { Blog4, blog4Demo } from "@/components/beste/block/blog4";

export default function BlogIndexPage() {
  return <Blog4 {...blog4Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Blog4 } from "@/components/beste/block/blog4";

export default function BlogIndexPage() {
  return (
    <Blog4
      badge={{ label: "Blog" }}
      heading="Featured stories"
      description="Hand-picked reads from the team."
      labels={{ readMoreLabel: "Continue reading" }}
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
| `posts` | `BlogPost[]` | `[]` | First entry becomes the featured hero, the rest fill the grid |
| `labels` | `{ readMoreLabel?: string }` | – | Text for the featured hero's "Read more" button |
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

- `posts[0]` becomes the featured hero and `posts.slice(1)` fills the grid below it. If `posts` has only one entry, the grid section is skipped entirely (`gridPosts.length > 0` check).
- The featured card's image is `aspect-video` on mobile and stretches to fill its column edge to edge on `md+` (`md:aspect-auto`), since the layout switches to two columns at that breakpoint.
- The "Read more" button label falls back to `"Read more"` inline in the JSX (`labels?.readMoreLabel ?? "Read more"`) even when `labels` is omitted entirely, unlike most text props in this registry which have no built-in fallback.
- Grid cards show only the first two tags (`tags.slice(0, 2)`) while the featured hero shows every tag on the post.
- Avatar size differs by context: `size-10` in the featured hero (with author title shown), `size-6` in grid cards (name and read time only, no title).
