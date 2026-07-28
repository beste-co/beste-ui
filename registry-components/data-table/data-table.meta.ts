import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "data-table",
  componentName: "DataTable",
  title: "Data Table",
  description:
    "Client-side data-table engine: column-driven config with custom cell renderers, sortable headers, keyword search, row selection, per-row action menus, and pagination. Owns all state; blocks pass columns + rows as data.",
  category: "Dashboard",
  registryDependencies: [
    "table",
    "input",
    "button",
    "badge",
    "avatar",
    "checkbox",
    "dropdown-menu",
  ],
  usage: `import { DataTable, type DataTableColumn } from "@/components/beste/component/data-table";
import { Eye, Trash2 } from "lucide-react";

type Row = { id: string; name: string; spend: number };

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", sortable: true, value: (r) => r.name },
  { id: "spend", header: "Spend", sortable: true, align: "right", value: (r) => r.spend },
];

<DataTable
  columns={columns}
  data={rows}
  searchable
  selectable
  pageSize={8}
  rowActions={[
    { id: "view", label: "View", icon: Eye },
    { id: "delete", label: "Delete", icon: Trash2, destructive: true },
  ]}
  onRowAction={(action, row) => console.log(action, row.id)}
/>`,
};
