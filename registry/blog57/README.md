# Blog57: Journal Lead And Index

Journal preview for landing pages: one lead entry carries a wide image, category, title, excerpt and date, while the narrow column beside it lists three shorter entries as hairline-ruled rows. The header pairs a parenthetical eyebrow and display heading with an outline pill link to the full archive.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/blog57"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/blog57"
```

This installs the block to `components/beste/block/blog57.tsx` plus the `badge7` eyebrow and `button12` pill button it uses.

## Quick start

The installed file exports `blog57Demo` alongside the block: the exact props behind the preview above. Spread it to get a working journal section in one line.

```tsx
import { Blog57, blog57Demo } from "@/components/beste/block/blog57";

export default function Page() {
  return <Blog57 {...blog57Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Blog57 } from "@/components/beste/block/blog57";

export default function Page() {
  return (
    <Blog57
      badge={{ label: "The journal" }}
      heading="What we work out in writing."
      featured={{
        image: { src: "/journal/brief.jpg", alt: "Printed brief on a studio table" },
        category: "Process",
        title: "The brief we now refuse to start without",
        excerpt: "The single sheet we ask for before anyone opens a design file.",
        meta: "12 April 2026 · 8 min read",
        href: "/journal/the-brief",
      }}
      posts={[
        {
          category: "Typography",
          title: "Setting a type scale that survives real copy",
          meta: "28 March 2026 · 6 min read",
          href: "/journal/type-scale",
        },
      ]}
      button={{ label: "Read every entry", href: "/journal" }}
      labels={{ listTitle: "Also this season" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Eyebrow label rendered as a `Badge7` |
| `heading` | `string` | – | Section heading beside the archive link |
| `featured` | `FeaturedPost` | – | Lead entry with the image, excerpt and date |
| `posts` | `PostLink[]` | `[]` | Ruled index rows in the narrow column |
| `button` | `ActionButton` | – | Outline pill link to the full archive, rendered as `Button12` |
| `labels` | `Blog57Labels` | `{}` | Fixed strings that are not content: the eyebrow above the index |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeaturedPost = {
  image: { src: string; alt: string };
  category: string;
  title: string;
  excerpt: string;
  meta: string;
  href: string;
};

type PostLink = {
  category: string;
  title: string;
  meta: string;
  href: string;
};

type ActionButton = {
  label: string;
  href: string;
};

type Blog57Labels = {
  listTitle?: string;
};
```

## Behavior notes

- The whole lead entry is one `next/link`, image included, so the click target covers the card rather than the title alone; each index row is a link of its own for the same reason.
- `meta` is a single free-text string, not a date plus a read-time prop, so a row can read `12 April 2026 · 8 min read`, a season, or an issue number without any formatting logic in the block.
- The body grid is `md:grid-cols-[1.35fr_1fr]`, which keeps the lead image wide enough to hold the fold while the index stays a genuinely narrow column instead of a second equal card track.
- Neither the image nor the rows take a hover treatment, following the set's rule against zoom, colorize and border changes on cards; the link affordance comes from the cursor and the layout.
- Index rows are separated by their own `border-t` rather than a wrapper divider, so dropping to one or two entries still closes each row off cleanly.
- Category and date share the same muted `text-base` voice above and below the title, which is what makes a three-line row scan as one unit.
