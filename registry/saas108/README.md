# Saas108: Branching Scoping Form

A contact section that asks a branching set of questions instead of one long form. A rail lists the steps that currently apply and lets you jump between them, and answering the first question adds or removes the steps below it.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/saas108"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/saas108"
```

That installs the block file, the `badge6` eyebrow and `button1` seal CTA it is built from, and the `questionnaire` primitive. The rail and the branching live in the block file itself, so there is nothing else to wire up.

## Quick start

```tsx
import { Saas108, saas108Demo } from "@/components/beste/block/saas108";

export default function Page() {
  return <Saas108 {...saas108Demo} />;
}
```

```tsx
import { Clock, Lock } from "lucide-react";
import { Saas108 } from "@/components/beste/block/saas108";

export default function Page() {
  return (
    <Saas108
      badge={{ label: "Talk to us" }}
      meta="Five questions"
      heading="Tell us what you are building, not your company size"
      description="The questions change as you answer them."
      outlineHeading="Scope your project"
      shortcuts="numbers"
      labels={{ submit: "Send scope", rail: "Your outline" }}
      confirmation={{ title: "Scope sent" }}
      steps={[
        {
          name: "use-case",
          title: "What are you building?",
          shortTitle: "Project",
          required: true,
          choices: [
            { value: "marketing", label: "A marketing site" },
            { value: "app", label: "A customer-facing app" },
          ],
        },
        {
          name: "cms",
          title: "Where does the content live?",
          shortTitle: "Content",
          when: { step: "use-case", equals: ["marketing"] },
          choices: [
            { value: "headless", label: "A headless CMS" },
            { value: "files", label: "Markdown in the repository" },
          ],
        },
      ]}
      assurances={[
        {
          title: "One working day",
          description: "A solutions engineer replies with a plan, not a brochure.",
          icon: Clock,
        },
        {
          title: "Only what you answered",
          description: "Steps the outline closed are never sent.",
          icon: Lock,
        },
      ]}
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
| `outlineHeading` | `string` | – | Heading in the header strip of the outline card. |
| `outlineDescription` | `string` | – | Description in the header strip of the outline card. |
| `steps` | `OutlineStep[]` | `[]` | The questions, in the order they are asked. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active step. |
| `labels` | `OutlineLabels` | `{}` | Overrides for the navigation buttons and the rail heading. |
| `confirmation` | `Confirmation` | `{}` | Copy for the banner shown above the step after submit. |
| `button` | `ActionButton` | – | `Button1` seal CTA inside the confirmation banner. |
| `assurances` | `Assurance[]` | `[]` | Three reassurance cards below the outline. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };

type Assurance = { title: string; description: string; icon?: LucideIcon };
type Confirmation = { title?: string; description?: string };

type OutlineStep = {
  name: string;
  title: string;
  shortTitle?: string;
  description?: string;
  choices?: OutlineChoice[];
  input?: { label: string; placeholder?: string };
  required?: boolean;
  multiple?: boolean;
  when?: OutlineCondition;
};

type OutlineChoice = { value: string; label: string; description?: string };
type OutlineCondition = { step: string; equals: string[] };
```

## Behavior notes

- A step carrying `when` is only asked while the named step's answer is one of `equals`. Until then it is dropped from the rail, from the step count, and from navigation, and its field is left out of the submitted answers.
- The gating step has to come earlier in `steps` than the step it gates, otherwise a branch could close under the person standing on it.
- Every row of the rail is a real button that jumps straight to that step, so the flow is not one-way. The rail only ever lists steps that currently apply, so a jump cannot land on a closed branch.
- The rail marks each step as it is answered or skipped, and the mark on the active step is drawn from the primitive's own status rather than from a separate count.
- Submitting shows a confirmation banner above the step instead of unmounting the form, so the answers stay on screen and stay editable.
- The rail sits to the left of the question from the `md` breakpoint and moves above it below that, where it becomes a compact list with a rule under it.
