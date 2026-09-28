"use client";

import { Check, Copy, Download, Share2 } from "lucide-react";
import * as React from "react";
import { downloadQrPng, QrCode, type QrCodeProps } from "@/components/beste/component/qr-code";
import { cn } from "@/lib/utils";

/** Card surface. */
type Tone = "muted" | "outline" | "ghost";

/** Card density and QR size. `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export interface CodeShareProps {
  /** The link to share. It is encoded in the QR and shown in the field. */
  url: string;
  title?: string;
  description?: string;
  /** How the QR is drawn: module and finder style, colors, error correction, logo, quiet zone. */
  qr?: Omit<QrCodeProps, "value" | "className" | "tone" | "title">;
  /** Shows the native share button where the browser has one. @defaultValue true */
  showShare?: boolean;
  /** Shows the download button. @defaultValue true */
  showDownload?: boolean;
  /** Name of the downloaded PNG, without the extension. @defaultValue "qr-code" */
  fileName?: string;
  onCopy?: (url: string) => void;
  /** Words used by the component, for translation. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /** @defaultValue "outline" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  className?: string;
}

const DEFAULT_LABELS = {
  copy: "Copy link",
  copied: "Link copied",
  share: "Share",
  download: "Download QR",
  link: "Link",
};

export const codeShareDemo: CodeShareProps = {
  url: "https://beste.co/tours/nils-frahm-autumn",
  title: "Share the tour",
  description: "Scan to see every date of the autumn tour, or send the link.",
  qr: { moduleStyle: "rounded", finderStyle: "rounded", ecc: "M" },
  fileName: "nils-frahm-autumn-tour",
  onCopy: (url) => console.log("Copied", url),
  className: "w-80",
};

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border bg-background shadow-sm",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, { card: string; qr: "sm" | "default" | "lg"; title: string; button: string; field: string }> = {
  sm: { card: "gap-3 rounded-xl p-3", qr: "sm", title: "text-sm", button: "h-8 px-2.5 text-sm", field: "h-8 text-sm" },
  default: { card: "gap-4 rounded-2xl p-4", qr: "default", title: "text-base", button: "h-9 px-3 text-sm", field: "h-9 text-sm" },
  lg: { card: "gap-5 rounded-2xl p-5", qr: "lg", title: "text-lg", button: "h-10 px-3.5 text-base", field: "h-10 text-base" },
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and insecure origins: fall back to a hidden selection
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const done = document.execCommand("copy");
    area.remove();
    return done;
  }
}

/**
 * A share card around a QR code: the link in a read-only field with a copy button, the
 * browser's own share sheet where there is one, and the code as a PNG to download.
 */
export function CodeShare({
  url,
  title,
  description,
  qr,
  showShare = true,
  showDownload = true,
  fileName = "qr-code",
  onCopy,
  labels: labelsProp,
  tone = "outline",
  size = "default",
  className,
}: CodeShareProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const rootRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLInputElement>(null);
  const qrBoxRef = React.useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const copiedTimer = React.useRef(0);
  const titleId = React.useId();
  const s = sizeStyles[size];

  // Feature-detected after mount, so the server and the first paint agree
  React.useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  React.useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  const copy = async () => {
    if (!(await copyText(url))) return;
    setCopied(true);
    onCopy?.(url);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    try {
      await navigator.share({ title, text: description, url });
    } catch {
      // Closing the share sheet rejects; nothing to report
    }
  };

  const download = async () => {
    setBusy(true);
    try {
      // Colors resolve against the white QR box, so a dark theme never saves light modules on white
      await downloadQrPng(url, { ...qr, fileName, context: qrBoxRef.current });
    } finally {
      setBusy(false);
    }
  };

  const secondary = cn(
    "inline-flex flex-1 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border bg-background font-medium transition-colors",
    "hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60",
    s.button,
  );

  return (
    <div
      ref={rootRef}
      data-slot="code-share"
      role="group"
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : labels.link}
      className={cn("flex flex-col text-foreground", toneStyles[tone], s.card, className)}
    >
      {/* White behind the code whatever the theme, so every phone camera reads it */}
      <div ref={qrBoxRef} className="grid place-items-center rounded-xl bg-white p-3 text-neutral-950">
        <QrCode value={url} size={s.qr} tone="ghost" {...qr} className="max-w-full" />
      </div>

      {(title || description) && (
        <div className="flex flex-col gap-1 text-center">
          {title && (
            <h3 id={titleId} className={cn("select-none font-semibold leading-snug", s.title)}>
              {title}
            </h3>
          )}
          {description && <p className="select-none text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fieldRef}
          readOnly
          value={url}
          aria-label={labels.link}
          onFocus={(event) => event.currentTarget.select()}
          className={cn(
            "min-w-0 flex-1 rounded-lg border border-border bg-muted/50 px-3 text-muted-foreground outline-none",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
            s.field,
          )}
        />
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? labels.copied : labels.copy}
          className={cn(
            "relative grid shrink-0 cursor-pointer place-items-center rounded-lg bg-foreground text-background transition-colors hover:bg-foreground/85",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            s.field,
            "aspect-square",
          )}
        >
          {/* Both icons stay mounted and trade places, so the morph runs both ways */}
          <Copy
            aria-hidden="true"
            className={cn("col-start-1 row-start-1 size-4 transition-[opacity,scale] duration-300", copied ? "scale-50 opacity-0" : "scale-100 opacity-100")}
            style={{ transitionTimingFunction: EASE }}
          />
          <Check
            aria-hidden="true"
            className={cn("col-start-1 row-start-1 size-4 transition-[opacity,scale] duration-300", copied ? "scale-100 opacity-100" : "scale-50 opacity-0")}
            style={{ transitionTimingFunction: EASE }}
          />
        </button>
      </div>

      {((showShare && canShare) || showDownload) && (
        <div className="flex gap-2">
          {showShare && canShare && (
            <button type="button" onClick={share} className={secondary}>
              <Share2 className="size-4 shrink-0" aria-hidden="true" />
              {labels.share}
            </button>
          )}
          {showDownload && (
            <button type="button" onClick={download} disabled={busy} aria-busy={busy || undefined} className={secondary}>
              <Download className="size-4 shrink-0" aria-hidden="true" />
              {labels.download}
            </button>
          )}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {copied ? labels.copied : ""}
      </p>
    </div>
  );
}
