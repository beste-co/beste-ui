import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "time-countdown",
  title: "Time Countdown",
  description:
    "A countdown to a date or through a duration, drawn as unit tiles whose digits roll down on the beat of each second, 9 wrapping cleanly from 0. Units are chosen per use and leading zero units can drop away, labels come from the locale in long, short or narrow form, and a message can replace the digits when time is up. It renders a stable placeholder on the server, pauses while the tab is hidden, announces the time left once a minute rather than every second, and fires onComplete once. Three tones and three sizes.",
  category: "Time",
  usage: `import { TimeCountdown } from "@/components/beste/component/time-countdown";

<TimeCountdown target="2026-12-31T23:59:59Z" />

// Minutes and seconds only, as a clock with colons
<TimeCountdown duration={15 * 60} units={["minutes", "seconds"]} separator labels="none" />

<TimeCountdown
  target={launchDate}
  hideLeadingZeros          // days disappear once under a day is left
  labels="short"            // "long" (default) | "short" | "narrow" | "none"
  locale="de-DE"
  completeLabel="We are live"
  onComplete={() => console.log("Launched")}
  tone="outline"            // "muted" (default) | "outline" | "ghost"
  size="lg"                 // "sm" | "default" | "lg"
/>`,
};
