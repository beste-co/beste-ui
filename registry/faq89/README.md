# Faq89: Filterable Glossary

A jargon glossary whose letter filter is derived from the terms themselves, narrowing a two-column hairline definition list with an empty state and a suggest-a-term action.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/faq89"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/faq89"
```

This installs the block to `components/beste/block/faq89.tsx` plus the `badge23` and `button21` components it uses for the eyebrow and the closing action.

## Quick start

The installed file exports `faq89Demo` alongside the block: the exact props behind the preview above. Spread it to get a working glossary in one line.

```tsx
import { Faq89, faq89Demo } from "@/components/beste/block/faq89";

export default function GlossaryPage() {
  return <Faq89 {...faq89Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Faq89 } from "@/components/beste/block/faq89";

export default function GlossaryPage() {
  return (
    <Faq89
      badge={{ label: "Plain English" }}
      heading="The words we use, and what we actually mean by them"
      description="Clinical software collects vocabulary. Here is ours."
      allLabel="All"
      terms={[
        {
          term: "Backfill",
          definition: "A cancelled slot offered to the waiting list automatically.",
        },
        {
          term: "Seat",
          definition: "One person with a login, prorated in both directions mid-month.",
        },
      ]}
      emptyLabel="Nothing filed under that letter."
      closing="Missing a word you keep having to explain to us?"
      button={{ label: "Suggest a term", href: "/contact" }}
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
| `terms` | `Term[]` | `[]` | The glossary itself, in the order it should read |
| `emptyLabel` | `string` | – | Line shown when a letter matches nothing |
| `closing` | `string` | – | Prompt beside the closing action |
| `button` | `{ label: string; href: string }` | – | Outline action for suggesting a term |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type ActionLink = {
  label: string;
  href: string;
};

type Term = {
  term: string;
  definition: string;
};
```

## Behavior notes

- The letter buttons are derived from the first character of each term, uppercased, deduplicated and sorted. Adding a term starting with a new letter adds its button automatically.
- Only letters that have terms behind them are shown, so there is no row of dead buttons for the letters you have not used yet.
- Terms are never sorted by the block. The letters are sorted, but the list itself renders in array order, so pass them alphabetically if that is what you want to read.
- The active filter is one piece of state holding either a letter or `null`, with `null` meaning unfiltered. The all-pill is the same control rather than a special case.
- Letter buttons are square (`size-9`) while the all-pill sizes to its label, which keeps the row reading as one control group without forcing "All" into a square.
- The list is a real `dl` with `dt` and `dd` per entry, split `1fr` to `2.4fr` from `md`, so definitions get most of the width.
- Rows carry `border-t` with no closing rule, so the list flows into the closing row, which brings its own hairline.
- Filter buttons carry `aria-pressed` and explicit `cursor-pointer`, since Tailwind v4 buttons default to `cursor: default`.
