"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RegistryFlavorSelect,
  useFlavoredSource,
  useRegistryFlavor,
} from "@/components/registry-flavor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pieceInstallCommand, withFlavor } from "@/lib/install-command";
import { useEffect, useState } from "react";

import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { ThemedPreview } from "@/components/theme/themed-preview";
import { DOCS_INSTALLATION_HREF, hostedLinkProps } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { components } from "@/lib/components";

interface ComponentShowcaseProps {
  name: string;
  source: string;
  variant?: "dialog" | "page";
  className?: string;
}

type PackageManager = "npx" | "pnpm" | "yarn" | "bun";

const PM_LABELS: Record<PackageManager, string> = {
  npx: "npm",
  pnpm: "pnpm",
  yarn: "yarn",
  bun: "bun",
};

const PM_ICONS: Record<PackageManager, string> = {
  npx: "https://oud.pics/sm/l/npm.svg",
  pnpm: "https://oud.pics/sm/l/pnpm.svg",
  yarn: "https://oud.pics/sm/l/yarn.svg",
  bun: "https://oud.pics/sm/l/bun.svg",
};

const PM_ORDER: PackageManager[] = ["npx", "bun", "pnpm", "yarn"];

function UsageCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-base text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={copied ? "Copied" : "Copy usage snippet"}
    >
      {copied ? (
        <>
          <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} className="text-emerald-600" aria-hidden="true" />
          Copied!
        </>
      ) : (
        <>
          <HugeiconsIcon icon={Copy01Icon} size={14} strokeWidth={2} aria-hidden="true" />
          Copy
        </>
      )}
    </button>
  );
}

function getCommandForPackageManager(command: string, pm: PackageManager): string {
  if (!command.startsWith("npx ")) return command;
  const rest = command.slice(4);
  switch (pm) {
    case "npx":
      return command;
    case "pnpm":
      return `pnpm dlx ${rest}`;
    case "yarn":
      return `yarn ${rest}`;
    case "bun":
      return `bunx --bun ${rest}`;
    default:
      return command;
  }
}

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

function toneSwatch(tone: string): string {
  return TONE_SWATCH[tone] ?? "var(--muted-foreground)";
}

function usageSnippet(name: string, demoProps: Record<string, unknown>) {
  const comp = pascal(name);
  const importLine = `import { ${comp} } from "@/components/beste/piece/${name}";`;
  const propsLines = formatProps(demoProps ?? {});
  const jsx = propsLines ? `<${comp}\n${propsLines}\n/>` : `<${comp} />`;
  return `${importLine}\n\n${jsx}`;
}

export function ComponentShowcase({
  name,
  source,
  variant = "dialog",
  className,
}: ComponentShowcaseProps) {
  const [pm, setPm] = useState<PackageManager>("npx");
  const [flavor, setFlavor] = useRegistryFlavor();
  const flavoredSource = useFlavoredSource("piece", name, flavor, source);
  const [copied, setCopied] = useState(false);
  const [toneOverride, setToneOverride] = useState<string | undefined>(undefined);

  // Reset tone override when the component changes
  useEffect(() => {
    setToneOverride(undefined);
  }, [name]);

  const entry = components.find((c) => c.name === name);
  const entryIndex = components.findIndex((c) => c.name === name);
  if (!entry || entryIndex === -1) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-base text-muted-foreground">
        Component &quot;{name}&quot; not found.
      </div>
    );
  }

  const Component = entry.component;
  const baseCli = withFlavor(pieceInstallCommand(name), flavor);
  const displayCli = getCommandForPackageManager(baseCli, pm);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayCli);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write can fail in insecure contexts — fail silently.
    }
  };
  const tones = entry.variants?.tone;
  const activeTone = toneOverride ?? (entry.demoProps?.tone as string | undefined);
  const livePreviewProps = tones ? { ...entry.demoProps, tone: activeTone } : entry.demoProps;
  // Prefer the hand-written snippet from the meta (documents the full props
  // API); fall back to a demo-props dump for pieces without one.
  const usage =
    (flavor === "base" ? (entry.usageBase ?? entry.usage) : entry.usage) ??
    usageSnippet(name, livePreviewProps ?? {});
  const isPage = variant === "page";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:gap-6",
        isPage ? "md:h-[380px]" : "md:h-[460px]",
        className
      )}
    >
      {/* Left column: preview (+ prev/next below, in dialog only) */}
      <div className="flex flex-col gap-3 md:min-w-0 md:flex-1">
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border",
            isPage ? "h-[360px] md:h-full" : "h-[240px] md:flex-1 md:min-h-0"
          )}
        >
          <ThemedPreview className="relative size-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            />
            <div className="relative flex size-full items-center justify-center">
              <Component {...livePreviewProps} />
            </div>
          </ThemedPreview>
        </div>
      </div>

      {/* Tabs pane */}
      <div className="flex min-h-0 flex-col md:min-w-0 md:flex-1">
        <Tabs defaultValue="cli" className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-2">
            <TabsList className="h-11 w-fit rounded-full bg-muted/60 p-1">
              <TabsTrigger value="cli" className="cursor-pointer rounded-full px-4 text-base data-[state=active]:bg-background">
                CLI
              </TabsTrigger>
              <TabsTrigger value="code" className="cursor-pointer rounded-full px-4 text-base data-[state=active]:bg-background">
                Code
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <RegistryFlavorSelect flavor={flavor} onChange={setFlavor} />
              {tones && tones.length > 0 && (
                <Select value={activeTone} onValueChange={(v) => setToneOverride(v)}>
                  {/* Both the trigger and the rows: the primitive ships
                      `cursor-default`, which on a menu reads as "not clickable". */}
                  <SelectTrigger className="h-11 w-36 cursor-pointer rounded-full border-0 bg-muted/60 text-base shadow-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50">
                    <SelectValue placeholder="Tone" />
                  </SelectTrigger>
                  <SelectContent align="end" className="rounded-xl">
                    {tones.map((t) => (
                      <SelectItem key={t} value={t} className="cursor-pointer text-base">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-3 shrink-0 rounded-full border border-border"
                            style={{ background: toneSwatch(t) }}
                            aria-hidden="true"
                          />
                          <span className="capitalize">{t}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <TabsContent value="cli" className="mt-4 flex min-h-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-2">
              {/* The command and the package manager that writes it, in one
                  filled pill — the same control the block pages carry. */}
              <div className="flex h-11 min-w-0 items-center rounded-full bg-muted/60 pl-1 text-base">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    aria-label={`Select package manager (current: ${PM_LABELS[pm]})`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PM_ICONS[pm]}
                      alt=""
                      aria-hidden="true"
                      className="h-4 w-4 rounded-full"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-36 rounded-xl">
                    {PM_ORDER.map((key) => (
                      <DropdownMenuItem
                        key={key}
                        onSelect={() => setPm(key)}
                        className={cn("cursor-pointer text-base", pm === key && "bg-muted")}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={PM_ICONS[key]}
                          alt=""
                          aria-hidden="true"
                          className="h-4 w-4 rounded-full"
                        />
                        {PM_LABELS[key]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-full px-3 transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  aria-label={copied ? "Copied" : "Copy install command"}
                >
                  <code className="min-w-0 flex-1 select-none overflow-hidden text-ellipsis whitespace-nowrap text-left font-mono">
                    {copied ? "Copied!" : displayCli}
                  </code>
                  {copied && (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
              {/*
                A footnote, sized and toned like one. The setup steps live on one
                page rather than being repeated under every piece: repeating the
                init command means correcting it in a hundred files the day the
                CLI changes, and it says nothing about the parts of setup that do
                not fit on a line.
              */}
              <p className="text-sm text-foreground/50">
                New here? Read the{" "}
                <Link
                  href={DOCS_INSTALLATION_HREF}
                  {...hostedLinkProps}
                  className="underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  installation guide
                </Link>
                .
              </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-semibold text-card-foreground">
                  Import &amp; use
                </span>
                <UsageCopyButton code={usage} />
              </div>
              {/* No border: the block paints its own `bg-muted`, so a frame around
                  it was a line drawn on a surface that already had an edge. */}
              <div
                className={cn(
                  "overflow-hidden rounded-md",
                  isPage ? "h-[220px] md:h-[202px]" : "h-[260px] md:h-[256px]"
                )}
              >
                <CodeBlock code={usage} language="tsx" hideCopy />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="code"
            className="mt-4 flex min-h-0 flex-1 overflow-hidden rounded-md"
          >
            <div
              className={cn("w-full", isPage ? "h-[380px] md:h-[316px]" : "h-[400px] md:h-[396px]")}
            >
              <CodeBlock code={flavoredSource ?? source} language="tsx" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
