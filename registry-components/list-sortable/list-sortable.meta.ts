import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "list-sortable",
  title: "List Sortable",
  description:
    "A list you reorder by dragging: the row lifts off the page and follows the pointer, the other rows step aside to make room, the list scrolls on its own near a scroll edge, and on drop every row settles into its new place from where it was drawn. On touch a short long press lifts the row, so the list still scrolls under a passing finger. The keyboard does it all too: Space picks a row up, the arrows carry it, Space drops it and Escape puts it back, with every step announced to screen readers. Drag the whole row, or only its grip so the row can hold buttons and links. Controlled or uncontrolled, any item shape, your own row content.",
  category: "List",
  usage: `import { ListSortable } from "@/components/beste/component/list-sortable";

// Controlled, with your own row content
<ListSortable
  items={tracks}
  onReorder={(next) => setTracks(next)}
  getItemLabel={(track) => track.title}
  renderItem={(track, { index }) => (
    <span className="flex flex-1 items-center justify-between">
      <span>{index + 1}. {track.title}</span>
      <span className="text-muted-foreground">{track.length}</span>
    </span>
  )}
/>

// Rows that hold buttons: only the grip drags
<ListSortable
  items={tasks}
  onReorder={setTasks}
  handle
  renderItem={(task) => (
    <>
      <span className="flex-1">{task.name}</span>
      <button onClick={() => console.log("remove", task.id)}>Remove</button>
    </>
  )}
/>

// Plain strings, uncontrolled
<ListSortable defaultItems={["Vocals", "Guitar", "Drums"]} getKey={(item) => item} />`,
};
