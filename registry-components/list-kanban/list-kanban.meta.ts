import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "list-kanban",
  title: "List Kanban",
  description:
    "A kanban board: cards dragged within and between columns. The card lifts into a floating ghost that tilts slightly and follows the pointer, a dashed slot shows where it will land while the other cards make room on a spring; on drop the card settles from the ghost into its slot. The board scrolls sideways near its edges and tall columns scroll on their own. On touch a short long press lifts a card, so the board still scrolls under a passing finger. The keyboard does it all too: Space picks a card up, the up and down arrows move it within a column, left and right carry it between columns, Space drops it and Escape puts it back, with every step announced. Columns take a color dot and a work-in-progress limit that tints the header when exceeded. Controlled or uncontrolled, any card shape, your own card content.",
  category: "List",
  cardScale: 0.5,
  usage: `import { ListKanban, type KanbanColumn } from "@/components/beste/component/list-kanban";

type Task = { id: string; title: string };

const [columns, setColumns] = useState<KanbanColumn<Task>[]>([
  { id: "todo", title: "To do", color: "#a1a1aa", cards: [{ id: "t1", title: "Mix the live album" }] },
  { id: "doing", title: "Doing", color: "#f59e0b", limit: 2, cards: [] },
  { id: "done", title: "Done", color: "#10b981", cards: [] },
]);

<ListKanban
  columns={columns}
  onChange={(next, move) => {
    setColumns(next);
    console.log("moved", move.card.title, "to", move.to.column);
  }}
  getCardLabel={(task) => task.title}
  renderCard={(task) => <span className="font-medium">{task.title}</span>}
  maxHeight="24rem"        // a column's list scrolls past this
  tone="outline"           // "muted" (default) | "outline" | "ghost"
/>`,
};
