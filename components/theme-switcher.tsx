"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { cn } from "@/lib/utils";
import { Moon02Icon, Scroll01Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const themes = [
  {
    key: "light",
    icon: Sun02Icon,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon02Icon,
    label: "Dark theme",
  },
  {
    key: "paper",
    icon: Scroll01Icon,
    label: "Paper theme",
  },
] as const;

export type ThemeSwitcherValue = (typeof themes)[number]["key"];

export type ThemeSwitcherProps = {
  value?: ThemeSwitcherValue;
  onChange?: (theme: ThemeSwitcherValue) => void;
  defaultValue?: ThemeSwitcherValue;
  className?: string;
};

export const ThemeSwitcher = ({
  value,
  onChange,
  defaultValue,
  className,
}: ThemeSwitcherProps) => {
  const [theme, setTheme] = useControllableState<ThemeSwitcherValue>({
    defaultProp: defaultValue ?? "light",
    prop: value,
    onChange,
  });
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative flex h-8 rounded-full bg-background p-1 ring-1 ring-border",
        className
      )}
    >
      {themes.map(({ key, icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            type="button"
            key={key}
            className="relative h-6 w-6 rounded-full cursor-pointer"
            onClick={() => setTheme(key)}
            aria-label={label}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <HugeiconsIcon
              icon={icon}
              size={16}
              strokeWidth={2}
              className={cn(
                "relative m-auto",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
