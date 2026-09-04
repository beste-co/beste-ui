/**
 * Fallback usage snippets and tone swatches for the piece and component
 * stages. Plain helpers, no catalogue imports, so either page can pull this in
 * without bundling the other's registry.
 */

export type UsageKind = "piece" | "component";

function pascal(name: string) {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function formatProps(props: Record<string, unknown>, baseIndent = "  "): string {
  return Object.entries(props)
    .filter(([k, v]) => k !== "className" && v !== undefined && v !== null)
    .map(([k, v]) => {
      if (typeof v === "string") return `${baseIndent}${k}="${v.replace(/"/g, '\\"')}"`;
      if (typeof v === "number" || typeof v === "boolean") return `${baseIndent}${k}={${v}}`;
      const json = JSON.stringify(v, null, 2)
        .split("\n")
        .map((line, i) => (i === 0 ? line : `${baseIndent}${line}`))
        .join("\n");
      return `${baseIndent}${k}={${json}}`;
    })
    .join("\n");
}

/** A demo-props dump for items whose meta carries no hand-written snippet. */
export function usageSnippet(kind: UsageKind, name: string, demoProps: Record<string, unknown>) {
  const comp = pascal(name);
  const importLine = `import { ${comp} } from "@/components/beste/${kind}/${name}";`;
  const propsLines = formatProps(demoProps ?? {});
  const jsx = propsLines ? `<${comp}\n${propsLines}\n/>` : `<${comp} />`;
  return `${importLine}\n\n${jsx}`;
}

const TONE_SWATCH: Record<string, string> = {
  primary: "var(--primary)",
  foreground: "var(--foreground)",
  background: "var(--background)",
  muted: "var(--muted-foreground)",
  destructive: "var(--destructive)",
  dark: "var(--foreground)",
  outline: "var(--background)",
  neutral: "var(--background)",
  up: "#10b981",
  down: "#f43f5e",
  flat: "var(--muted-foreground)",
  emerald: "#10b981",
  violet: "#8b5cf6",
  sky: "#0ea5e9",
  indigo: "#6366f1",
  rose: "#f43f5e",
  amber: "#f59e0b",
  pink: "#ec4899",
  mono: "#e4e4e7",
  success: "#10b981",
  warning: "#f59e0b",
  info: "#0ea5e9",
  sunset: "linear-gradient(135deg, #f43f5e, #f97316)",
  ocean: "linear-gradient(135deg, #0ea5e9, #4f46e5)",
  aurora: "linear-gradient(135deg, #8b5cf6, #d946ef, #f43f5e)",
  midnight: "linear-gradient(135deg, #312e81, #0f172a)",
  forest: "linear-gradient(135deg, #059669, #0d9488)",
  gold: "linear-gradient(135deg, #fbbf24, #f97316)",
};

export function toneSwatch(tone: string): string {
  return TONE_SWATCH[tone] ?? "var(--muted-foreground)";
}
