"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

type Agent = "claude" | "openai" | "cursor" | "grok" | "gemini" | "bestie";

interface Ai58Props {
  /** Which agent sits on the left of the link */
  agent?: Agent;
  /** Mascot image used when `agent` is "bestie" */
  agentImage?: string;
  name?: string;
  via?: string;
  /** A command or path to copy; when set it replaces the link row */
  code?: string;
  /** Link row text, shown when there is no `code` */
  action?: string;
  href?: string;
  linkLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const ai58Demo: Ai58Props = {
  agent: "claude",
  agentImage: "https://oud.pics/b/beste/bestie-jelly.webp",
  name: "Claude Code and Codex",
  via: "One command in your terminal",
  code: "npx beste-agent@latest",
  action: "Copy the command",
  href: "#",
  linkLabel: "Open",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  note: "Run it once and Claude Code or Codex connects to your Beste account.",
  framed: true,
};

const STYLES = `
@keyframes ai58-link { to { stroke-dashoffset: -20; } }
.ai58-link { animation: ai58-link 1.6s linear infinite; }
@media (prefers-reduced-motion: reduce) { .ai58-link { animation: none; } }
`;

const circleClasses =
  "flex size-14 shrink-0 items-center justify-center rounded-full bg-card shadow-md ring-1 ring-border";

export function Ai58({
  agent = "claude",
  agentImage,
  name,
  via,
  code,
  action,
  href = "#",
  linkLabel = "Open",
  copyLabel = "Copy",
  copiedLabel = "Copied",
  note,
  framed = true,
  fill = false,
  className,
}: Ai58Props) {
  // Keyed on the copied text, so picking another agent shows "Copy" again
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const copied = code !== undefined && copiedCode === code;

  const copy = () => {
    if (!code) return;
    try {
      void navigator.clipboard?.writeText(code).catch(() => {});
    } catch {
      // Clipboard can be blocked in previews; the label still confirms the click
    }
    setCopiedCode(code);
  };

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>

      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3.5 rounded-2xl bg-card p-3.5 text-sm text-card-foreground",
            !framed && "shadow-lg",
            fill && "justify-center"
          )}
        >
          <div className="flex h-32 items-center justify-center rounded-xl bg-muted" aria-hidden="true">
            <span className={circleClasses}>
              {agent === "bestie" ? (
                agentImage && <img src={agentImage} alt="" className="size-8" />
              ) : (
                <AiMark brand={agent} label="" className="size-6" />
              )}
            </span>
            <svg viewBox="0 0 120 8" className="h-2 w-30 shrink-0 overflow-visible text-muted-foreground/40">
              <path className="ai58-link" d="M4 4 H116" stroke="currentColor" strokeWidth="1.4" strokeDasharray="5 5" fill="none" />
            </svg>
            <span className={circleClasses}>
              <AiMark brand="beste" label="" className="size-6.5" />
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3 px-0.5">
            {name && <span className="font-semibold">{name}</span>}
            {via && <span className="truncate text-xs text-muted-foreground">{via}</span>}
          </div>

          {code ? (
            <div className="flex h-12 items-center gap-2.5 rounded-xl bg-muted pr-1.5 pl-3.5">
              <span className="min-w-0 flex-1 truncate">{code}</span>
              <button
                type="button"
                onClick={copy}
                aria-pressed={copied}
                className="h-9 shrink-0 cursor-pointer rounded-full bg-primary px-3.5 text-xs text-primary-foreground"
              >
                {copied ? copiedLabel : copyLabel}
              </button>
            </div>
          ) : (
            <a
              href={href}
              className="flex h-12 cursor-pointer items-center justify-between gap-2.5 rounded-xl bg-muted pr-1.5 pl-3.5 text-card-foreground"
            >
              {action && <span className="truncate font-medium">{action}</span>}
              <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-primary px-3.5 text-xs text-primary-foreground">
                {linkLabel}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </a>
          )}

          {note && <p className="line-clamp-2 min-h-9 px-0.5 text-xs leading-normal text-muted-foreground">{note}</p>}
        </div>
      </div>
    </div>
  );
}
