# Workflow55: Process Weight Spectrum

A process sizer that answers with a position rather than a verdict. A photographic band opens the section, four weighted questions add up to a score, and the band that score lands in takes the page over with its practices.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/workflow55"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/workflow55"
```

That installs the block file, the `badge6` eyebrow and `button1` seal CTA it is built from, the `socialproof24` piece it shows in the banner, and the `questionnaire` primitive.

## Quick start

```tsx
import { Workflow55, workflow55Demo } from "@/components/beste/block/workflow55";

export default function Page() {
  return <Workflow55 {...workflow55Demo} />;
}
```

```tsx
import { Workflow55 } from "@/components/beste/block/workflow55";
import { Socialproof24 } from "@/components/beste/piece/socialproof24";

export default function Page() {
  return (
    <Workflow55
      badge={{ label: "How much process" }}
      meta="Four questions"
      heading="Most teams are running the wrong amount of process"
      description="Four questions put you somewhere on the line."
      shortcuts="numbers"
      image={{
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c",
        alt: "Empty meeting room with chairs pulled back",
      }}
      aside={{
        title: "Who it ends up involving",
        note: "Every rung up the scale adds a name that has to say yes.",
        media: (
          <Socialproof24
            items={[
              {
                src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                alt: "Portrait of the engineer writing the change",
              },
              {
                src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                alt: "Portrait of the approver from the platform team",
                // only the member with a name gets the tooltip
                name: "Waiting on Dana",
              },
            ]}
          />
        ),
      }}
      questions={[
        {
          name: "blast",
          title: "If this goes wrong on a Friday, who notices?",
          choices: [
            // the heaviest answer in each question sets the ceiling
            { value: "team", label: "The team, and nobody else", weight: 0 },
            { value: "customers", label: "Paying customers, immediately", weight: 4 },
          ],
        },
        {
          name: "reverse",
          title: "How hard is it to undo?",
          choices: [
            { value: "easy", label: "One command, under a minute", weight: 0 },
            { value: "never", label: "It cannot be undone", weight: 4 },
          ],
        },
      ]}
      bands={[
        {
          upTo: 20,
          title: "Just ship it",
          summary: "Nothing here justifies a process.",
          practices: ["One person writes it and one person looks at it"],
          button: { label: "See the lightweight kit", href: "https://beste.co" },
        },
        {
          upTo: 100,
          title: "Full change control",
          summary: "Irreversible and externally visible.",
          practices: ["Written change request, approved before any work starts"],
          image: {
            src: "https://images.unsplash.com/photo-1497366216548-37526070297c",
            alt: "Empty meeting room with chairs pulled back",
          },
          button: { label: "See the change control pack", href: "https://beste.co" },
        },
      ]}
      labels={{ submit: "Place me on the line", railTitle: "How much process this needs" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `badge` | `Badge` | – | Eyebrow above the rule, rendered with `Badge6`. |
| `meta` | `string` | – | Short line beside the eyebrow, across the hairline divider. |
| `heading` | `string` | – | Section heading. |
| `description` | `string` | – | Section description under the heading. |
| `questions` | `WeightQuestion[]` | `[]` | The questions. Every choice carries the weight it adds. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active question. |
| `bands` | `Band[]` | `[]` | Read in order; the first band whose `upTo` covers the score wins. Each one is a rung on the ledger. |
| `image` | `BandImage` | – | Band across the top, shown until the score is placed. |
| `aside` | `Aside` | – | Small banner beside the questions: a label, a piece, and a line under it. |
| `labels` | `Workflow55Labels` | `{}` | Overrides for the buttons, the rail heading, and the score line. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };
type BandImage = { src: string; alt: string };

type WeightQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: WeightChoice[];
};

type WeightChoice = {
  value: string;
  label: string;
  description?: string;
  weight: number;
};

type Aside = {
  title?: string;
  note?: string;
  media?: ReactNode;
};

type Band = {
  upTo: number;
  title: string;
  summary: string;
  practices?: string[];
  image?: BandImage;
  button?: ActionButton;
};

type Workflow55Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  railTitle?: string;
  scoreLabel?: string;
  practicesTitle?: string;
};
```

## Behavior notes

- The score is a percentage of the ceiling, and the ceiling is worked out from the heaviest answer to every question. Adding a question or a heavier option rescales the scale automatically, so the bands do not have to be renumbered by hand.
- `upTo` is the upper edge of a band as a percent, and the bands are read in order. The last one should reach 100 or a maximum score has nowhere to land.
- The bands are never listed. They are the scale the score is read against, not a menu, so the section only ever shows the one that was landed in.
- The photograph opens the section rather than sitting beside the form, at a fixed height and with no caption under it. It swaps to the matched band's own picture, which is the only thing on the page that changes before the answer is read.
- Both states are two columns, and both columns always carry something. While the questions are open the banner beside them shows what the heavy end of the scale actually produces; once the score is placed, that column becomes the numbered practices and the left becomes the score, the title, the summary, and the seal CTA.
- The piece is passed as `aside.media`, pre-configured in the demo data rather than assembled by the block. Give every embedded piece its full props: a bare one renders the empty defaults and the banner looks broken.
- The banner answers the third question in a picture: the cluster is the people a heavier change pulls in, which is exactly what that question is weighing.
- Keep that piece informational and minimal. A card with buttons on it in a marketing section offers something to press that does nothing, so the banner shows a line of reasoning rather than an action. Set a piece to the set accent where it ships its own colour, or it fights the section.
- A band with its own `image` replaces the opening band, which lets the picture get heavier as the process does.
- Weights are deliberately blunt whole numbers. The block is meant to settle an argument in a room, not to produce a defensible index.
- Every question is required, because a partial answer would place the marker somewhere lower than the truth.
