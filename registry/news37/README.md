# News37: Filterable Newsroom Index

A newsroom whose kind pills are derived from the announcements and carry live counts, narrowing a chronological list of hairline rows that align the kind, the date and the headline with its summary.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/news37"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/news37"
```

This installs the block to `components/beste/block/news37.tsx` plus the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `news37Demo` alongside the block: the exact props behind the preview above. Spread it to get a working newsroom in one line.

```tsx
import { News37, news37Demo } from "@/components/beste/block/news37";

export default function NewsroomPage() {
  return <News37 {...news37Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { News37 } from "@/components/beste/block/news37";

export default function NewsroomPage() {
  return (
    <News37
      badge={{ label: "Newsroom" }}
      heading="Everything we have announced, in the order it happened"
      description="All of it stays up, including the parts that did not go to plan."
      allLabel="Everything"
      items={[
        {
          kind: "Product",
          date: "14 May 2026",
          title: "Multi-site capacity sharing is out of testing",
          summary: "Four clinics can now share one waiting list while keeping their own rules.",
          href: "/news/multi-site",
        },
        {
          kind: "Incident",
          date: "24 April 2026",
          title: "Forty-one minutes of slow booking pages",
          summary: "Root cause, timeline, and the four things we changed afterwards.",
          href: "/news/incident-april",
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
| `items` | `Announcement[]` | `[]` | The newsroom, in the order it should read |
| `emptyLabel` | `string` | – | Line shown when a filter matches nothing |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type Announcement = {
  kind: string;
  date: string;
  title: string;
  summary: string;
  href: string;
};
```

## Behavior notes

- The kind pills are derived, not configured. They come from `Array.from(new Set(items.map(item => item.kind)))`, so adding an announcement with a new `kind` adds a pill automatically, in first-appearance order. Counts are computed the same way.
- Items are never sorted by the block, so pass them newest first. `date` is a plain string and is never parsed, which keeps the page free of server and client locale differences.
- The kind appears both on the pills and in each row, which is what makes an unfiltered list readable: the row's own label carries the category even with no filter applied.
- Rows are whole `Link` elements in a three-track grid from `md`: kind, date, then headline and summary. Below `md` they stack in that order.
- Rows carry `md:px-4` alongside the hover fill, so the highlight extends slightly past the text on wider screens.
- `emptyLabel` only renders when the current filter matches nothing, which can only happen if `items` is empty, since every pill is derived from an item that exists.
- The pills are real `button` elements with `aria-pressed` and explicit `cursor-pointer`, since Tailwind v4 buttons default to `cursor: default`.
