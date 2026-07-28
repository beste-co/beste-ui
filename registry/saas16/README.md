# Saas16: Changelog Timeline

Static changelog/release-notes list: a centered header sits above a stack of version cards, each showing a version badge, optional type badge, date, title, and description.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/saas16"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/saas16"
```

This installs the block to `components/beste/block/saas16.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `saas16Demo` alongside the block: the exact props behind the preview above. Spread it to get a working changelog in one line.

```tsx
import { Saas16, saas16Demo } from "@/components/beste/block/saas16";

export default function ChangelogPage() {
  return <Saas16 {...saas16Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Saas16 } from "@/components/beste/block/saas16";

export default function ChangelogPage() {
  return (
    <Saas16
      heading="Release notes"
      description="Every update, in one place."
      items={[
        {
          version: "1.4.0",
          date: "Jan 9, 2026",
          title: "Faster search indexing",
          description: "Search results now update within seconds of a catalog change.",
          badge: { label: "Improvement", variant: "secondary" },
        },
        {
          version: "1.3.0",
          date: "Dec 20, 2025",
          title: "Dark mode",
          description: "The dashboard now follows your system theme.",
          badge: { label: "Feature", variant: "default" },
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; icon?: React.ReactNode; variant?: "default" \| "secondary" \| "outline" }` | – | Small badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `items` | `ChangelogItem[]` | `[]` | Version cards rendered in order |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ChangelogItem = {
  version: string;
  date: string;
  title: string;
  description: string;
  badge?: { label: string; variant?: "default" | "secondary" | "outline" };
};
```

## Behavior notes

- Entries render in the exact order of the `items` array; there's no sorting by `version` or `date`, so the caller is responsible for ordering newest-first.
- Each item always gets an outline `Badge` for its `version` string; the per-item `badge` field (e.g. "Feature"/"Improvement"/"Fix") is a separate, optional second badge shown next to it.
- The list column is capped at `max-w-xl`, narrower than the section's `max-w-5xl` container, so cards stay readable even though the header block above spans wider.
- There's no expand/collapse or pagination; every entry in `items` renders fully at once.
