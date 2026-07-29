import { cn } from "@/lib/utils";

interface FreeBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function FreeBadge({ className, size = "sm" }: FreeBadgeProps) {
  return (
    <span
      className={cn(
        // Same pill as ProBadge, in the yellow the grid cards already use for
        // free blocks, so the two tags read as one pair wherever they meet.
        "font-semibold text-black rounded-full tracking-wide bg-yellow-400",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2 py-0.5 text-xs",
        className
      )}
    >
      FREE
    </span>
  );
}
