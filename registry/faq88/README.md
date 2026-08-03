# Faq88: Good Fit Qualifier

A qualifying FAQ that sets a checked good-fit column against a crossed not-for-you column, then answers the three questions that follow from them on two-column hairline rows.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/faq88"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/faq88"
```

This installs the block to `components/beste/block/faq88.tsx` plus the `badge23` and `button21` components it uses for the eyebrow and the closing action.

## Quick start

The installed file exports `faq88Demo` alongside the block: the exact props behind the preview above. Spread it to get a working qualifier in one line.

```tsx
import { Faq88, faq88Demo } from "@/components/beste/block/faq88";

export default function FaqPage() {
  return <Faq88 {...faq88Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Faq88 } from "@/components/beste/block/faq88";

export default function FaqPage() {
  return (
    <Faq88
      badge={{ label: "Honest answers" }}
      heading="Whether this is for you, before you spend an hour finding out"
      description="We would rather lose the call early than lose it in month three."
      fit={{
        title: "A good fit if",
        description: "The practices where the product earns its place in the first fortnight.",
        items: [
          "You run between one and twenty clinical rooms",
          "Scheduling, records, and billing are three systems today",
        ],
      }}
      notFit={{
        title: "Probably not if",
        description: "We will say so on the first call rather than sell into the gap.",
        items: ["You need inpatient or ward management", "You require an on-premise deployment"],
      }}
      items={[
        {
          question: "What if we are close to the second list?",
          answer: "Tell us which line and we will give you a straight yes or no on the call.",
        },
      ]}
      closingLabel="Not sure which list you are on?"
      button={{ label: "Ask before you book", href: "/contact" }}
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
| `fit` | `FitColumn` | – | The good-fit column, checked and accent-bordered |
| `notFit` | `FitColumn` | – | The not-for-you column, crossed and plain |
| `items` | `FaqItem[]` | `[]` | Follow-up questions on hairline rows |
| `closingLabel` | `string` | – | Prompt beside the closing action |
| `button` | `{ label: string; href: string }` | – | Outline closing action |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type ActionLink = {
  label: string;
  href: string;
};

type FitColumn = {
  title: string;
  description: string;
  items: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};
```

## Behavior notes

- The two columns are separate named props rather than an array, so each side has a fixed meaning. The positive column is always first and always accent-bordered, and the negative one always uses the plain border on a muted surface.
- Icons follow from position, not from a flag on the item: the good-fit column gets `Check` in the accent, the other gets `X` in muted. Both are `aria-hidden`, since the column heading already frames the list.
- Either column can be omitted and the other still renders in its own grid track, so a one-sided version is possible without editing the block.
- List rows carry `border-t` with no closing rule, so both lists stay open at the bottom and the card's own padding closes them instead.
- Cards are `flex flex-col`, so a pair with different amounts of copy still fills the row evenly.
- The follow-up rows are a `1fr` to `1.6fr` split from `md`, giving the answer more width than the question, and stack below `md`.
- Question rows render as `h3`, keeping the section a real outline under the `h2`.
