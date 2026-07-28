import type { ComponentPropRow } from "@/lib/component-props";
import { cn } from "@/lib/utils";

interface ComponentPropsTableProps {
  rows: ComponentPropRow[];
  className?: string;
}

/**
 * The component's props, read out of its own source at render time rather than
 * written here. A table kept by hand is a table that disagrees with the code within a
 * release or two, and a reader who catches it once stops trusting the rest of it.
 */
export function ComponentPropsTable({ rows, className }: ComponentPropsTableProps) {
  if (rows.length === 0) return null;

  return (
    <section id="props" className={cn("flex scroll-mt-8 flex-col gap-4", className)}>
      <div>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight">Props</h2>
        <p className="mt-2 text-lg text-foreground/70">
          Read from the component's own type, so this cannot drift from what it accepts.
        </p>
      </div>

      {/* The table scrolls inside its own box: a long union in the type column must
          not be allowed to widen the page. */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-left text-base">
          <thead>
            <tr className="border-b bg-muted/50">
              <th scope="col" className="px-3 py-2.5 font-medium">
                Prop
              </th>
              <th scope="col" className="px-3 py-2.5 font-medium">
                Type
              </th>
              <th scope="col" className="px-3 py-2.5 font-medium">
                Default
              </th>
              <th scope="col" className="px-3 py-2.5 font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b last:border-0 align-top">
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <code className="font-mono text-base text-foreground">{row.name}</code>
                  {row.required ? (
                    <span role="img" aria-label="required" title="Required" className="ml-1 text-destructive">
                      *
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-2.5">
                  <code className="font-mono text-base break-words text-foreground/70">
                    {row.type}
                  </code>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  {row.defaultValue ? (
                    <code className="font-mono text-base text-foreground/70">
                      {row.defaultValue}
                    </code>
                  ) : (
                    <span className="text-foreground/70">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-foreground/70">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
