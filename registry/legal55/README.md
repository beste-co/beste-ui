# Legal55: Plain Words Terms Table

A legal section that sets each binding clause against a plain-language reading of it on hairline rows, keyed by clause references, with a precedence disclaimer under the last row.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/legal55"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/legal55"
```

This installs the block to `components/beste/block/legal55.tsx` plus the `badge23` and `button21` components it uses for the eyebrow and the action.

## Quick start

The installed file exports `legal55Demo` alongside the block: the exact props behind the preview above. Spread it to get a working table in one line.

```tsx
import { Legal55, legal55Demo } from "@/components/beste/block/legal55";

export default function TermsPage() {
  return <Legal55 {...legal55Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Legal55 } from "@/components/beste/block/legal55";

export default function TermsPage() {
  return (
    <Legal55
      badge={{ label: "Terms, translated" }}
      heading="The contract on the left, what we actually mean on the right"
      description="The wording on the left is the binding text."
      columnLabels={{ clause: "The clause", plain: "In plain words" }}
      pairs={[
        {
          reference: "4.1",
          clause:
            "Customer retains all right, title and interest in Customer Data. Provider is granted a limited licence to process Customer Data solely to deliver the Services.",
          plain: "Your records stay yours. We only touch them to run the product.",
        },
        {
          reference: "6.3",
          clause:
            "Either party may terminate this Agreement for convenience on thirty (30) days' written notice.",
          plain: "You can leave with a month's notice, and it costs nothing to go.",
        },
      ]}
      disclaimer="Where the two columns disagree, the clause wins."
      button={{ label: "Read the full agreement", href: "/legal/terms" }}
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
| `columnLabels` | `{ clause: string; plain: string }` | – | The two column headings |
| `pairs` | `ClausePair[]` | `[]` | Clause and translation pairs, keyed by reference |
| `disclaimer` | `string` | – | Precedence note under the last row |
| `button` | `{ label: string; href: string }` | – | Outline link to the full agreement |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type ActionLink = {
  label: string;
  href: string;
};

type ClausePair = {
  reference: string;
  clause: string;
  plain: string;
};
```

## Behavior notes

- The plain wording is the emphasised column: `clause` renders in `text-muted-foreground` and `plain` in `text-foreground`. That inversion is intentional, since the translation is what people are here to read, while the clause is the reference.
- `disclaimer` exists because of that inversion. Stating which column is binding is what makes the whole layout safe to publish, so treat it as required in practice even though the type marks it optional.
- The column header row is `hidden md:grid` and opens with an empty `aria-hidden` span, which keeps the two labels aligned over their columns rather than over the reference track.
- Because the header row is hidden below `md`, its margin would collapse there. The rows container carries `mt-12 md:mt-0` to compensate.
- Rows use `border-b` matching the header's `border-b`, so the rules read as one continuous table.
- The reference is a fixed `4rem` grid track from `md` up. Below `md` the grid collapses to one column and reference, clause and translation stack in that order.
- `reference` is copy, so any numbering scheme works and the block never renumbers or sorts.
