import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-date",
  title: "Inspector Date",
  description:
    "Settings row for a date, a time, or both: the row reads the value the way anyone would write it down and opens a real month calendar, while a time on its own keeps the platform's own field inline, since a time has no month to show.",
  category: "Inspector",
  registryDependencies: ["popover", "calendar"],
  usage: `import { InspectorDate } from "@/components/beste/component/inspector-date";

// Uncontrolled. The value is the format the platform uses, which is also what a
// form submits and what new Date() parses.
<InspectorDate label="Publish on" defaultValue="2026-08-01" />

// Controlled
<InspectorDate label="Publish on" value={date} onValueChange={setDate} />

// A time, or both at once
<InspectorDate label="Opens at" mode="time" value={time} onValueChange={setTime} />
<InspectorDate label="Starts" mode="datetime" value={start} onValueChange={setStart} />

<InspectorDate
  label="Deadline"
  icon={CalendarClockIcon}  // optional leading icon; the mode brings its own
  tone="outline"            // "muted" (default) | "outline" | "ghost"
  size="sm"                 // "sm" | "default" | "lg"
  mode="datetime"
  min="2026-01-01T00:00"    // in the same format as the value
  max="2026-12-31T23:59"
  step={900}                // granularity in seconds
  name="deadline"           // takes part in a form
  required
  value={deadline}
  onValueChange={setDeadline}
/>

// The row's reading is deterministic on purpose, so the server and the browser
// agree on it. Bring your own locale where it can only run in one place:
<InspectorDate
  label="Publish on"
  value={date}
  onValueChange={setDate}
  formatValue={(iso) => new Date(iso).toLocaleDateString("tr-TR", { dateStyle: "long" })}
/>

// A clear button inside the panel, and a week that starts on Monday
<InspectorDate label="Publish on" clearable weekStartsOn={1} value={date} onValueChange={setDate} />

// The value is what a form submits, what \`new Date()\` parses, and what comes back
// out, and the calendar never turns it into anything else. Parsing is deliberately not
// \`new Date("2026-08-01")\`: a bare date string is read as UTC midnight, which is the
// evening before anywhere west of Greenwich.`,
};
