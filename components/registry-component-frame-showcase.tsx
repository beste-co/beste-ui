"use client";

import { ComputerIcon, SmartPhone01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import {
  RegistryFlavorSelect,
  useFlavoredSource,
  useRegistryFlavor,
} from "@/components/registry-flavor";
import { IconButton } from "@/components/icon-button";
import { ICON_ACTION_CLASS } from "@/components/icon-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { componentInstallCommand, withFlavor } from "@/lib/install-command";
import { getRegistryComponent } from "@/lib/registry-components";
import { cn } from "@/lib/utils";

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

function toPackageManager(command: string, pm: PackageManager): string {
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

interface RegistryComponentFrameShowcaseProps {
  name: string;
  /** Full source code. Undefined = still loading. */
  source?: string;
  variant?: "dialog" | "page";
  className?: string;
}

/**
 * Blocks-style showcase for large-surface registry components (see
 * FRAME_PREVIEW_CATEGORIES): the demo renders at real size inside an iframe
 * with View/Code/Usage tabs, install command, viewport toggle, and tone
 * picker.
 */
export function RegistryComponentFrameShowcase({
  name,
  source,
  variant = "page",
  className,
}: RegistryComponentFrameShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"view" | "code" | "usage">("view");
  const [pm, setPm] = useState<PackageManager>("npx");
  const [flavor, setFlavor] = useRegistryFlavor();
  const flavoredSource = useFlavoredSource("component", name, flavor, source);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [toneOverride, setToneOverride] = useState<string | undefined>(undefined);

  const entry = getRegistryComponent(name);
  if (!entry) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-base text-muted-foreground">
        Component &quot;{name}&quot; not found.
      </div>
    );
  }

  const tones = entry.variants?.tone;
  const activeTone = toneOverride ?? (entry.demoProps?.tone as string | undefined) ?? tones?.[0];
  const embedSrc = `/embed/component/${name}${
    tones && activeTone ? `?tone=${encodeURIComponent(activeTone)}` : ""
  }`;

  const displayCmd = toPackageManager(
    withFlavor(componentInstallCommand(name), flavor),
    pm
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write can fail in insecure contexts, fail silently.
    }
  };

  const isDialog = variant === "dialog";

  return (
    <div
      className={cn(
        "flex flex-col bg-card",
        isDialog ? "h-full overflow-hidden" : "overflow-hidden rounded-xl border",
        className
      )}
    >
      {/* Action bar */}
      <div className="w-full shrink-0 border-b">
        <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-3">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "view" | "code" | "usage")}
          >
            <TabsList className="h-11 w-fit rounded-full bg-muted/60 p-1">
              <TabsTrigger value="view" className="cursor-pointer rounded-full px-4 text-base data-[state=active]:bg-background">
                View
              </TabsTrigger>
              <TabsTrigger value="code" className="cursor-pointer rounded-full px-4 text-base data-[state=active]:bg-background">
                Code
              </TabsTrigger>
              <TabsTrigger value="usage" className="cursor-pointer rounded-full px-4 text-base data-[state=active]:bg-background">
                Usage
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1.5">
            <RegistryFlavorSelect flavor={flavor} onChange={setFlavor} />
            {tones && tones.length > 0 && (
              <Select value={activeTone} onValueChange={(v) => setToneOverride(v)}>
                <SelectTrigger className="h-11 w-36 cursor-pointer rounded-full border-0 bg-muted/60 text-base shadow-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50">
                  <SelectValue placeholder="Tone" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                  {tones.map((t) => (
                    <SelectItem key={t} value={t} className="cursor-pointer text-base">
                      <span className="capitalize">{t}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {/* The command and the package manager that writes it, in one pill. */}
            <div className="flex h-11 items-center rounded-full bg-muted/60 pl-1 text-base">
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
                className="flex h-full min-w-0 cursor-pointer items-center gap-2 rounded-full px-3 transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label={copied ? "Copied" : "Copy install command"}
              >
                <code className="min-w-0 max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap font-mono sm:max-w-xs md:max-w-sm lg:max-w-md">
                  {copied ? "Copied!" : displayCmd}
                </code>
                {copied && (
                  <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} className="shrink-0 text-emerald-600" aria-hidden="true" />
                )}
              </button>
            </div>
            <span className="hidden sm:inline-flex">
              <IconButton
                label={
                  previewMode === "desktop"
                    ? "Switch to mobile preview"
                    : "Switch to desktop preview"
                }
                icon={previewMode === "desktop" ? SmartPhone01Icon : ComputerIcon}
                onClick={() => setPreviewMode((prev) => (prev === "desktop" ? "mobile" : "desktop"))}
                className={ICON_ACTION_CLASS}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn("w-full bg-background", isDialog ? "flex-1 overflow-hidden" : "h-[70vh]")}>
        {activeTab === "view" ? (
          <div
            className={cn("h-full w-full bg-muted/30", previewMode === "mobile" && "flex justify-center py-4")}
          >
            <iframe
              key={`${name}-${previewMode}`}
              src={embedSrc}
              title={`${name} preview`}
              className={cn(
                "border-0",
                previewMode === "mobile"
                  ? "h-full w-[390px] rounded-lg border bg-background shadow-sm"
                  : "h-full w-full"
              )}
            />
          </div>
        ) : activeTab === "code" ? (
          <div className="h-full w-full overflow-hidden">
            {flavoredSource === undefined ? (
              <div className="flex h-full items-center justify-center text-base text-muted-foreground">
                Loading source…
              </div>
            ) : (
              <CodeBlock code={flavoredSource ?? source ?? ""} language="tsx" />
            )}
          </div>
        ) : (
          <div className="h-full w-full overflow-hidden">
            <CodeBlock
              code={
                (flavor === "base" ? (entry.usageBase ?? entry.usage) : entry.usage) ??
                "// No usage snippet yet."
              }
              language="tsx"
            />
          </div>
        )}
      </div>
    </div>
  );
}
