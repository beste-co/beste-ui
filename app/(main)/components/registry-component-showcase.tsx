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
import { componentInstallCommand, withFlavor } from "@/lib/install-command";
import { useEffect, useState } from "react";

import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { FitScale } from "@/components/fit-scale";
import { FRAME_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { ThemedPreview } from "@/components/theme/themed-preview";
import { DOCS_INSTALLATION_HREF, hostedLinkProps } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { registryComponents } from "@/lib/registry-components";

interface RegistryComponentShowcaseProps {
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
  const importLine = `import { ${comp} } from "@/components/beste/component/${name}";`;
  const propsLines = formatProps(demoProps ?? {});
  const jsx = propsLines ? `<${comp}\n${propsLines}\n/>` : `<${comp} />`;
  return `${importLine}\n\n${jsx}`;
}

export function RegistryComponentShowcase({
  name,
  source,
  variant = "dialog",
  className,
}: RegistryComponentShowcaseProps) {
  const [pm, setPm] = useState<PackageManager>("npx");
  const [flavor, setFlavor] = useRegistryFlavor();
  const flavoredSource = useFlavoredSource("component", name, flavor, source);
  const [copied, setCopied] = useState(false);
  const [toneOverride, setToneOverride] = useState<string | undefined>(undefined);
  /** Which of the two the documentation layout is showing. */
  const [view, setView] = useState("preview");

  // Reset tone override when the component changes
  useEffect(() => {
    setToneOverride(undefined);
  }, [name]);

  const entry = registryComponents.find((c) => c.name === name);
  if (!entry) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-base text-muted-foreground">
        Component &quot;{name}&quot; not found.
      </div>
    );
  }

  const Component = entry.component;
  const baseCli = withFlavor(componentInstallCommand(name), flavor);
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
  // Fall back to the first tone in the union — components default to it.
  const activeTone = toneOverride ?? (entry.demoProps?.tone as string | undefined) ?? tones?.[0];
  const livePreviewProps = tones ? { ...entry.demoProps, tone: activeTone } : entry.demoProps;
  // Prefer the hand-written snippet from the meta (documents the full props
  // API); fall back to a demo-props dump for components without one. With the
  // Base UI flavor active, show the base snippet when the meta provides one.
  const usage =
    (flavor === "base" ? (entry.usageBase ?? entry.usage) : entry.usage) ??
    usageSnippet(name, livePreviewProps ?? {});
  const isPage = variant === "page";
  /*
   * Cards and dashboard panels are drawn at a size a settings row never is, so
   * the stage scales them down instead of clipping them. Everything else renders
   * at its natural size, which is what a button or a badge wants.
   */
  const fitToStage = FRAME_PREVIEW_CATEGORIES.has(entry.category);

  /*
   * The documentation layout, which is a different thing from the dialog's.
   *
   * A dialog has one screenful and has to put the preview and the code side by side.
   * A page does not, and cramming them into two columns there was what made these
   * pages read as thin: the preview ended up half-width, the install command sat in a
   * tab beside it as if it were an alternative to looking at the component, and the
   * usage snippet had to fit whatever height was left. Stacked, each part gets the
   * width it needs and the page reads in the order the reader works: see it, install
   * it, use it.
   */
  if (isPage) {
    return (
      <div className={cn("flex flex-col gap-10", className)}>
        {/* The ids are what the page's side rail points at. Scroll margin so a
            heading lands clear of the top of the window rather than against it. */}
        <section id="preview" className="flex scroll-mt-8 flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Tabs value={view} onValueChange={setView} className="w-fit">
              <TabsList className="h-11 w-fit rounded-full bg-muted/60 p-1">
                <TabsTrigger value="preview" className="cursor-pointer rounded-full px-4 text-base data-[state=active]:bg-background">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="cursor-pointer rounded-full px-4 text-base data-[state=active]:bg-background">
                  Code
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
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

          {view === "preview" ? (
            <div className="relative h-[560px] overflow-hidden rounded-xl border">
              <ThemedPreview className="relative size-full">
                {/*
                  Large surfaces — a card, a dashboard panel — are scaled to fit
                  rather than moved into an iframe of their own. They used to get a
                  separate showcase for that, which meant two different pages
                  depending on which category a component happened to be in; one
                  stage that knows how to shrink is the cheaper answer.
                */}
                <div className="relative flex size-full items-center justify-center p-8">
                  {fitToStage ? (
                    <FitScale className="size-full" padding={0}>
                      <Component {...livePreviewProps} />
                    </FitScale>
                  ) : (
                    <Component {...livePreviewProps} />
                  )}
                </div>
              </ThemedPreview>
            </div>
          ) : (
            // The same height either way, so switching tabs does not move the page
            // under the reader.
            <div className="h-[560px] overflow-hidden rounded-xl border">
              <CodeBlock code={flavoredSource ?? source} language="tsx" />
            </div>
          )}
        </section>

        <section id="installation" className="flex scroll-mt-8 flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight">Installation</h2>
            <p className="mt-2 text-lg text-foreground/70">
              Adds the component and everything it depends on to your project.
            </p>
          </div>

          {/*
            The package managers are tabs rather than a dropdown here: on a page
            there is room to show that the choice exists, and a reader who uses pnpm
            should not have to open a menu to find out this page knows about pnpm.
          */}
          {/*
            Both of the things that decide what the command below says, on one line:
            which package manager runs it, and which flavour it installs. The flavour
            sat over the preview before, where it read as a way of looking at the
            component rather than a choice about what lands in the project.
          */}
          <div className="flex items-center justify-between gap-2">
            <Tabs value={pm} onValueChange={(value) => setPm(value as PackageManager)}>
              <TabsList className="h-11 w-fit rounded-full bg-muted/60 p-1">
                {PM_ORDER.map((key) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="cursor-pointer gap-1.5 rounded-full px-4 text-base data-[state=active]:bg-background"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PM_ICONS[key]}
                      alt=""
                      aria-hidden="true"
                      className="size-3.5 rounded-full"
                    />
                    {PM_LABELS[key]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <RegistryFlavorSelect flavor={flavor} onChange={setFlavor} />
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/60 px-3 py-2.5">
            <code className="min-w-0 flex-1 overflow-x-auto font-mono text-base whitespace-nowrap">
              {displayCli}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy install command"}
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {copied ? (
                <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} className="text-emerald-600" aria-hidden="true" />
              ) : (
                <HugeiconsIcon icon={Copy01Icon} size={14} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>

          {/*
            The prerequisites are one page, kept in one place. Repeating the init
            command under every component means correcting it in a hundred files the
            day the CLI changes, and it says nothing about the parts of setup that
            do not fit on a line.
          */}
          {/* A footnote, sized and toned like one: the command above is the thing to
              read, and this only matters to a reader whose project is not set up. */}
          <p className="-mt-1 text-sm text-foreground/50">
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
        </section>

        <section id="usage" className="flex scroll-mt-8 flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight">Usage</h2>
            <p className="mt-2 text-lg text-foreground/70">
              The import and the props worth knowing about, in one place.
            </p>
          </div>
          {/* No border: the block paints its own `bg-muted`, so a frame around it was
              a line drawn on top of a surface that already had an edge.

              Cut off at a screenful: the usage for a component with a dozen props
              runs long enough to bury the sections under it, and most readers want
              the import and the first example rather than all of it. */}
          <div className="overflow-hidden rounded-lg">
            <CodeBlock code={usage} language="tsx" fit collapsedHeight={440} />
          </div>
        </section>
      </div>
    );
  }

  // Only the dialog gets here; the page returned above. Its panes share a fixed
  // height, so the code column scrolls rather than growing the dialog.
  const fill = "min-h-0 flex-1";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:gap-6",
        // items-start so the left preview keeps a fixed height while the right
        // code column grows; they no longer stretch to match each other.
        "md:h-[460px]",
        className
      )}
    >
      {/* Left column: preview */}
      <div className="flex flex-col gap-3 md:min-w-0 md:flex-1">
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border",
            "h-[240px] md:flex-1 md:min-h-0"
          )}
        >
          <ThemedPreview className="relative size-full">
            <div className="relative flex size-full items-center justify-center">
              <Component {...livePreviewProps} />
            </div>
          </ThemedPreview>
        </div>
      </div>

      {/* Tabs pane */}
      <div className="flex min-h-0 flex-col md:min-w-0 md:flex-1">
        <Tabs defaultValue="cli" className={cn("flex flex-col", fill)}>
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

          <TabsContent value="cli" className={cn("mt-4 flex flex-col gap-4", fill)}>
            <div className="flex flex-col gap-2">
              <div className="flex min-w-0 items-center rounded-md border bg-background text-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex cursor-pointer items-center rounded-l-md px-2 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <DropdownMenuContent align="start" className="w-32">
                    {PM_ORDER.map((key) => (
                      <DropdownMenuItem
                        key={key}
                        onSelect={() => setPm(key)}
                        className={pm === key ? "bg-muted" : ""}
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
                <div className="h-5 w-px bg-border" />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-r-md px-3 py-2 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={copied ? "Copied" : "Copy install command"}
                >
                  <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left font-mono select-none">
                    {copied ? "Copied!" : displayCli}
                  </code>
                  {copied && (
                    <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} className="shrink-0 text-emerald-600" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Requires shadcn/ui initialized. Run{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">npx shadcn@latest init</code>{" "}
                if you haven&apos;t.
              </p>
            </div>

            <div className={cn("flex flex-col gap-2", fill)}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-semibold text-card-foreground">
                  Import &amp; use
                </span>
                <UsageCopyButton code={usage} />
              </div>
              <div
                className={cn(
                  "rounded-md border",
                  "overflow-hidden h-[260px] md:h-[256px]"
                )}
              >
                <CodeBlock code={usage} language="tsx" hideCopy />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="code"
            className={cn("mt-4 flex overflow-hidden rounded-md border", fill)}
          >
            <div
              className={cn("w-full", "h-[400px] md:h-[396px]")}
            >
              <CodeBlock code={flavoredSource ?? source} language="tsx" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
