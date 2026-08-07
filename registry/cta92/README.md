# Cta92: Tailored Subscription

A newsletter CTA that asks before it asks for an address: subjects, then cadence, then the email. The column swaps itself for a confirmation that reads back exactly what was chosen.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/cta92"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/cta92"
```

That installs the block file, the `badge6` eyebrow and `button1` seal CTA it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Cta92, cta92Demo } from "@/components/beste/block/cta92";

export default function Page() {
  return <Cta92 {...cta92Demo} />;
}
```

```tsx
import { Cta92 } from "@/components/beste/block/cta92";

export default function Page() {
  return (
    <Cta92
      badge={{ label: "Newsletter" }}
      meta="4,100 readers"
      heading="Subscribe to the parts you actually read"
      description="One list, three subjects, and a cadence you choose."
      promises={[
        {
          title: "You pick the subjects",
          description: "Anything you leave out is never sent.",
        },
        {
          title: "Leaving is one click",
          description: "The unsubscribe link sits at the top of every email.",
        },
      ]}
      image={{
        src: "https://images.unsplash.com/photo-1585241645927-c7a8e5840c42",
        alt: "Printed newsletter issues stacked on a desk",
      }}
      caption="Every issue is written, edited, and sent by the same two people."
      note="No sponsorships, and the list is never shared."
      button={{ label: "Read the last issue", href: "https://beste.co" }}
      shortcuts="numbers"
      topicsStep={{ title: "What should we send you?", description: "Pick as many as you like." }}
      topics={[
        { value: "notes", label: "Engineering notes", description: "What we changed." },
        { value: "design", label: "Design teardowns" },
      ]}
      cadenceStep={{ title: "How often is welcome?" }}
      cadences={[
        { value: "weekly", label: "Weekly", description: "Thursday mornings." },
        { value: "monthly", label: "Monthly" },
      ]}
      emailStep={{
        title: "Where should it arrive?",
        label: "Email address",
        placeholder: "you@company.com",
      }}
      labels={{ submit: "Confirm my subscription", confirmationTitle: "Check your inbox" }}
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
| `image` | `CoverImage` | – | Photograph in the left column, at a fixed height. |
| `caption` | `string` | – | Line under the photograph. |
| `promises` | `PromiseItem[]` | `[]` | Bordered cells in a three-up row under both columns: what the subscription is and is not. |
| `note` | `string` | – | Muted line under the promise cells. |
| `topicsStep` | `Step` | – | Copy for the first question. Omit it to drop the step. |
| `topics` | `Option[]` | `[]` | Checkbox choices for the first question. |
| `cadenceStep` | `Step` | – | Copy for the second question. Omit it to drop the step. |
| `cadences` | `Option[]` | `[]` | Radio choices for the second question. |
| `emailStep` | `EmailStep` | – | Copy and placeholder for the address step. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active step. |
| `button` | `ActionButton` | – | `Button1` seal CTA under the confirmation. |
| `labels` | `Cta92Labels` | `{}` | Overrides for the buttons and the confirmation copy. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };
type CoverImage = { src: string; alt: string };

type PromiseItem = { title: string; description: string };
type Option = { value: string; label: string; description?: string };

type Step = { title: string; description?: string };
type EmailStep = Step & { label: string; placeholder?: string };

type Cta92Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  confirmationTitle?: string;
  confirmationDescription?: string;
  topicsSummary?: string;
  cadenceSummary?: string;
  emailSummary?: string;
};
```

## Behavior notes

- The three steps write to the fixed field names `topics`, `cadence`, and `email`, which is what lets the confirmation read the answers back in words instead of values.
- Every step is required, so Submit stays out of reach until at least one subject is ticked, a cadence is chosen, and the address step has something in it.
- The address step is a text field inside the flow rather than a form under it, so the subjects and the cadence are already settled by the time anyone types an address.
- Submitting swaps the steps for the confirmation, which lists the chosen subjects as chips, the cadence in full, and the address it will write to. Change my answers clears it and remounts the flow.
- The steps sit directly on the page rather than inside a bordered panel. One step is on screen at a time, so a box around it is mostly empty; the bordered choices and the filled summary cells carry the structure instead.
- The photograph keeps a fixed height and never resizes with the step beside it, so moving between questions or landing on the confirmation does not make the picture jump. The promise cells sit in their own row under both columns, which is what keeps the left side from running long past the form.
- Nothing is sent anywhere. Wire `topics`, `cadence`, and `email` to your own handler at the point where the confirmation is set.
- Dropping `topicsStep` or `cadenceStep` removes that question, and the confirmation row for it then reads as empty rather than breaking.
