"use client";

import type { Theme, ThemeName } from "@/lib/themes";
import { themes } from "@/styles/themes";
import { PaintBoardIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { IconButton } from "@/components/icon-button";
import { ICON_ACTION_CLASS, ICON_ACTION_CLASS_SM } from "@/components/icon-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePreviewTheme } from "@/lib/preview-theme-store";
import { cn } from "@/lib/utils";

interface ThemePickerProps {
  className?: string;
  size?: "default" | "sm";
}

function Swatches({ theme }: { theme: Theme }) {
  return (
    <div className="flex gap-0.5">
      <span
        className="size-3 rounded-full border border-black/10 dark:border-white/15"
        style={{ backgroundColor: theme.colors.primary }}
      />
      <span
        className="size-3 rounded-full border border-black/10 dark:border-white/15"
        style={{ backgroundColor: theme.colors.accent }}
      />
      <span
        className="size-3 rounded-full border border-black/10 dark:border-white/15"
        style={{ backgroundColor: theme.colors.background }}
      />
    </div>
  );
}

export function ThemePicker({ className, size = "default" }: ThemePickerProps) {
  const { themeName, setThemeName, setPreviewTheme } = usePreviewTheme();

  const { lightThemes, darkThemes } = useMemo(() => {
    const all = Object.values(themes) as Theme[];
    return {
      lightThemes: all.filter((t) => t.category === "light" && t.name !== "custom"),
      darkThemes: all.filter((t) => t.category === "dark" && t.name !== "custom"),
    };
  }, []);

  const handleSelect = (name: string) => {
    setPreviewTheme(null);
    setThemeName(name as ThemeName);
  };

  const isSmall = size === "sm";

  return (
    <DropdownMenu>
      {/*
        The button on the outside, the trigger on the inside — not the other way
        round. Radix's `asChild` clones its child with a ref and its own
        handlers, and this button takes a fixed set of props and would drop them;
        with the trigger as the button's own child, the Slot merges the styling
        onto the real trigger element and the menu keeps working.
      */}
      <IconButton
        asChild
        label="Change theme"
        icon={PaintBoardIcon}
        className={cn(isSmall ? ICON_ACTION_CLASS_SM : ICON_ACTION_CLASS, className)}
      >
        <DropdownMenuTrigger />
      </IconButton>
      <DropdownMenuContent align="end" className="max-h-[420px] w-[240px] overflow-y-auto">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Light
        </DropdownMenuLabel>
        {lightThemes.map((t) => (
          <DropdownMenuItem
            key={t.name}
            onSelect={() => handleSelect(t.name)}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              {themeName === t.name ? (
                <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} aria-hidden="true" />
              ) : (
                <span className="size-3.5" />
              )}
              <span className="text-sm">{t.displayName}</span>
            </span>
            <Swatches theme={t} />
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Dark
        </DropdownMenuLabel>
        {darkThemes.map((t) => (
          <DropdownMenuItem
            key={t.name}
            onSelect={() => handleSelect(t.name)}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              {themeName === t.name ? (
                <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} aria-hidden="true" />
              ) : (
                <span className="size-3.5" />
              )}
              <span className="text-sm">{t.displayName}</span>
            </span>
            <Swatches theme={t} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
