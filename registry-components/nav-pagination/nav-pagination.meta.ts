import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "nav-pagination",
  title: "Nav Pagination",
  description:
    "Pagination that never changes width as the reader walks through it: page numbers with ellipses kept to a fixed count, a marker that slides to the current page on a spring, and previous and next arrows that disable at the ends. Press an ellipsis and it opens into a small field to type any page and jump there. An optional page size menu keeps the first row on screen in view when the size changes, and a range readout says 21 to 40 of 312. Pages render as buttons, or as real links through your own router, and a narrow container collapses the numbers into Page 6 of 16.",
  category: "Nav",
  cardScale: 0.7,
  registryDependencies: ["input", "select"],
  usage: `import { NavPagination } from "@/components/beste/component/nav-pagination";

// Buttons, controlled
<NavPagination total={312} pageSize={20} page={page} onPageChange={setPage} />

// Real links through your router, with a page size menu and the range readout
<NavPagination
  total={312}
  page={page}
  pageSize={pageSize}
  pageSizeOptions={[10, 20, 50]}
  onPageSizeChange={setPageSize}
  getHref={(page, size) => \`/releases?page=\${page}&size=\${size}\`}
  renderLink={(props) => <Link {...props} />}
  showRange
/>

// Two pages each side, two at each end, on a filled strip
<NavPagination pageCount={40} siblings={2} boundaries={2} tone="muted" size="lg" />`,
};
