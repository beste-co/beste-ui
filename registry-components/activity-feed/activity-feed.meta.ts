import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "activity-feed",
  title: "Activity Feed",
  description:
    "An activity timeline: events grouped by day under sticky headers (Today, Yesterday, then dates written in the reader's locale), each on a vertical rail with a tinted icon node, the actor, what they did and what it happened to. Relative times (3 min ago) keep themselves current from one shared clock that pauses on hidden tabs, and render only after mount so the server and the browser never disagree. Details open under an event with a smooth height animation, new events slide in at the top, and a Load more button stays busy while its promise runs. Three tones, three sizes, controlled or uncontrolled details.",
  category: "Activity",
  usage: `import { MessageSquare, Upload } from "lucide-react";
import { ActivityFeed } from "@/components/beste/component/activity-feed";

<ActivityFeed
  events={[
    {
      id: "1",
      actor: { name: "Hania Rani" },
      action: "uploaded",
      target: "Esja (piano take 4).wav",
      time: "2026-09-27T09:41:00Z",
      icon: Upload,
      tone: "info",                 // "neutral" | "info" | "success" | "warning" | "danger"
      detail: "48 kHz, 24 bit, 6 min 12 s.",
    },
    { id: "2", actor: { name: "Nils Frahm" }, action: "commented on", target: "Says, mix 7", time: Date.now() - 60_000, icon: MessageSquare },
  ]}
  hasMore
  onLoadMore={async () => console.log("fetch the next page")}
  locale="en-GB"
  tone="outline"                    // "muted" | "outline" | "ghost" (default)
  className="max-h-96 overflow-y-auto"  // a scroll area makes the day headers stick
/>`,
};
