"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  hideCopy?: boolean;
  /**
   * Take the height of the code instead of the parent's.
   *
   * The default is `h-full`, which is right inside the fixed panes this started in
   * and wrong everywhere else: dropped into a section that sizes itself, `height:
   * 100%` of an auto-height parent leaves the block with nothing to fill and the code
   * renders into a blank strip. Pass this where the code should simply be as tall as
   * it is.
   */
  fit?: boolean;
  /**
   * Cut the block off at this many pixels, fading the last lines out under an
   * Expand button, and only when the code is actually taller than that.
   *
   * For blocks that size themselves (`fit`): a snippet the page cannot scroll past
   * is a snippet that pushes everything after it off the screen, and a reader who
   * wanted the two lines at the top should not have to scroll a screenful of props
   * to reach the next section. Blocks that fill a fixed pane already scroll inside
   * it and want none of this.
   */
  collapsedHeight?: number;
}

export function CodeBlock({
  code,
  language = "tsx",
  hideCopy = false,
  fit = false,
  collapsedHeight,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  /*
   * Only `fit` blocks can be cut off: the others are already as tall as the pane
   * holding them, so a fade at the bottom would be a fade over a scrollbar.
   */
  const limit = fit ? collapsedHeight : undefined;
  /*
   * A callback ref, because the scrolling element is a `pre` before Shiki answers
   * and a `div` after: one ref typed to the pair of them is simpler than keeping
   * two, and the callback lands before the effect that measures it either way.
   */
  const scrollRef = useRef<HTMLElement | null>(null);
  const attachScroll = (element: HTMLElement | null) => {
    scrollRef.current = element;
  };
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const collapsed = Boolean(limit) && overflows && !expanded;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Use theme for custom themes (paper), resolvedTheme for system theme resolution
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  /*
   * The ordinary GitHub colours, which is what a reader's editor most likely looks
   * like and therefore what they read fastest. The greyness comes from the surface
   * instead: the theme's own background is dropped below and the block sits on
   * `bg-muted`, so the page stays calm without the syntax having to be muted too.
   */
  const shikiTheme =
    currentTheme === "paper"
      ? "everforest-light"
      : currentTheme === "light"
      ? "github-light"
      : "github-dark";

  useEffect(() => {
    if (!mounted) return;
    codeToHtml(code, {
      lang: language,
      theme: shikiTheme,
    }).then(setHtml);
  }, [code, language, shikiTheme, mounted]);

  /*
   * Whether there is anything hidden, measured rather than guessed from the line
   * count: what a line costs depends on the font the reader ended up with. The
   * height is read off `scrollHeight`, which reports the full content even while a
   * `max-height` is clamping the box, so this stays right in both states.
   */
  useEffect(() => {
    if (!limit) return;
    const el = scrollRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > limit + 8);
  }, [limit, html, code]);

  /*
   * A square in the corner rather than a labelled button: it sits over the code, and
   * "Copy Code" is wide enough to cover the first line — which is the line most
   * worth reading, being the import.
   */
  const copyButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      title={copied ? "Copied" : "Copy"}
      className="size-7 bg-muted/80 text-foreground/70 backdrop-blur hover:bg-foreground/10 hover:text-foreground"
    >
      {copied ? <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} className="text-emerald-600" /> : <HugeiconsIcon icon={Copy01Icon} size={14} strokeWidth={2} />}
    </Button>
  );

  // Before Shiki has answered, the same code in the same place, unpainted — so the
  // block never has a moment of being empty.
  const box = fit ? "relative bg-muted" : "relative h-full bg-muted";
  /*
   * `scrollbar-hide` is a utility this project already defines. The code still
   * scrolls; what goes is the bar drawn under it, which on a short snippet was a grey
   * line across the bottom of a block that had nothing to scroll.
   *
   * While collapsed the vertical axis is clamped and hidden — the button below is
   * the way down — but the horizontal one keeps scrolling, since a long line is
   * still a long line at any height.
   */
  const inner = cn(
    !fit && "h-full",
    collapsed ? "overflow-x-auto overflow-y-hidden" : "overflow-auto",
    "scrollbar-hide"
  );
  const innerStyle = collapsed ? { maxHeight: limit } : undefined;

  /*
   * Line numbers, drawn by CSS rather than by a Shiki transformer: they are then
   * decoration the browser paints, which keeps them out of a copy. A number that
   * comes along with the code is the reason people stop trusting copy buttons.
   *
   * Shiki wraps each line in `span.line`; making the `code` a grid is what turns
   * those spans into rows a counter can walk down.
   */
  const numbers = [
    "[&_code]:grid [&_code]:[counter-reset:line]",
    "[&_.line]:before:[counter-increment:line] [&_.line]:before:content-[counter(line)]",
    "[&_.line]:before:mr-4 [&_.line]:before:inline-block [&_.line]:before:w-8",
    "[&_.line]:before:text-right [&_.line]:before:text-foreground/40 [&_.line]:before:select-none",
  ].join(" ");

  /*
   * `text-sm/7` rather than plain `text-sm`: at the default 20px leading the lines
   * of a long snippet run together, and code is read by scanning down the left edge
   * more than along the line. Both branches carry it so the paint after Shiki
   * answers lands on the same rows as the plain text before it.
   */
  const type = "text-sm/7";

  /*
   * The way out of a collapsed block. Over the fade while collapsed, and in flow
   * under the code once open, where an overlay would sit on the last line — the one
   * the reader expanded the block to get to.
   */
  const toggle = Boolean(limit) && overflows && (
    <div
      className={cn(
        "flex justify-center",
        collapsed
          ? "absolute inset-x-0 bottom-0 z-10 h-28 items-end bg-gradient-to-t from-muted via-muted/90 to-transparent pb-3"
          : "pb-3"
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="cursor-pointer rounded-full bg-background/90 px-4 py-1.5 text-sm font-medium text-foreground/70 backdrop-blur transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {collapsed ? "Expand" : "Collapse"}
      </button>
    </div>
  );

  if (!mounted || !html) {
    return (
      <div className={box}>
        <pre
          ref={attachScroll}
          className={cn(inner, "bg-transparent p-4 text-foreground", type)}
          style={innerStyle}
        >
          <code>{code}</code>
        </pre>
        {toggle}
      </div>
    );
  }

  return (
    <div className={box}>
      <div
        ref={attachScroll}
        className={cn(
          inner,
          numbers,
          type,
          "[&_pre]:!bg-transparent [&_pre]:p-4 [&_code]:!bg-transparent"
        )}
        style={innerStyle}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {!hideCopy && (
        <div className="absolute top-2 right-2 z-10">{copyButton}</div>
      )}
      {toggle}
    </div>
  );
}
