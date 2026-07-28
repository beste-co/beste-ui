# Auth1: Centered Sign In Card

Single-column sign-in screen centered in the viewport: a stack of social provider buttons above a divider, then email and password fields (with a show/hide toggle on the password), a forgot-password link, a remember-me checkbox, and a submit button, all inside one bordered card.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth1"
```

This installs the block to `components/beste/block/auth1.tsx` and the `button`, `input`, `field`, and `checkbox` shadcn/ui primitives it's built on.

## Quick start

The installed file exports `auth1Demo` alongside the block: the exact props behind the preview above. Spread it to get a working sign-in screen in one line.

```tsx
import { Auth1, auth1Demo } from "@/components/beste/block/auth1";

export default function SignInPage() {
  return <Auth1 {...auth1Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Auth1 } from "@/components/beste/block/auth1";

export default function SignInPage() {
  return (
    <Auth1
      heading="Welcome back"
      description="Sign in to your account to continue"
      forgotPasswordLink={{ label: "Forgot password?", href: "/forgot-password" }}
      signupPrompt={{ text: "Don't have an account?", linkLabel: "Sign up", href: "/sign-up" }}
      labels={{
        email: "Email",
        emailPlaceholder: "you@example.com",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        rememberMe: "Remember me",
        submit: "Sign in",
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Screen title above the card |
| `description` | `string` | – | Subtext below the heading |
| `socialProviders` | `SocialProvider[]` | `[]` | Buttons rendered above the divider |
| `forgotPasswordLink` | `{ label: string; href: string }` | – | Link shown at the right of the password field label |
| `signupPrompt` | `{ text: string; linkLabel: string; href: string }` | – | Line below the card, hidden entirely when not set |
| `labels` | `object` | `{}` | Field/button copy, see below |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type SocialProvider = { label: string; icon: React.ReactNode; href?: string };

type Auth1Labels = {
  divider?: string;
  email?: string;
  emailPlaceholder?: string;
  password?: string;
  passwordPlaceholder?: string;
  rememberMe?: string;
  submit?: string;
  legal?: string;
  passwordToggle?: string;
};
```

## Behavior notes

- The `<form>` only calls `e.preventDefault()` on submit; there is no `onSubmit` prop and no wired network call, so the integrator has to add their own submit handler before this authenticates anything.
- The password field's show/hide toggle is local `useState`, a `type="button"` icon button that swaps `Eye`/`EyeOff` and toggles the input's `type` between `password` and `text`.
- Several rows only render when their label is present rather than through a separate boolean prop: the remember-me checkbox appears only if `labels.rememberMe` is set, the divider only if `labels.divider` is set, and the submit button only if `labels.submit` is set.
- `labels.legal` is injected as raw HTML via `dangerouslySetInnerHTML`, so it can contain an inline `<a>` (the demo links "Terms of Service" and "Privacy Policy" this way) rather than a separate link-array prop.
- Social provider buttons render as `asChild` links (`next/link`), not real OAuth triggers; each is just a styled anchor to `provider.href`.

<Callout type="info" title="Wiring the form up">
This block ships the form markup only; state, validation, and submit are yours to add. Our guide wires the shadcn `Field` primitives to [React Hook Form, TanStack Form, and Formisch](/blog/shadcn-forms-react-hook-form-tanstack-formisch) on one field system.
</Callout>
