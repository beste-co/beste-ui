import { Alert02Icon, Idea01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "tip" | "warning";

/*
 * No borders: the tint is what marks an aside, and a line around a filled box is
 * the second thing saying the same thing. The fill is a step stronger than it
 * was, since it is now doing that job on its own.
 */
const STYLES: Record<CalloutType, { icon: IconSvgElement; box: string; icon_cls: string }> = {
  info: {
    icon: InformationCircleIcon,
    box: "bg-blue-500/10",
    icon_cls: "text-blue-500",
  },
  tip: {
    icon: Idea01Icon,
    box: "bg-emerald-500/10",
    icon_cls: "text-emerald-500",
  },
  warning: {
    icon: Alert02Icon,
    box: "bg-amber-500/10",
    icon_cls: "text-amber-500",
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

/** Highlighted aside for tips, warnings, and asides inside a post. */
export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon, box, icon_cls } = STYLES[type];

  /*
   * Set like the article it sits in — 18px over an opened leading. MDX gives its
   * paragraphs a top margin for the rhythm of a page; inside a box that margin
   * is a gap at the top, so `[&_p]:m-0` takes it back while the line height stays
   * the body's.
   */
  const body = (
    <div className="min-w-0 flex-1 space-y-3 text-lg leading-8 text-foreground/80 [&_p]:m-0 [&_p]:text-lg [&_p]:leading-8 [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
      {children}
    </div>
  );

  if (!title) {
    return (
      <div className={cn("my-8 flex gap-3 rounded-xl p-5", box)}>
        <HugeiconsIcon
          icon={icon}
          size={20}
          strokeWidth={2}
          className={cn("mt-1 shrink-0", icon_cls)}
          aria-hidden="true"
        />
        {body}
      </div>
    );
  }

  return (
    <div className={cn("my-8 rounded-xl p-5", box)}>
      <div className="flex items-center gap-2.5">
        <HugeiconsIcon
          icon={icon}
          size={20}
          strokeWidth={2}
          className={cn("shrink-0", icon_cls)}
          aria-hidden="true"
        />
        <p className="text-lg font-semibold text-foreground">{title}</p>
      </div>
      <div className="mt-2 pl-[1.9rem]">{body}</div>
    </div>
  );
}
