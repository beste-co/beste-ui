import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "calendar-month",
  componentName: "CalendarMonth",
  title: "Calendar Month",
  description:
    "A month grid with selectable days, a today marker, colored event dots per day, and prev/next month controls. Data-driven (weekStart + daysInMonth) so it renders deterministically; controlled or self-managed selection.",
  category: "Dashboard",
  registryDependencies: [],
  usage: `import { CalendarMonth } from "@/components/beste/component/calendar-month";

<CalendarMonth
  monthLabel="January 2026"
  weekStart={4}
  daysInMonth={31}
  today={20}
  defaultSelectedDay={21}
  events={[
    { day: 12, tone: "emerald" },
    { day: 22, tone: "primary" },
  ]}
  onSelectDay={(day) => console.log("day:", day)}
/>`,
};
