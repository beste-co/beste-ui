import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "confirm-slide",
  title: "Confirm Slide",
  description:
    "A slide-to-confirm track for actions that should not happen by accident: the thumb follows the pointer continuously, the label fades as it travels while a soft light runs across the label at rest, and letting go before the end springs the thumb back. Reaching the end, or flicking past halfway, morphs the thumb into a check that draws itself in, swaps the label, fires onConfirm and resets on its own or stays confirmed. It is a real slider for assistive technology: holding the Right arrow slides it through, while End, Enter or Space complete at once. The track is never narrower than its longest label. Destructive or default tone, three sizes, custom thumb icon, and controlled or uncontrolled confirmed state.",
  category: "Confirm",
  usage: `import { ConfirmSlide } from "@/components/beste/component/confirm-slide";

<ConfirmSlide
  className="w-full max-w-sm"
  label="Slide to delete the album"
  confirmedLabel="Album deleted"
  tone="destructive"
  onConfirm={() => console.log("Deleted")}
/>

<ConfirmSlide
  label="Slide to publish"
  resetAfter={null}      // stay confirmed
  size="lg"              // "sm" | "default" | "lg"
/>`,
};
