# Auth6: Magic Link Sign In

Full-height passwordless sign-in screen: a centered icon badge, a single email field with a helper note beneath it, a send-magic-link button, then a divider and a stack of social provider buttons below, with a sign-up prompt at the bottom.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth6"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth6"
```

This installs the block to `components/beste/block/auth6.tsx` and the `button`, `input`, and `field` shadcn/ui primitives it's built on.

## Quick start

The installed file exports `auth6Demo` alongside the block: the exact props behind the preview above. Spread it to get a working passwordless sign-in screen in one line.

```tsx
import { Auth6, auth6Demo } from "@/components/beste/block/auth6";

export default function SignInPage() {
  return <Auth6 {...auth6Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Sparkles } from "lucide-react";
import { Auth6 } from "@/components/beste/block/auth6";

export default function SignInPage() {
  return (
    <Auth6
      icon={<Sparkles className="size-6" />}
      heading="Sign in with email"
      description="No password needed. We'll email you a secure link to sign in instantly."
      signupPrompt={{ text: "New here?", linkLabel: "Create an account", href: "/sign-up" }}
      labels={{
        email: "Email",
        emailPlaceholder: "you@example.com",
        submit: "Send magic link",
        helper: "The link signs you in with one click and expires in 10 minutes.",
      }}
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
| `socialProviders` | `SocialProvider[]` | `[]` | Buttons rendered below the divider, after the email field |
| `signupPrompt` | `{ text: string; linkLabel: string; href: string }` | – | Line below the card, hidden entirely when not set |
| `labels` | `object` | `{}` | Field, submit, helper, and divider copy, see below |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type SocialProvider = { label: string; icon: React.ReactNode; href?: string };

type Auth6Labels = {
  email?: string;
  emailPlaceholder?: string;
  submit?: string;
  helper?: string;
  divider?: string;
};
```

## Behavior notes

- The layout order is inverted relative to `Auth1`: the email field and submit button come first, and the social providers sit below a divider afterward, matching the "email is primary" framing of a magic-link flow.
- `labels.helper` renders as a `FieldDescription` directly under the email input; it is plain text, not HTML, unlike the `legal` string in other auth blocks.
- The `<form>` only calls `e.preventDefault()` on submit; there is no `onSubmit` prop and no email value is read anywhere in the component (the `Input` is uncontrolled), so the integrator has to wire up both state and the actual magic-link request.
- Social provider buttons render as `asChild` links (`next/link`), not real OAuth triggers; each is just a styled anchor to `provider.href`.

<Callout type="info" title="Wiring the form up">
This block ships the form markup only; state, validation, and submit are yours to add. Our guide wires the shadcn `Field` primitives to [React Hook Form, TanStack Form, and Formisch](/blog/shadcn-forms-react-hook-form-tanstack-formisch) on one field system.
</Callout>
