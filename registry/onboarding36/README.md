# Onboarding36: Go-Live Day Agenda

A first-day agenda held in one bordered panel, with timestamped hairline rows naming what happens, who is needed, how long it takes and which parts are optional.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/onboarding36"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/onboarding36"
```

This installs the block to `components/beste/block/onboarding36.tsx` plus the `badge23` and `button21` components it uses for the eyebrow and the action.

## Quick start

The installed file exports `onboarding36Demo` alongside the block: the exact props behind the preview above. Spread it to get a working agenda in one line.

```tsx
import { Onboarding36, onboarding36Demo } from "@/components/beste/block/onboarding36";

export default function GoLivePage() {
  return <Onboarding36 {...onboarding36Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Onboarding36 } from "@/components/beste/block/onboarding36";

export default function GoLivePage() {
  return (
    <Onboarding36
      badge={{ label: "Day one" }}
      heading="The whole first day, hour by hour, written down in advance"
      description="So you can see how much of your team's time this actually costs."
      dayLabel="A typical go-live Monday"
      entries={[
        {
          time: "08:00",
          title: "We watch, you work",
          description: "Your normal morning runs on the new system while two of us sit on a call.",
          who: "Your team, as usual",
        },
        {
          time: "13:00",
          title: "Clinician walkthrough",
          description: "Ten minutes on the record and the note template.",
          who: "Clinicians, 10 minutes each",
          optional: true,
        },
      ]}
      optionalLabel="Optional"
      closing="Nothing above needs a room booked or a training day."
      button={{ label: "Book a go-live date", href: "/go-live" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Eyebrow above the heading, rendered through `Badge23` |
| `heading` | `string` | – | Section heading, capped at `max-w-2xl` |
| `description` | `string` | – | Supporting paragraph, capped at `max-w-xl` |
| `dayLabel` | `string` | – | Panel header naming the day |
| `entries` | `AgendaEntry[]` | `[]` | The agenda, in the order it happens |
| `optionalLabel` | `string` | – | The word shown on optional entries |
| `closing` | `string` | – | Paragraph beside the closing action |
| `button` | `{ label: string; href: string }` | – | Booking action |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type ActionLink = {
  label: string;
  href: string;
};

type AgendaEntry = {
  time: string;
  title: string;
  description: string;
  who: string;
  optional?: boolean;
};
```

## Behavior notes

- `who` is required on every entry and is written as a combined actor and duration, for example "Practice manager, 20 minutes". That single string is what lets the reader total the real cost of the day.
- The optional chip renders only when both `entry.optional` is true and `optionalLabel` is set, so the label can be removed globally without editing every entry.
- The chip is a plain outlined pill rather than a coloured one, since optional is a caveat rather than a status.
- Times are plain strings, never parsed, so the block stays free of server and client locale differences. They use `tabular-nums` so the column stays aligned.
- Rows use `border-b` with `last:border-b-0`, so the agenda closes flush against the panel edge rather than drawing a rule on top of the border.
- The panel's inner padding is on the rows container rather than each row, so the hairlines run the full width of the panel while the content stays inset.
- The panel is `bg-background` on a `bg-muted` section, which is how the set raises a single object off the page.
- The `who` column is right-aligned from `md` and stacks under the description below it.
