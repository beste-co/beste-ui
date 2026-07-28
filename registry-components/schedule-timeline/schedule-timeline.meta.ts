import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "schedule-timeline",
  componentName: "ScheduleTimeline",
  title: "Schedule Timeline",
  description:
    "A Gantt-style day timeline: resource rows against an hour axis with time-positioned event bars (left/width computed from start/end), grid lines, a live 'now' marker, colored tones, and clickable bars with a hover tooltip showing the event and its time range. Ideal for room bookings, shifts, and resource scheduling.",
  category: "Dashboard",
  registryDependencies: ["tooltip"],
  usage: `import { ScheduleTimeline } from "@/components/beste/component/schedule-timeline";

<ScheduleTimeline
  dayStart={8}
  dayEnd={18}
  step={2}
  nowAt={11.5}
  rows={[
    {
      id: "loft",
      label: "Atrium Loft",
      sublabel: "Floor 3 · 12 seats",
      events: [
        { id: "a1", label: "Planning sync", start: 9, end: 11, tone: "primary" },
        { id: "a2", label: "Design review", start: 14, end: 15.5, tone: "emerald" },
      ],
    },
  ]}
  onEventClick={(rowId, eventId) => console.log(rowId, eventId)}
/>`,
};
