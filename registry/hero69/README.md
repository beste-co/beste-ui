# Hero69: Email Signup Hero

Minimal centered hero built around a single-row email capture form: an icon-prefixed input and a submit button sit inline on wider screens and stack on mobile, with optional privacy fine print underneath.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero69"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero69"
```

This installs the block to `components/beste/block/hero69.tsx` and the shadcn/ui `badge`, `button`, and `input` components it depends on.

## Quick start

The installed file exports `hero69Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hero in one line.

```tsx
import { Hero69, hero69Demo } from "@/components/beste/block/hero69";

export default function Page() {
  return <Hero69 {...hero69Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero69 } from "@/components/beste/block/hero69";

export default function Page() {
  return (
    <Hero69
      badge={{ label: "Launching Soon", variant: "outline" }}
      heading="Join the waitlist"
      description="We open access in batches. Sign up now to get invited first."
      inputPlaceholder="you@company.com"
      buttonLabel="Join Waitlist"
      privacyText="No spam. One email when your invite is ready."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading |
| `heading` | `string` | – | Main headline |
| `description` | `string` | – | Supporting paragraph |
| `inputPlaceholder` | `string` | – | Placeholder text of the email input |
| `buttonLabel` | `string` | – | Submit button label |
| `privacyText` | `string` | – | Fine print rendered under the form |
| `className` | `string` | – | Extra classes for the outer `<section>` |

## Behavior notes

- The form's `onSubmit` only calls `e.preventDefault()`. There is no `onSubmit` prop or fetch call wired up; consumers must add their own submit handler to actually capture the entered address.
- The email `Input` is uncontrolled (no `value`/`onChange` in the component), so wiring it up requires a `ref` or wrapping the rendered form to read the field's value.
- Layout stacks the input and button vertically on mobile (`flex-col`) and switches to a single row at `sm` and above (`sm:flex-row`).
- A Mail icon is absolutely positioned inside the input via `left-3 top-1/2 -translate-y-1/2`, independent of the `inputPlaceholder` text.

<Callout type="info" title="Wiring the form up">
This block ships the form markup only; state, validation, and submit are yours to add. Our guide wires the shadcn `Field` primitives to [React Hook Form, TanStack Form, and Formisch](/blog/shadcn-forms-react-hook-form-tanstack-formisch) on one field system.
</Callout>
