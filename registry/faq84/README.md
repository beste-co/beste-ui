# Faq84: Hairline Answer Ledger

A compact FAQ with nothing hidden behind a click: three labelled groups of question and answer pairs set as two-column hairline rows, closing on a link to longer reading.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/faq84"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/faq84"
```

This installs the block to `components/beste/block/faq84.tsx` plus the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `faq84Demo` alongside the block: the exact props behind the preview above. Spread it to get a working ledger in one line.

```tsx
import { Faq84, faq84Demo } from "@/components/beste/block/faq84";

export default function FaqPage() {
  return <Faq84 {...faq84Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Faq84 } from "@/components/beste/block/faq84";

export default function FaqPage() {
  return (
    <Faq84
      badge={{ label: "Short answers" }}
      heading="The quick ones, without an accordion in the way"
      description="Everything here fits in two lines, so nothing is hidden behind a click."
      groups={[
        {
          label: "Getting started",
          entries: [
            {
              question: "Is there a free tier?",
              answer: "Yes, free while you are running a single clinic, with no card.",
            },
            {
              question: "How long is setup?",
              answer: "An afternoon for one clinic, a fortnight for a group.",
            },
          ],
        },
        {
          label: "Money and exit",
          entries: [
            {
              question: "How are we billed?",
              answer: "Monthly in arrears, per seat, prorated in both directions.",
            },
          ],
        },
      ]}
      footerLabel="Longer questions, longer answers"
      footerLink={{ label: "Open the help centre", href: "/help" }}
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
| `groups` | `LedgerGroup[]` | `[]` | Labelled groups of question and answer pairs |
| `footerLabel` | `string` | – | Sentence introducing the help centre link |
| `footerLink` | `{ label: string; href: string }` | – | Link at the end of that sentence |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type LedgerEntry = {
  question: string;
  answer: string;
};

type LedgerGroup = {
  label: string;
  entries: LedgerEntry[];
};
```

## Behavior notes

- Nothing collapses. There is no state in this block at all, which is the whole point: it is for the answers short enough that hiding them costs more than showing them.
- Each group is a real `dl` with `dt` and `dd` per entry, which is the correct structure for question and answer pairs.
- Rows are a `1fr` to `1.6fr` split from `md`, giving the answer more width than the question, and stack below `md` with the question first.
- Every group closes with `last:border-b`, so each group reads as its own small table rather than one continuous run of rules.
- Groups use `mb-10` with `last:mb-0`, so the spacing lives between them and the block never ends on a stray margin.
- `footerLabel` and `footerLink` render together or not at all, since the link is the end of that sentence rather than a standalone action.
- Answers are meant to fit two lines. Longer ones still render, but the two-column rhythm is what makes the ledger scannable, so anything that runs past three lines belongs in a different FAQ block.
