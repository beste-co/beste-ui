import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "time-relative",
  title: "Time Relative",
  description:
    "A relative timestamp that reads \"just now\", \"3 minutes ago\" or \"in 2 days\" in any locale through Intl.RelativeTimeFormat, and keeps itself current on one clock shared by every timestamp on the page: every second under a minute, every minute under an hour, hourly after that, and paused while the tab is hidden. It sits in a real time element with the full date and time on hover, switches to a short date past a threshold, and can reserve the width of the longest wording in its unit so the text beside it never shifts as it ticks. The server renders a stable date and the live wording fades in after mount. Long, short and narrow wording, three tones and three sizes.",
  category: "Time",
  usage: `import { TimeRelative } from "@/components/beste/component/time-relative";

<TimeRelative date={comment.createdAt} />

// In a list: a label before it, a stable width, short wording
<TimeRelative
  date="2026-09-25T18:30:00Z"
  prefix="Edited"
  format="short"          // "long" (default) | "short" | "narrow"
  reserveWidth            // hold the width of "59 min. ago" while it ticks
  threshold={30 * 86400}  // a short date after 30 days
  tone="muted"            // "ghost" (default) | "muted" | "outline"
/>`,
};
