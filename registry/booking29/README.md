# Booking29: Appointment Intake Match

Three intake questions that land on a real appointment type instead of a drop-down. The answers pick a route with its length, its facts, and the clinician you will sit with, and the image tile beside them swaps its floated availability card to match.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/booking29"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/booking29"
```

That installs the block file, the `badge23` eyebrow and `button21` action button it is built from, the `card31` piece it floats over the image, and the `questionnaire` primitive.

## Quick start

```tsx
import { Booking29, booking29Demo } from "@/components/beste/block/booking29";

export default function Page() {
  return <Booking29 {...booking29Demo} />;
}
```

```tsx
import { Booking29 } from "@/components/beste/block/booking29";
import { Card31 } from "@/components/beste/piece/card31";

export default function Page() {
  return (
    <Booking29
      badge={{ label: "Before you book" }}
      heading="Three questions decide the appointment, not a drop-down"
      description="Every combination lands on a real appointment type."
      shortcuts="numbers"
      questions={[
        {
          name: "reason",
          title: "What brings you in?",
          choices: [
            { value: "assessment", label: "Something new" },
            { value: "review", label: "A follow-up" },
          ],
        },
        {
          name: "history",
          title: "Have you been seen here before?",
          choices: [
            { value: "new", label: "First time" },
            { value: "returning", label: "I am already registered" },
          ],
        },
      ]}
      routes={[
        {
          // both answers have to fit, so this sits above the looser route
          match: { reason: "assessment", history: "new" },
          title: "First assessment, 60 minutes",
          summary: "A full first appointment with the assessment lead.",
          facts: [
            { label: "With", value: "Dr Amelia Frost" },
            { label: "Length", value: "60 minutes" },
          ],
          media: <Card31 name="Dr Amelia Frost" role="Assessment lead" availability="soon" />,
        },
        {
          // no match: the catch-all, and it has to be last
          title: "Advice call, 15 minutes",
          summary: "A short call with whoever is on duty.",
          media: <Card31 name="Sara Okonjo" role="Duty practitioner" availability="free" />,
        },
      ]}
      image={{ src: "https://images.unsplash.com/photo-1750918619871-dc74c9a57394", alt: "Backdrop" }}
      media={<Card31 name="Sara Okonjo" role="Duty practitioner" availability="free" />}
      waitingBody="Whoever you end up with, the notes follow you."
      button={{ label: "Choose a time", href: "https://beste.co" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `badge` | `Badge` | – | Eyebrow above the rule, rendered with `Badge23`. |
| `heading` | `string` | – | Section heading. |
| `description` | `string` | – | Lead paragraph, set opposite the heading. |
| `questions` | `IntakeQuestion[]` | `[]` | The intake questions, in the order they are asked. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active question. |
| `routes` | `Route[]` | `[]` | Checked in order; the first one whose `match` fits wins. |
| `image` | `TileImage` | – | Backdrop behind the floated piece. |
| `media` | `ReactNode` | – | Piece shown on the tile before anything is answered. |
| `waitingBody` | `string` | – | Line under the tile, kept in both states. |
| `button` | `ActionLink` | – | `Button21` beside the matched appointment. |
| `labels` | `Booking29Labels` | `{}` | Overrides for the navigation buttons and the two panel headings. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionLink = { label: string; href: string };
type TileImage = { src: string; alt: string };
type Fact = { label: string; value: string };

type IntakeQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: IntakeChoice[];
};

type IntakeChoice = { value: string; label: string; description?: string };

type Route = {
  match?: Record<string, string>;
  title: string;
  summary: string;
  facts?: Fact[];
  media?: ReactNode;
};

type Booking29Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  matchTitle?: string;
  waitingTitle?: string;
};
```

## Behavior notes

- A route's `match` maps a question's `name` to the value it needs, and every pair has to fit. Narrow routes belong above loose ones, because the list is read top to bottom and the first fit wins.
- The last route stands in when nothing matches, so a submit never dead-ends. Give it no `match` and it reads as a deliberate catch-all.
- Pieces are passed as `media`, pre-configured in the demo data rather than assembled by the block. Give every embedded `Card31` its full props: a bare one renders the empty defaults and the tile looks broken.
- The questions sit directly on the page rather than inside a bordered panel. One question is on screen at a time, so a box around it is mostly empty; the bordered choices and the hairline fact rows carry the structure instead.
- The tile keeps its height across both states, so matching an appointment swaps the card without the section jumping under the cursor.
- Every question is required, so Submit stays out of reach until all three have an answer.
- Change my answers clears the match and remounts the questions with nothing filled in, and the tile falls back to the standing `media`.
