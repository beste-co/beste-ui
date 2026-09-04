import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "form37",
  title: "Form Autofill",
  description:
    "Name, email and company get typed in one after another behind a caret, then the Continue button spins through a loading state and morphs into an emerald check that says you're in.",
  category: "Form",
  isAnimated: true,
  registryDependencies: ["input"],
};
