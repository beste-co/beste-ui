# Agency24: Studio Brief With Changing Plate

A four-step studio brief where the tall photograph beside it changes with the question on screen, each with its own caption. Sending the brief swaps the plate for the studio and the form for a ledger of the answers.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/agency24"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/agency24"
```

That installs the block file, the `badge7` eyebrow and `button12` pill it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Agency24, agency24Demo } from "@/components/beste/block/agency24";

export default function Page() {
  return <Agency24 {...agency24Demo} />;
}
```

```tsx
import { Agency24 } from "@/components/beste/block/agency24";

export default function Page() {
  return (
    <Agency24
      badge={{ label: "Start a brief" }}
      heading="Four answers and we know whether we are the wrong studio for you."
      description="The same questions we would ask on a first call."
      shortcuts="numbers"
      steps={[
        {
          name: "work",
          title: "What are we making?",
          required: true,
          choices: [
            { value: "identity", label: "An identity" },
            { value: "site", label: "A site" },
          ],
          image: { src: "https://images.unsplash.com/photo-1583201173319-a4efa99605cf", alt: "Print" },
          caption: "Wordmark and print system for a small publisher.",
        },
        {
          name: "contact",
          title: "Where do we send the reply?",
          required: true,
          // an input step: the field writes to the same name
          input: { label: "Email address", placeholder: "you@studio.com", type: "email" },
          image: { src: "https://images.unsplash.com/photo-1777523743687-233bbfdbd894", alt: "Desk" },
          caption: "Every brief gets a written answer.",
        },
      ]}
      closing={{
        image: { src: "https://images.unsplash.com/photo-1763307411452-43cfd9f516ce", alt: "Studio" },
        caption: "This is the room your brief lands in on Monday morning.",
        title: "Brief received",
        description: "One of us replies inside two working days.",
        emptyLabel: "Left blank",
      }}
      button={{ label: "Book the intro call", href: "https://beste.co" }}
      notes={[
        {
          title: "No forms after this one",
          description: "The reply comes from the person who would run the work.",
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `badge` | `Badge` | – | Parenthetical eyebrow above the heading, rendered with `Badge7`. |
| `heading` | `string` | – | Section heading. |
| `description` | `string` | – | Lead paragraph, set opposite the heading. |
| `steps` | `BriefStep[]` | `[]` | The questions, each carrying the plate and caption shown while it is on screen. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active step. |
| `closing` | `Closing` | – | The plate, the caption, and the ledger heading shown once the brief is sent. |
| `button` | `ActionButton` | – | `Button12` pill under the ledger. |
| `notes` | `Note[]` | `[]` | Ruled row under the brief. |
| `labels` | `Agency24Labels` | `{}` | Overrides for the navigation buttons and the rewrite link. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };
type BriefImage = { src: string; alt: string };
type Note = { title: string; description: string };

type BriefStep = {
  name: string;
  title: string;
  description?: string;
  choices?: BriefChoice[];
  input?: { label: string; placeholder?: string; type?: "email" | "text" };
  required?: boolean;
  multiple?: boolean;
  image: BriefImage;
  caption: string;
};

type BriefChoice = { value: string; label: string; description?: string };

type Closing = {
  image: BriefImage;
  caption: string;
  title: string;
  description: string;
  emptyLabel?: string;
};

type Agency24Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
};
```

## Behavior notes

- The plate is driven by the step on screen, not by hover or by scroll. Moving with Next, Previous, or a shortcut key changes the photograph and the caption under it, so the picture is always describing the question being asked.
- Give every step an `image` and a `caption`. They are required for that reason: a step without one would leave the column showing the previous answer's picture.
- A step with `input` renders a text field under the fixed choices, or on its own when the step has no choices. It writes to the same field name, so the ledger prints what was typed.
- The questions sit directly on the page rather than inside a filled panel. One step of a brief is short, and a tinted box around it only advertises the space the step is not using. The bordered choices carry the structure instead.
- The whole brief is uncontrolled. `steps` decides the order, and the block only watches which step is active to pick the plate.
- Sending swaps the plate for `closing.image` and the form for a ledger of every step and its answer, with `closing.emptyLabel` standing in for anything left blank.
- Write a different one clears the ledger and remounts the brief at the first step, plate included.
