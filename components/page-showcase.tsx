"use client";

import {
  ArrowUpRight01Icon,
  ComputerIcon,
  SmartPhone01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useRef, useState } from "react";

import { CodeBlock } from "@/components/code-block";
import { HugeiconsIcon } from "@hugeicons/react";
import { ICON_ACTION_CLASS } from "@/components/icon-action";
import { IconButton } from "@/components/icon-button";
import { ProUnlockContent, ProUnlockModal } from "@/components/pro-unlock-modal";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { usePreviewFont } from "@/lib/preview-font-store";
import { usePreviewTheme } from "@/lib/preview-theme-store";
import { useRouter } from "next/navigation";

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

interface PageShowcaseProps {
  name: string;
  /** The page's own composition source, or null when the reader may not see it. */
  source: string | null;
  installCommand: string;
  displayInstallCommand?: string;
  isPro?: boolean;
  isUserPro?: boolean;
  className?: string;
}

/** Placeholder height until the frame reports what it actually measured. */
const INITIAL_FRAME_HEIGHT = 900;

/**
 * The block showcase's shape, for a whole screen.
 *
 * A page is always framed: it carries its own navbar, its own headings and its
 * own footer, so rendering it inline would put a second document inside this
 * one. That removes the inline/iframe fork the block showcase carries, and with
 * it the live-registry import and the variant merging, which is why this is its
 * own component rather than another mode of that one.
 *
 * The frame is not a window onto the page, it is the page: loaded with `?fit=1`
 * it measures itself and reports its height, and the iframe grows to it. A page
 * is a full screen and a viewport-tall box would have made reading one an
 * exercise in scrolling a scrollbar inside a scrollbar.
 */
export function PageShowcase({
  name,
  source,
  installCommand,
  displayInstallCommand,
  isPro = false,
  isUserPro = false,
  className,
}: PageShowcaseProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"view" | "code">("view");
  const [pm, setPm] = useState<PackageManager>("npx");
  const [copied, setCopied] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [frameHeight, setFrameHeight] = useState(INITIAL_FRAME_HEIGHT);
  const [frameReady, setFrameReady] = useState(false);

  const { getResolvedTheme } = usePreviewTheme();
  const { fontSet } = usePreviewFont();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const resolvedTheme = getResolvedTheme();

  // The preview is a separate React tree, so the theme and font picked on this
  // page reach it over postMessage rather than through context.
  const syncPreviewToFrame = useCallback(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage({ type: "THEME_UPDATE", theme: resolvedTheme }, "*");
    frame.postMessage({ type: "FONT_UPDATE", fontSet }, "*");
  }, [resolvedTheme, fontSet]);

  useEffect(() => {
    syncPreviewToFrame();
  }, [syncPreviewToFrame]);

  const syncRef = useRef(syncPreviewToFrame);
  useEffect(() => {
    syncRef.current = syncPreviewToFrame;
  }, [syncPreviewToFrame]);

  /*
    One effect per iframe (its key is name+previewMode, so switching to the phone
    width builds a new one). It does three things for that frame: pushes the
    theme once it loads, grows the box to whatever height the frame reports, and
    clears the spinner.

    The size message is the real "there is something to look at" signal — it is
    posted after the page hydrates and measures itself, where `load` fires before
    any of that. `load` is kept only as a safety net, so a page that somehow never
    reports a size still reveals itself instead of spinning forever.
  */
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-attach per iframe
  useEffect(() => {
    setFrameReady(false);
    setFrameHeight(INITIAL_FRAME_HEIGHT);

    const frame = iframeRef.current;
    if (!frame) return;

    const onMessage = (event: MessageEvent) => {
      // Match the sender against this frame: the thumbnail grid and any other
      // embed on the page post the same message.
      if (event.source !== frame.contentWindow) return;
      const data = event.data as { type?: string; height?: number };
      if (data?.type === "EMBED_SIZE" && typeof data.height === "number" && data.height > 0) {
        setFrameHeight(Math.ceil(data.height));
        setFrameReady(true);
      }
    };
    window.addEventListener("message", onMessage);

    let fallback: ReturnType<typeof setTimeout> | undefined;
    const onLoad = () => {
      syncRef.current();
      fallback = setTimeout(() => setFrameReady(true), 4000);
    };
    try {
      if (
        frame.contentWindow &&
        frame.contentWindow.location.href !== "about:blank" &&
        frame.contentDocument?.readyState === "complete"
      ) {
        onLoad();
      }
    } catch {
      // Same-origin embed shouldn't throw; if it does, wait for the load event.
    }
    frame.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("message", onMessage);
      frame.removeEventListener("load", onLoad);
      if (fallback) clearTimeout(fallback);
    };
  }, [name, previewMode]);

  const canViewCode = !isPro || isUserPro;
  const displayCmd = toPackageManager(displayInstallCommand ?? installCommand, pm);
  const copyCmd = toPackageManager(installCommand, pm);

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
    <div className={cn("flex flex-col border-t border-muted bg-card", className)}>
      <div className="w-full border-b border-muted bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-6">
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
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1.5">
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

            <span className="hidden sm:inline-flex">
              <IconButton
                label={
                  previewMode === "desktop"
                    ? "Switch to mobile preview"
                    : "Switch to desktop preview"
                }
                icon={previewMode === "desktop" ? SmartPhone01Icon : ComputerIcon}
                onClick={() =>
                  setPreviewMode((prev) => (prev === "desktop" ? "mobile" : "desktop"))
                }
                className={ICON_ACTION_CLASS}
              />
            </span>

            {/* The page on its own, in a tab of its own: no chrome, no frame,
                the browser's real viewport. A plain anchor rather than a router
                link, since the target is not part of this app's navigation. */}
            <IconButton
              asChild
              label="Open the page on its own"
              icon={ArrowUpRight01Icon}
              className={ICON_ACTION_CLASS}
            >
              <a href={`/embed/page/${name}`} target="_blank" rel="noreferrer" />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="w-full border-b bg-background">
        {activeTab === "view" ? (
          <div
            className={cn(
              "relative w-full bg-muted/30 transition-[height] duration-300",
              previewMode === "mobile" && "flex justify-center py-4"
            )}
            style={{
              // The phone frame keeps the padding the desktop one has no room for.
              height: previewMode === "mobile" ? frameHeight + 32 : frameHeight,
            }}
          >
            {!frameReady && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-muted/30">
                <Spinner className="size-6 text-muted-foreground" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              key={`${name}-${previewMode}`}
              // ?fit=1: the embed drops its min-h-screen and reports its own
              // height, which is what lets the box below be the page's height.
              src={`/embed/page/${name}?fit=1`}
              title={`${name} preview`}
              scrolling="no"
              className={cn(
                "border-0",
                previewMode === "mobile"
                  ? "h-full w-[390px] rounded-lg border bg-background shadow-sm"
                  : "h-full w-full"
              )}
            />
          </div>
        ) : (
          <div className="h-[85vh] w-full overflow-hidden">
            {!canViewCode || source === null ? (
              <div className="relative h-full w-full overflow-hidden">
                <div className="relative flex h-full items-center justify-center overflow-y-auto p-6">
                  <div className="w-full max-w-sm rounded-xl border bg-card p-7 shadow-[0_20px_60px_-15px] shadow-foreground/25">
                    <ProUnlockContent onGetProAccess={() => router.push("/pricing")} />
                  </div>
                </div>
              </div>
            ) : (
              <CodeBlock code={source} language="tsx" />
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
