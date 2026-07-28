import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button3",
  title: "Async Loading Button",
  description:
    "An async loading button that shows a spinner and disables itself while a promise resolves.",
  category: "Button",
  usage: `import { Button3 } from "@/components/beste/component/button3";

// Return a promise from onClick and the button handles loading itself:
// spinner + loadingLabel + disabled until the promise settles.
<Button3
  label="Create account"
  loadingLabel="Creating account..."
  tone="primary"   // "dark" (default) | "primary" | "outline"
  type="submit"    // "button" (default) | "submit"
  onClick={async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("account created");
  }}
/>

// Or drive it yourself with your own state:
// <Button3 label="Save changes" loading={isSaving} />`,
};
