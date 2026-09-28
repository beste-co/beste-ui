import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "steps-checklist",
  title: "Steps Checklist",
  description:
    "An onboarding checklist card: a ring beside the title fills as items are checked and reads \"3 of 5 done\", the next open item is highlighted with its description and an action button or link, and finished items fold to a single struck-through line while a check draws itself in their box. When every item is done the ring completes in green with a check, the title cross-fades to a finished one and an optional Dismiss button appears. The whole list collapses under its header, completion can be controlled or left to the card, and each item is a real checkbox for keyboards and screen readers.",
  category: "Steps",
  usage: `import { StepsChecklist } from "@/components/beste/component/steps-checklist";

<StepsChecklist
  title="Set up your workspace"
  items={[
    { id: "profile", title: "Complete your profile", description: "A photo and a short bio." },
    { id: "invite", title: "Invite the band", action: { label: "Invite", href: "/invite" } },
    { id: "first", title: "Publish the first page", action: { label: "Open the editor", onClick: () => console.log("open") } },
  ]}
  defaultCompleted={["profile"]}
  onToggle={(id, done) => console.log(id, done)}
  finishedDescription="Your workspace is ready."
  onDismiss={() => console.log("dismissed")}
  tone="muted"          // "muted" | "outline" (default) | "ghost"
  size="sm"             // "sm" | "default" | "lg"
/>`,
};
