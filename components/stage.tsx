"use client";

import { GridViewIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

import { CodeBlock } from "@/components/code-block";
import { ICON_ACTION_CLASS } from "@/components/icon-action";
import { IconButton } from "@/components/icon-button";
import { ProUnlockContent, ProUnlockModal } from "@/components/pro-unlock-modal";
import {
  RegistryFlavorSelect,
  useFlavoredSource,
  useRegistryFlavor,
} from "@/components/registry-flavor";
import { SiteFooter } from "@/components/site-footer";
import { ThemePicker } from "@/components/theme/theme-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withFlavor } from "@/lib/install-command";
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

/** What a locked code pane shows, blurred, behind the upgrade card. */
const LOCKED_SAMPLE_SOURCE = `import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageUrl: string;
  className?: string;
}

export function Hero({
  eyebrow = "New release",
  title,
  description,
  primaryCta,
  secondaryCta,
  imageUrl,
  className,
}: HeroProps) {
  return (
    <section className={cn("relative overflow-hidden py-24 md:py-32", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit gap-1.5">
              <HugeiconsIcon icon={SparklesIcon} size={14} strokeWidth={2} />
              {eyebrow}
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
              {description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
                </Link>
              </Button>
              {secondaryCta && (
                <Button asChild size="lg" variant="outline">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}`;

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

interface StageProps {
  /** Full source. Undefined = still loading. Null = not available to this reader. */
  source: string | null | undefined;
  installCommand: string;
  displayInstallCommand?: string;
  isPro?: boolean;
  isUserPro?: boolean;
  /** The catalogue this thing belongs to, e.g. "/blocks". */
  backHref: string;
  /** Accessible name for that link, e.g. "All blocks". */
  backLabel: string;
  /**
   * The registry item when it has a Base UI twin: shows the primitive-library
   * select and swaps the source and command to the r-base variant.
   */
  flavor?: { kind: "block" | "piece" | "component"; name: string };
  /** Round actions after the theme picker: favourite, previous, next. */
  actions?: ReactNode;
  /** The label on the sheet's edge, e.g. "About this block". */
  detailsLabel?: string;
  /** The thing itself, rendered edge to edge. */
  children: ReactNode;
  /** What follows it: title, docs, related items. */
  details: ReactNode;
}

/**
 * A detail page is the thing it describes: the block or page rendered inline,
 * edge to edge, with nothing of the site's above it. A floating bar at the foot
 * of the viewport carries the way back, the View/Code switch and the install
 * command, and the catalogue's own information follows as a sheet that slides
 * over the foot of the thing, with the site footer after it.
 *
 * The stage sits in its own stacking context so a navbar it fixes to the top
 * stays inside it: the details that follow slide over it rather than under it.
 * Dialogs and menus are portalled to the body at z-50, so the details stay
 * beneath that and the bar beneath them.
 */
export function Stage({
  source,
  installCommand,
  displayInstallCommand,
  isPro = false,
  isUserPro = false,
  backHref,
  backLabel,
  flavor: flavorItem,
  actions,
  detailsLabel = "Details",
  children,
  details,
}: StageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"view" | "code">("view");
  const [pm, setPm] = useState<PackageManager>("npx");
  const [copied, setCopied] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);

  const [flavor, setFlavor] = useRegistryFlavor();
  const hasFlavor = Boolean(flavorItem);
  // Hooks run unconditionally; without a flavoured twin the radix source is
  // returned untouched and nothing is fetched.
  const shownSource = useFlavoredSource(
    flavorItem?.kind ?? "block",
    flavorItem?.name ?? "",
    hasFlavor ? flavor : "radix",
    source
  );

  const canViewCode = !isPro || isUserPro;
  const flavored = (command: string) => (hasFlavor ? withFlavor(command, flavor) : command);
  const displayCmd = toPackageManager(flavored(displayInstallCommand ?? installCommand), pm);
  const copyCmd = toPackageManager(flavored(installCommand), pm);

  const switchTab = (tab: "view" | "code") => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleCopy = async () => {
    if (!canViewCode) {
      setProModalOpen(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(copyCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write can fail in insecure contexts — fail silently.
    }
  };

  return (
    <>
      <div className="relative isolate">
        {activeTab === "view" ? (
          children
        ) : (
          <div className="h-svh w-full overflow-hidden bg-card">
            {!canViewCode ? (
              <div className="relative h-full w-full overflow-hidden">
                <div className="pointer-events-none absolute inset-0 select-none opacity-60 blur-[6px]">
                  <CodeBlock code={LOCKED_SAMPLE_SOURCE} language="tsx" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/70" />
                <div className="relative flex h-full items-center justify-center overflow-y-auto p-6">
                  <div className="w-full max-w-sm rounded-xl border bg-card p-7 shadow-[0_20px_60px_-15px] shadow-foreground/25">
                    <ProUnlockContent onGetProAccess={() => router.push("/pricing")} />
                  </div>
                </div>
              </div>
            ) : shownSource === undefined ? (
              <div className="flex h-full items-center justify-center text-base text-muted-foreground">
                Loading source…
              </div>
            ) : shownSource === null ? (
              <div className="flex h-full items-center justify-center p-6 text-base text-muted-foreground">
                Source not available.
              </div>
            ) : (
              <CodeBlock code={shownSource} language="tsx" />
            )}
          </div>
        )}
      </div>

      {/*
        The details arrive as a sheet: rounded shoulders, a soft shadow up onto
        the thing above, and a label on the edge saying what is under it, so
        the two read as layers rather than as one document running into
        another.
      */}
      <div className="relative z-10 rounded-t-[2.5rem] border-t border-foreground/10 bg-background shadow-[0_-16px_48px_-24px_rgba(0,0,0,0.2)]">
        <div className="flex justify-center pt-5">
          <span className="rounded-full bg-muted/60 px-4 py-1.5 text-sm font-medium text-muted-foreground">
            {detailsLabel}
          </span>
        </div>
        <div className="pb-28">{details}</div>
        <SiteFooter />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
        <div className="pointer-events-auto flex max-w-full items-center gap-1.5 rounded-full border bg-background/90 p-1.5 shadow-xl shadow-foreground/10 backdrop-blur-md">
          {/* The catalogue, not "back": the arrows on the right already walk
              the neighbours, and this always lands on the listing. */}
          <IconButton asChild label={backLabel} icon={GridViewIcon} className={ICON_ACTION_CLASS}>
            <Link href={backHref} />
          </IconButton>

          <Tabs value={activeTab} onValueChange={(v) => switchTab(v as "view" | "code")}>
            <TabsList className="h-11 rounded-full bg-muted/60 p-1">
              <TabsTrigger
                value="view"
                className="cursor-pointer rounded-full px-4 text-base data-[state=active]:bg-background"
              >
                View
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="cursor-pointer rounded-full px-4 text-base data-[state=active]:bg-background"
              >
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {hasFlavor && (
            <RegistryFlavorSelect flavor={flavor} onChange={setFlavor} className="hidden lg:flex" />
          )}

          <div className="hidden h-11 items-center rounded-full bg-muted/60 pl-1 text-base sm:flex">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label={`Select package manager (current: ${PM_LABELS[pm]})`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PM_ICONS[pm]} alt="" aria-hidden="true" className="h-4 w-4 rounded-full" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-36 rounded-xl">
                {PM_ORDER.map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onSelect={() => setPm(key)}
                    className={cn("cursor-pointer text-base", pm === key && "bg-muted")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PM_ICONS[key]} alt="" aria-hidden="true" className="h-4 w-4 rounded-full" />
                    {PM_LABELS[key]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-full min-w-0 cursor-pointer select-none items-center gap-2 rounded-full px-3 transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label={copied ? "Copied" : "Copy install command"}
            >
              <span className="grid min-w-0 items-center">
                <code
                  className={cn(
                    "col-start-1 row-start-1 min-w-0 max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap font-mono md:max-w-sm lg:max-w-md",
                    copied && "invisible"
                  )}
                >
                  {displayCmd}
                </code>
                {copied && (
                  <span className="col-start-1 row-start-1 flex items-center gap-2 font-mono">
                    Copied!
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={14}
                      strokeWidth={2}
                      className="shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                  </span>
                )}
              </span>
            </button>
          </div>

          <ThemePicker className="hidden md:inline-flex" />

          {actions}
        </div>
      </div>

      <ProUnlockModal
        open={proModalOpen}
        onOpenChange={setProModalOpen}
        onGetProAccess={() => {
          setProModalOpen(false);
          router.push("/pricing");
        }}
      />
    </>
  );
}
