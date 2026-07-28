"use client";

import {
  ArrowRight01Icon,
  ComputerIcon,
  SmartPhone01Icon,
  SparklesIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProUnlockContent, ProUnlockModal } from "@/components/pro-unlock-modal";
import {
  RegistryFlavorSelect,
  useFlavoredSource,
  useRegistryFlavor,
} from "@/components/registry-flavor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useRef, useState } from "react";

import { IconButton } from "@/components/icon-button";
import { CodeBlock } from "@/components/code-block";
import { ICON_ACTION_CLASS } from "@/components/icon-action";
import { Spinner } from "@/components/ui/spinner";
import { ThemedPreview } from "@/components/theme/themed-preview";
import { cn } from "@/lib/utils";
import { getBlock } from "@/lib/blocks";
import { getBlockObfuscated } from "@/lib/blocks-obfuscated";
import { usePreviewFont } from "@/lib/preview-font-store";
import { usePreviewTheme } from "@/lib/preview-theme-store";
import { usePreviewVariants } from "@/lib/preview-variants-store";
import { useRouter } from "next/navigation";
import { withFlavor } from "@/lib/install-command";

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

const DUMMY_PRO_SOURCE = `import { HugeiconsIcon } from "@hugeicons/react";
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

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (current[key!] && typeof current[key!] === "object") {
      current[key!] = { ...(current[key!] as Record<string, unknown>) };
    } else {
      current[key!] = {};
    }
    current = current[key!] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]!] = value;
}

function mergeVariants(
  base: Record<string, unknown>,
  variants: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...base };
  for (const [key, value] of Object.entries(variants)) {
    if (key.includes(".")) {
      setNestedValue(result, key, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

interface BlockShowcaseProps {
  name: string;
  /** Full source code. Undefined = still loading. null = unavailable (e.g. pro + non-pro user). */
  source: string | null | undefined;
  /** When true, shows a "Docs" button in the tab row that scrolls to the docs section rendered below the showcase. */
  hasDocs?: boolean;
  /** Element id the "Docs" button scrolls to (default "block-docs"). */
  docsTargetId?: string;
  installCommand: string;
  displayInstallCommand?: string;
  fullscreen?: boolean;
  isPro?: boolean;
  isUserPro?: boolean;
  variant?: "dialog" | "page";
  className?: string;
}

export function BlockShowcase({
  name,
  source,
  hasDocs = false,
  docsTargetId = "block-docs",
  installCommand,
  displayInstallCommand,
  fullscreen = false,
  isPro = false,
  isUserPro = false,
  variant = "page",
  className,
}: BlockShowcaseProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"view" | "code">("view");
  const [pm, setPm] = useState<PackageManager>("npx");
  const [copied, setCopied] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [mounted, setMounted] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  // Reset preview scroll to top whenever the block changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run on block change
  useEffect(() => {
    previewScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [name]);

  // Render the inline (non-fullscreen) preview only after mount: the block has
  // its own <h1>, and rendering it on the server would ship two h1s on the page
  // (its title + the block's). Client-only mount keeps the server HTML to one
  // h1 and gives a brief loading state.
  useEffect(() => setMounted(true), []);
  const { variants } = usePreviewVariants();
  const { getResolvedTheme } = usePreviewTheme();
  const { fontSet } = usePreviewFont();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const resolvedTheme = getResolvedTheme();

  // Fullscreen blocks render inside an iframe (a separate React tree), so theme
  // and font picks from this page don't reach them through context. Push them
  // over postMessage whenever they change — and again when the iframe (re)loads —
  // so the preview reflects the selection live.
  const syncPreviewToFrame = useCallback(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage({ type: "THEME_UPDATE", theme: resolvedTheme }, "*");
    frame.postMessage({ type: "FONT_UPDATE", fontSet }, "*");
  }, [resolvedTheme, fontSet]);

  useEffect(() => {
    syncPreviewToFrame();
  }, [syncPreviewToFrame]);

  // Keep a live ref to the latest sync so the load listener below can push
  // theme/font on load without re-subscribing (and re-flashing the spinner)
  // every time the theme changes.
  const syncRef = useRef(syncPreviewToFrame);
  useEffect(() => {
    syncRef.current = syncPreviewToFrame;
  }, [syncPreviewToFrame]);

  // Clear the preview spinner once the fullscreen iframe has loaded. On a hard
  // refresh the SSR iframe can finish loading before React hydrates and attaches
  // the handler, so the load event is missed — reconcile from readyState too,
  // otherwise the spinner never clears. Re-runs only when the iframe is
  // recreated (its key is name+previewMode).
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-attach per iframe
  useEffect(() => {
    setFrameLoaded(false);
    const frame = iframeRef.current;
    if (!frame) return;
    const markLoaded = () => {
      syncRef.current();
      setFrameLoaded(true);
    };
    try {
      if (
        frame.contentWindow &&
        frame.contentWindow.location.href !== "about:blank" &&
        frame.contentDocument?.readyState === "complete"
      ) {
        markLoaded();
      }
    } catch {
      // Same-origin embed shouldn't throw; if it does, wait for the load event.
    }
    frame.addEventListener("load", markLoaded);
    return () => frame.removeEventListener("load", markLoaded);
  }, [name, previewMode]);

  const [flavor, setFlavor] = useRegistryFlavor();
  const shownSource = useFlavoredSource("block", name, flavor, source);

  const displayCmd = toPackageManager(
    withFlavor(displayInstallCommand ?? installCommand, flavor),
    pm
  );
  const copyCmd = toPackageManager(withFlavor(installCommand, flavor), pm);
  const canViewCode = !isPro || isUserPro;

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

  // Resolve the block render (non-fullscreen path). In development always use
  // the live block so edits hot-reload — the obfuscated build is a generated
  // snapshot that only refreshes on `pro:obfuscate`. It renders identically.
  const useLiveBlock = isUserPro || process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
  const block = useLiveBlock ? getBlock(name) : getBlockObfuscated(name);
  const Component = block?.component;
  const mergedProps = block
    ? mergeVariants(block.demoProps as Record<string, unknown>, variants)
    : null;

  const isDialog = variant === "dialog";

  const previewLoader = (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center bg-muted/30">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col bg-card",
        isDialog ? "h-full overflow-hidden" : "border-t border-muted",
        className
      )}
    >
      {/*
        Action bar, in the language the rest of the site moved to: every control
        is a filled pill on the page's own surface rather than a bordered box, so
        the bar reads as one row of things to press. The strip itself went from
        `bg-muted` to `bg-background` for that — filled controls need a ground
        lighter than they are, and the rule under it still says where the preview
        starts.
      */}
      <div className="w-full border-b border-muted bg-background">
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-2 py-3",
            isDialog ? "px-2" : "mx-auto w-full max-w-6xl px-4 md:px-6"
          )}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "view" | "code")}>
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
              {hasDocs && (
                // Not a tab: it scrolls to a section further down rather than
                // swapping the panel, so it does not take a selected state.
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(docsTargetId)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="hidden h-full cursor-pointer items-center justify-center rounded-full px-4 text-base font-medium text-foreground/70 transition-colors hover:bg-background/60 hover:text-foreground sm:inline-flex"
                >
                  Docs
                </button>
              )}
            </TabsList>
          </Tabs>

          {/* The PRO/FREE tag is not here: it says what the block is, which is a
              fact about the page, so it sits beside the title. This row is only
              the things you press. */}
          <div className="flex items-center gap-1.5">
            <RegistryFlavorSelect flavor={flavor} onChange={setFlavor} className="hidden sm:flex" />

            {/* The command and the package manager that writes it, in one pill. */}
            <div className="flex h-11 items-center rounded-full bg-muted/60 pl-1 text-base">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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
                className="flex h-full min-w-0 cursor-pointer select-none items-center gap-2 rounded-full px-3 transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label={copied ? "Copied" : "Copy install command"}
              >
                <span className="grid min-w-0 items-center">
                  <code
                    className={cn(
                      "col-start-1 row-start-1 min-w-0 max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap font-mono sm:max-w-xs md:max-w-sm lg:max-w-md",
                      copied && "invisible"
                    )}
                  >
                    {displayCmd}
                  </code>
                  {copied && (
                    <span className="col-start-1 row-start-1 flex items-center gap-2 font-mono">
                      Copied!
                      <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} className="shrink-0 text-emerald-600" aria-hidden="true" />
                    </span>
                  )}
                </span>
              </button>
            </div>

            {/* The library's own icon-only button, like every other round action. */}
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
      <div
        className={cn(
          "w-full bg-background min-h-96 flex items-center border-b",
          isDialog ? "flex-1 overflow-hidden" : ""
        )}
      >
        {activeTab === "view" ? (
          fullscreen || previewMode === "mobile" ? (
            <div
              className={cn(
                "relative w-full bg-muted/30",
                isDialog ? "h-full overflow-auto" : "h-[85vh]",
                previewMode === "mobile" && "flex justify-center py-4"
              )}
            >
              {!frameLoaded && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-muted/30">
                  <Spinner className="size-6 text-muted-foreground" />
                </div>
              )}
              <iframe
                ref={iframeRef}
                key={`${name}-${previewMode}`}
                src={`/embed/${name}`}
                title={`${name} preview`}
                className={cn(
                  "border-0",
                  previewMode === "mobile"
                    ? "h-full w-[390px] rounded-lg border bg-background shadow-sm"
                    : "h-full w-full"
                )}
              />
            </div>
          ) : (
            <div
              ref={previewScrollRef}
              className={cn("w-full", isDialog ? "h-full overflow-auto" : "")}
            >
              {mounted ? (
                <ThemedPreview>
                  {Component && mergedProps ? (
                    <Component {...mergedProps} />
                  ) : (
                    <div className="flex h-full items-center justify-center p-12 text-base text-muted-foreground">
                      Block not found.
                    </div>
                  )}
                </ThemedPreview>
              ) : (
                previewLoader
              )}
            </div>
          )
        ) : (
          <div className={cn("w-full overflow-hidden", isDialog ? "h-full" : "h-[85vh]")}>
            {!canViewCode ? (
              <div className="relative h-full w-full overflow-hidden">
                <div className="pointer-events-none absolute inset-0 select-none opacity-60 blur-[6px]">
                  <CodeBlock code={DUMMY_PRO_SOURCE} language="tsx" />
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

      <ProUnlockModal
        open={proModalOpen}
        onOpenChange={setProModalOpen}
        onGetProAccess={() => {
          setProModalOpen(false);
          router.push("/pricing");
        }}
      />
    </div>
  );
}
