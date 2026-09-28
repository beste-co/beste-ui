import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "pager-dots",
  title: "Pager Dots",
  description:
    "Slide dots for carousels and stories: the active dot stretches into a pill on a spring, and with a duration the pill fills as its page plays, then autoplay moves on. Autoplay pauses under the pointer, on keyboard focus, on a hidden tab and offscreen, and toggling it never restarts the fill. Long sets slide a window along the dots and shrink the ones at its edges, the way story apps do. It is a tablist: one tab stop, arrow keys, Home and End. Row or column, three sizes, and a bare tone that takes the text color for use over a photo.",
  category: "Pager",
  usage: `import { PagerDots } from "@/components/beste/component/pager-dots";

// A plain indicator driven by your carousel
<PagerDots count={5} value={slide} onValueChange={setSlide} />

// Stories: each page plays for 5 seconds, then moves on
<PagerDots
  count={12}
  duration={5000}
  value={slide}
  onValueChange={setSlide}
  onCycleEnd={(index) => console.log("finished", index)}
/>

// Over a photo: bare, white, with its own pause switch
<PagerDots
  count={8}
  duration={4000}
  playing={playing}
  tone="ghost"
  className="text-white"
  getControls={(index) => \`slide-\${index}\`}
/>`,
};
