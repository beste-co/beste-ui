import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "field-search",
  title: "Field Search",
  description:
    "A search field that does the whole job: `onSearch` fires once typing pauses (and at once on Enter), a shortcut shown as key caps focuses it from anywhere on the page (Command K on a Mac, Control K elsewhere), a spinner takes the search icon's place while results load, and a clear button appears once there is a query. With a `storageKey` it remembers recent searches and offers them in a list while the field is empty, each one removable, with a Clear all; the list is a proper combobox with arrow keys, Enter and Delete. Escape closes the list, then clears the query, then lets go of the field. Built on the shadcn Input.",
  category: "Field",
  registryDependencies: ["input"],
  registryComponents: ["kbd-combo"],
  usage: `import { FieldSearch } from "@/components/beste/component/field-search";

const [loading, setLoading] = useState(false);

<FieldSearch
  placeholder="Search songs and venues"
  storageKey="recent-searches"     // remembers searches on this device
  debounce={300}                   // ms of quiet before onSearch
  loading={loading}
  onSearch={async (query) => {
    setLoading(true);
    console.log("Search", query);
    setLoading(false);
  }}
/>

// No shortcut, no memory, just a field
<FieldSearch shortcut={false} tone="muted" size="sm" onSearch={(query) => console.log(query)} />`,
};
