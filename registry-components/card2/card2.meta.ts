import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card2",
  title: "Pricing Card",
  description:
    "A complete pricing card with feature list, highlighted state, floating badge, and call to action.",
  category: "Card",
  usage: `import { Card2 } from "@/components/beste/component/card2";

// CTA renders a <Link> when href is set, otherwise a <button> using onSelect.
<Card2
  plan="Pro"
  price="$19"
  period="/month"
  description="For freelancers shipping client sites."
  features={["Unlimited projects", "Lifetime updates", "Priority support"]}
  cta="Get started"
  href="/signup"
  highlighted            // accent border + floating badge
  badge="Most popular"   // badge text (default: "Most popular")
  footnote="No credit card required"
/>

<Card2
  plan="Starter"
  price="$0"
  period="/month"
  features={["3 projects", "Community support"]}
  cta="Start free"
  tone="dark"   // CTA: "primary" (default) | "dark"
  onSelect={() => console.log("start free")}
/>`,
};
