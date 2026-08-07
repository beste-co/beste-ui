# Faq92: Answer Router

A help section that asks two questions instead of offering a search box. The answers pick one written answer out of a list of routes, the image tile beside them floats that answer as a live assistant card, and a soft panel underneath keeps a way through to a person.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/faq92"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/faq92"
```

That installs the block file, the `badge23` eyebrow and `button21` action button it is built from, the `chat34` piece it floats over the image, and the `questionnaire` primitive.

## Quick start

```tsx
import { Faq92, faq92Demo } from "@/components/beste/block/faq92";

export default function Page() {
  return <Faq92 {...faq92Demo} />;
}
```

```tsx
import { Faq92 } from "@/components/beste/block/faq92";
import { Chat34 } from "@/components/beste/piece/chat34";

export default function Page() {
  return (
    <Faq92
      badge={{ label: "Help" }}
      heading="Two questions instead of a search box"
      description="Tell us where you are and what happened."
      shortcuts="numbers"
      questions={[
        {
          name: "area",
          title: "What is this about?",
          choices: [
            { value: "billing", label: "Billing and invoices" },
            { value: "access", label: "Getting into the account" },
          ],
        },
        {
          name: "state",
          title: "Where did it stop working?",
          choices: [
            { value: "before", label: "Before I could start" },
            { value: "after", label: "It finished, but the result is wrong" },
          ],
        },
      ]}
      answers={[
        {
          // shown only when both answers match
          match: { area: "billing", state: "after" },
          title: "The invoice does not match what you expected",
          description: "Mid-cycle plan changes are prorated to the day.",
          link: { label: "Read how proration is calculated", href: "https://beste.co" },
          // replaces the standing photograph while this answer is up
          image: {
            src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
            alt: "Printed forms spread across a desk with a pen and a calculator",
          },
          // the piece answers the question this route was reached by
          media: (
            <Chat34
              question="Why is this invoice higher than the plan price?"
              answer="You changed plan on the 14th."
              sourcesLabel="Answered from"
              sources={["Invoices", "Proration"]}
            />
          ),
          caption: "Every invoice line is itemised.",
        },
        {
          match: { area: "billing" },
          title: "Payments, plans, and receipts",
          description: "Card updates and past receipts live in billing settings.",
        },
        {
          // no match: the catch-all, and it has to be last
          title: "Something else",
          description: "Start from the index and narrow down from there.",
          link: { label: "Open the help index", href: "https://beste.co" },
        },
      ]}
      contact={{
        title: "Still not it?",
        description: "Send us the answers you just gave.",
        link: { label: "Write to support", href: "https://beste.co" },
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `badge` | `Badge` | – | Eyebrow above the rule, rendered with `Badge23`. |
| `heading` | `string` | – | Section heading. |
| `description` | `string` | – | Section description under the heading. |
| `questions` | `RouterQuestion[]` | `[]` | The questions, in the order they are asked. Single answer each. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active question. |
| `answers` | `Answer[]` | `[]` | Checked in order; the first one whose `match` fits wins. |
| `image` | `RouterImage` | – | Standing photograph, shown until an answer is found. |
| `media` | `ReactNode` | – | Piece floated over the standing photograph. |
| `caption` | `string` | – | Line under the standing photograph. |
| `contact` | `Contact` | – | Soft panel under both columns, shown at every stage. |
| `labels` | `Faq92Labels` | `{}` | Overrides for the navigation buttons and the answer heading. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type RouterImage = { src: string; alt: string };

type RouterQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: RouterChoice[];
};

type RouterChoice = { value: string; label: string; description?: string };

type Answer = {
  match?: Record<string, string>;
  title: string;
  description: string;
  link?: { label: string; href: string };
  image?: RouterImage;
  media?: ReactNode;
  caption?: string;
};

type Contact = {
  title: string;
  description: string;
  link: { label: string; href: string };
};

type Faq92Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  answerTitle?: string;
};
```

## Behavior notes

- An answer's `match` maps a question's `name` to the value it needs. Every pair has to match, so `{ area: "billing", state: "after" }` is narrower than `{ area: "billing" }` and belongs above it in the array.
- The list is read top to bottom and the first fit wins, which is what lets a specific route sit in front of a general one for the same subject.
- The last entry stands in when nothing fits, so a submit never dead-ends. Give it no `match` and it reads as a deliberate catch-all.
- Every question is required, so Next stays blocked until the question on screen has an answer, and the whole thing is two clicks and a submit.
- An answer with its own `image` and `media` replaces the standing plate, its floated card, and its caption, so the column beside the questions answers the question it was reached by rather than repeating it. An answer without them keeps the standing plate.
- Pieces are passed as `media`, pre-configured in the demo data rather than assembled by the block. Give every embedded `Chat34` its full props: a bare one renders the empty defaults and the tile looks broken.
- The contact panel sits under both columns rather than under the photograph. Stacked in the media column it made that side run long past the questions, which is the imbalance this layout is built to avoid.
- The questions sit directly on the page rather than inside a bordered panel. One question is on screen at a time, so a box around it is mostly empty; the bordered choices and the photograph beside them carry the structure instead.
- The contact panel is always visible, including while the questions are still being answered. Routing is a shortcut, not a wall.
- Answering again clears the answer and remounts the flow from the first question.
