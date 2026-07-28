# Auth4: Forgot Password Request

Full-height password recovery screen: a centered icon badge, heading and description, a single email field built on the shadcn `Field` primitives, a send-reset-link button, and a back-to-sign-in link underneath the card.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth4"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth4"
```

This installs the block to `components/beste/block/auth4.tsx` and the `button`, `input`, and `field` shadcn/ui primitives it's built on.

## Quick start

The installed file exports `auth4Demo` alongside the block: the exact props behind the preview above. Spread it to get a working recovery screen in one line.

```tsx
import { Auth4, auth4Demo } from "@/components/beste/block/auth4";

export default function ForgotPasswordPage() {
  return <Auth4 {...auth4Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { KeyRound } from "lucide-react";
import { Auth4 } from "@/components/beste/block/auth4";

export default function ForgotPasswordPage() {
  return (
    <Auth4
      icon={<KeyRound className="size-6" />}
      heading="Forgot your password?"
      description="Enter the email linked to your account and we'll send you a reset link."
      backLink={{ label: "Back to sign in", href: "/sign-in" }}
      labels={{ email: "Email", emailPlaceholder: "you@example.com", submit: "Send reset link" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | – | Icon shown inside the circular badge above the heading |
| `heading` | `string` | – | Screen title |
| `description` | `string` | – | Subtext below the heading |
| `backLink` | `{ label: string; href: string }` | – | Link below the card, hidden entirely when not set |
| `labels` | `{ email?: string; emailPlaceholder?: string; submit?: string }` | `{}` | Field label, placeholder, and submit button copy |
| `className` | `string` | – | Extra classes for the outer `<section>` |

## Behavior notes

- The `<form>` only calls `e.preventDefault()` on submit; there is no `onSubmit` prop, no controlled input state, and no network call, so the integrator has to add their own handler and read the input value themselves (there's no `useState` on the email field at all).
- The email `Field`'s label is conditionally rendered on `labels.email` being set, and the submit `Button` is conditionally rendered on `labels.submit` being set; both default to hidden if their label is omitted.
- This is the simplest of the auth screens in the family: no password toggle, no checkbox, no social providers, just the single-field request step that hands off to `Auth5`-style screens for the actual reset.

<Callout type="info" title="Wiring the form up">
This block ships the form markup only; state, validation, and submit are yours to add. Our guide wires the shadcn `Field` primitives to [React Hook Form, TanStack Form, and Formisch](/blog/shadcn-forms-react-hook-form-tanstack-formisch) on one field system.
</Callout>
