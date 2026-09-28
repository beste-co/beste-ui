import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "tour-spotlight",
  title: "Tour Spotlight",
  description:
    "Onboarding coach marks: the page dims around a rounded cutout that frames each step's target, the cutout glides to the next target on a spring and the target scrolls into view, while a step card sits beside it and flips to whichever side has room. Back, next, skip and finish buttons, progress dots you can jump with, arrow keys and Escape, focus held in the card and handed back afterwards. Targets are CSS selectors or refs and are tracked through scrolling and resizing; the tour can dim the whole viewport or only its own box, let clicks through to the target, and be controlled or left to itself.",
  category: "Tour",
  usage: `import { TourSpotlight } from "@/components/beste/component/tour-spotlight";

const steps = [
  { target: "#search", title: "Find anything", body: "Search songs, venues and setlists.", side: "bottom" },
  { target: "#new-setlist", title: "Start a new one", body: "Copied from your last show.", side: "left" },
];

// Over the whole viewport, opened from your own state
<TourSpotlight steps={steps} open={open} onOpenChange={setOpen} onFinish={() => console.log("Tour finished")} />

// Inside a panel: selectors are searched in the children and only this box is dimmed
<TourSpotlight steps={steps} contained defaultOpen launcherLabel="Replay the tour">
  <Dashboard />
</TourSpotlight>

<TourSpotlight
  steps={steps}
  allowTargetClick          // clicks pass through the cutout
  closeOnOverlayClick       // clicking the dimmed area skips
  dim={0.4}
  labels={{ next: "Continue", finish: "Got it" }}
/>`,
};
