# Changelog28: Full Release Notes By Month

A complete changelog grouped by month, each version on a hairline row beside its entries, every line tagged added, changed, fixed or removed with its own tone.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/changelog28"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/changelog28"
```

This installs the block to `components/beste/block/changelog28.tsx` plus the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `changelog28Demo` alongside the block: the exact props behind the preview above. Spread it to get a working log in one line.

```tsx
import { Changelog28, changelog28Demo } from "@/components/beste/block/changelog28";

export default function ReleaseNotesPage() {
  return <Changelog28 {...changelog28Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Changelog28 } from "@/components/beste/block/changelog28";

export default function ReleaseNotesPage() {
  return (
    <Changelog28
      badge={{ label: "Release notes" }}
      heading="Everything that changed, line by line"
      description="The full log rather than the highlights."
      kindLabels={{ added: "Added", changed: "Changed", fixed: "Fixed", removed: "Removed" }}
      months={[
        {
          label: "May 2026",
          releases: [
            {
              version: "3.4.0",
              date: "14 May",
              href: "/changelog/3-4-0",
              entries: [
                { kind: "added", text: "Shared waiting list across every site in a group" },
                { kind: "removed", text: "Per-site waiting list settings" },
              ],
            },
          ],
        },
      ]}
      footnote="Nothing is ever quietly edited after publication."
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
| `kindLabels` | `Record<Kind, string>` | – | The word shown on each entry chip |
| `months` | `Month[]` | `[]` | Month groups, each holding its releases |
| `footnote` | `string` | – | Correction policy under the log |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type Kind = "added" | "changed" | "fixed" | "removed";

type Entry = {
  kind: Kind;
  text: string;
};

type Release = {
  version: string;
  date: string;
  entries: Entry[];
  href: string;
};

type Month = {
  label: string;
  releases: Release[];
};
```

## Behavior notes

- `kind` drives the chip colour from the `kindStyles` table: accent for added, amber for changed, emerald for fixed, muted for removed. Adding a fifth kind means extending that table as well as the union.
- `kindLabels` falls back to the raw key when a label is missing, so an incomplete record degrades to `"added"` rather than rendering blank.
- Chips are colour plus a word, never colour alone, so the four kinds stay distinguishable without relying on hue.
- Only the version number is a link, not the whole row, since the entries beneath it are the content rather than a summary of it.
- Version numbers use `tabular-nums` so the left column stays aligned across different lengths.
- Entries use `flex-wrap items-baseline`, so a long line wraps under its chip rather than squeezing it.
- Months use `mb-10` with `last:mb-0`, and releases carry `border-t`, so rules appear between releases and above the first one in each month.
- Grouping is authored, not computed. The block never parses dates or sorts, so the array order is the display order.
