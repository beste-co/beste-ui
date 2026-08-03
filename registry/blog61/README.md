# Blog61: Filterable Archive Index

A dense blog archive whose subject pills are derived from the posts themselves and carry live counts, filtering a two-column list of hairline rows stamped with a date and a reading time.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/blog61"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/blog61"
```

This installs the block to `components/beste/block/blog61.tsx` plus the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `blog61Demo` alongside the block: the exact props behind the preview above. Spread it to get a working archive in one line.

```tsx
import { Blog61, blog61Demo } from "@/components/beste/block/blog61";

export default function ArchivePage() {
  return <Blog61 {...blog61Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Blog61 } from "@/components/beste/block/blog61";

export default function ArchivePage() {
  return (
    <Blog61
      badge={{ label: "Archive" }}
      heading="Everything we have written, by subject"
      description="No infinite scroll and no recommended reading."
      allLabel="Everything"
      posts={[
        {
          date: "12 May 2026",
          topic: "Operations",
          title: "The waiting list is a scheduling problem, not a queue",
          readingTime: "6 min",
          href: "/blog/waiting-list",
        },
        {
          date: "28 Apr 2026",
          topic: "Billing",
          title: "Why we raise the invoice from the appointment, not the month",
          readingTime: "8 min",
          href: "/blog/invoicing",
        },
      ]}
      emptyLabel="Nothing filed under that yet."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Eyebrow above the hairline rule, rendered through `Badge23` |
| `heading` | `string` | – | Section heading in the left column of the header |
| `description` | `string` | – | Supporting paragraph, right-aligned from `md` up |
| `allLabel` | `string` | `"All"` | Label for the unfiltered pill |
| `posts` | `ArchivePost[]` | `[]` | The archive itself, in the order it should read |
| `emptyLabel` | `string` | – | Line shown when a filter matches nothing |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type ArchivePost = {
  date: string;
  topic: string;
  title: string;
  readingTime: string;
  href: string;
};
```

## Behavior notes

- The filter pills are derived, not configured. Topics come from `Array.from(new Set(posts.map(post => post.topic)))`, so adding a post with a new `topic` adds a pill automatically, in first-appearance order.
- Counts are computed the same way, per render, so they always match what the filter will actually show.
- The active filter is one piece of state holding either a topic string or `null`, with `null` meaning unfiltered. The all-pill carries `value: null`, so it is the same control rather than a special case.
- Posts are never sorted by the block. The array order is the display order, so pass them in the order you want them read.
- Rows are whole `Link` elements laid out as a two-column grid, filling column by column, so a filtered list reflows into the same two columns rather than leaving one empty.
- `emptyLabel` only renders when the current filter matches nothing, which can only happen if `posts` is empty, since every pill is derived from a post that exists.
- The pills are real `button` elements with `aria-pressed`, and carry `cursor-pointer` explicitly, since Tailwind v4 buttons default to `cursor: default`.
