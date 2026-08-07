# Event101: Slot By Slot Day Builder

A programme picker that builds the day beside the questions. One choice per time slot drops a session card with its room, its length, and its photograph into a running plan, and the hours left open stay on the page instead of being hidden.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/event101"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/event101"
```

That installs the block file, the `badge23` eyebrow and `button21` action button it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Event101, event101Demo } from "@/components/beste/block/event101";

export default function Page() {
  return <Event101 {...event101Demo} />;
}
```

```tsx
import { Event101 } from "@/components/beste/block/event101";

export default function Page() {
  return (
    <Event101
      badge={{ label: "Build your day" }}
      heading="Four slots, and you can see the gaps you leave"
      description="Pick one thing per slot and the day fills in beside you."
      shortcuts="numbers"
      slots={[
        {
          name: "morning",
          // printed down the left of the plan
          time: "09:30",
          title: "How do you want to start?",
          choices: [
            {
              value: "keynote",
              label: "The opening talk",
              description: "One hour, one argument.",
              room: "Main hall",
              minutes: 60,
              image: {
                src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
                alt: "A speaker alone on a round stage with the audience seated around it",
              },
            },
            {
              value: "workshop",
              label: "Hands on the tools",
              room: "Studio 2",
              minutes: 90,
              image: {
                src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                alt: "Three people working at a table with their laptops open",
              },
            },
          ],
        },
        {
          name: "close",
          time: "16:30",
          title: "How does it end?",
          choices: [
            { value: "closing", label: "The closing talk", room: "Main hall", minutes: 30 },
            { value: "drinks", label: "Straight to the bar", room: "Courtyard", minutes: 90 },
          ],
        },
      ]}
      confirmation={{
        title: "Day saved",
        description: "It is in your calendar with the room numbers attached.",
      }}
      button={{ label: "Add it to my calendar", href: "https://beste.co" }}
      labels={{ submit: "Save this day", emptyLabel: "Nothing booked yet" }}
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
| `slots` | `SlotQuestion[]` | `[]` | One question per slot, in the order the day runs. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active slot. |
| `confirmation` | `Confirmation` | – | Replaces the questions once the day is saved. |
| `button` | `ActionLink` | – | `Button21` beside the confirmation. |
| `labels` | `Event101Labels` | `{}` | Overrides for the buttons, the plan heading, the empty row, and the time units. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionLink = { label: string; href: string };
type SessionImage = { src: string; alt: string };
type Confirmation = { title: string; description: string };

type SlotQuestion = {
  name: string;
  time: string;
  title: string;
  description?: string;
  choices?: SessionChoice[];
};

type SessionChoice = {
  value: string;
  label: string;
  description?: string;
  room: string;
  minutes: number;
  image?: SessionImage;
};

type Event101Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  planTitle?: string;
  emptyLabel?: string;
  totalLabel?: string;
  hour?: string;
  minute?: string;
};
```

## Behavior notes

- The plan fills in on the answer, not on the submit. Choosing a session drops it into that slot's row immediately, with its room, its length, and its photograph, so the day takes shape while it is being decided.
- Unanswered slots keep their row and their time. An empty afternoon is a visible decision rather than a missing line, which is the whole argument for building a day this way.
- `time` is a label, not a calculation. The block prints it as given and never tries to work out whether a ninety minute session overruns the next slot.
- The total is summed from the chosen sessions and formatted without a locale API, which would risk a server and client mismatch.
- Saving swaps the questions for the confirmation while the plan stays exactly where it is, so the reader checks the day against what they just agreed to. Plan it again empties every slot.
- The questions sit directly on the page rather than inside a bordered panel. One slot is on screen at a time, so a box around it is mostly empty; the plan beside it is the surface that matters.
- Every slot is required, so a day cannot be saved half-built. Drop a slot from `slots` if it should not be asked at all.
