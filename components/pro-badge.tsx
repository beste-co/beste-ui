import { cn } from "@/lib/utils";

interface ProBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function ProBadge({ className, size = "sm" }: ProBadgeProps) {
  return (
    <span
      className={cn(
        // Round, like every other chip on the site. The horizontal padding grows
        // with it: a pill needs room at the ends the square version did not.
        "font-semibold text-white rounded-full tracking-wide bg-teal-600",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2 py-0.5 text-xs",
        className
      )}
    >
      PRO
    </span>
  );
}
