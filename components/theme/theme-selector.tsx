"use client";

import type { Theme, ThemeName } from "@/lib/themes";
import { themes } from "@/styles/themes";
import { Cancel01Icon, PaintBoardIcon, PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreviewTheme } from "@/lib/preview-theme-store";
import { cn } from "@/lib/utils";
import { CustomThemeEditor } from "./custom-theme-editor";

interface ThemeSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFontSelectorOpen?: () => void;
  disabled?: boolean;
}

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (themeName: string) => void;
}

function ThemeCard({ theme, isSelected, disabled, onSelect }: ThemeCardProps) {
  return (
    <div
      onClick={disabled ? undefined : () => onSelect(theme.name)}
      aria-disabled={disabled}
      className={cn(
        "group/theme relative p-4 rounded-lg border cursor-pointer transition-all",
        disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-base text-foreground">
            {theme.displayName}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div
              className="w-4 h-4 rounded-full border transition-all"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div
              className="w-4 h-4 rounded-full border transition-all"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div
              className="w-4 h-4 rounded-full border transition-all"
              style={{ backgroundColor: theme.colors.accent }}
            />
            <div
              className="w-4 h-4 rounded-full border transition-all"
              style={{ backgroundColor: theme.colors.background }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ThemeSelector({
  isOpen,
  onOpenChange,
  onFontSelectorOpen,
  disabled = false,
}: ThemeSelectorProps) {
  const {
    themeName,
    customTheme,
    setThemeName,
    setCustomTheme,
    setPreviewTheme,
  } = usePreviewTheme();
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const availableThemes = useMemo<Theme[]>(() => {
    const baseThemes = Object.values(themes) as Theme[];
    if (!customTheme) return baseThemes;

    // Add custom theme if it exists
    const existingIndex = baseThemes.findIndex(
      (t) => t.name === customTheme.name
    );
    if (existingIndex !== -1) {
      const nextThemes = [...baseThemes];
      nextThemes[existingIndex] = customTheme;
      return nextThemes;
    }

    return [...baseThemes, customTheme];
  }, [customTheme]);

  const lightThemes = useMemo(
    () =>
      availableThemes.filter(
        (t) => t.category === "light" && t.name !== "custom"
      ),
    [availableThemes]
  );

  const darkThemes = useMemo(
    () =>
      availableThemes.filter(
        (t) => t.category === "dark" && t.name !== "custom"
      ),
    [availableThemes]
  );

  const activeTheme = useMemo(() => {
    if (themeName === "custom" && customTheme) return customTheme;
    const found = themes[themeName as keyof typeof themes];
    return (found as Theme) || (themes.default as Theme);
  }, [themeName, customTheme]);

  const activeThemeCategory =
    activeTheme.category === "dark" ? "dark" : "light";
  const [themeTab, setThemeTab] = useState<"light" | "dark">(
    activeThemeCategory
  );

  const handleThemeSelect = useCallback(
    (name: string) => {
      if (disabled) return;
      setPreviewTheme(null);
      setThemeName(name as ThemeName);
    },
    [disabled, setThemeName, setPreviewTheme]
  );

  const handlePreviewChange = useCallback(
    (theme: Theme) => {
      setPreviewTheme(theme);
    },
    [setPreviewTheme]
  );

  const handleSheetOpenChange = (open: boolean) => {
    if (!open && isAdvancedMode) return;
    onOpenChange(open);
  };

  const getThemePreviewColors = (name: string) => {
    const theme =
      name === "custom" && customTheme
        ? customTheme
        : (themes[name as keyof typeof themes] as Theme) ||
          (themes.default as Theme);
    return {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
      background: theme.colors.background,
    };
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange} modal={false}>
      <SheetContent
        side="right"
        showOverlay={false}
        className="w-full border sm:max-w-[400px] flex flex-col top-0 bottom-0 right-0 sm:right-2 sm:top-2 sm:bottom-2 rounded-[0px] sm:rounded-lg h-full sm:h-[calc(100dvh-16px)] gap-1 !duration-0 !animate-none"
      >
        <SheetHeader className="relative flex-shrink-0">
          <SheetTitle className="flex items-center gap-1 text-foreground">
            <HugeiconsIcon icon={PaintBoardIcon} size={16} strokeWidth={2} />
            <span>Choose Theme</span>
            <div className="ml-auto flex items-center gap-2">
              {onFontSelectorOpen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFontSelectorOpen}
                  disabled={disabled}
                  className="text-base"
                >
                  Choose Font
                </Button>
              )}
              <SheetClose asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
                </Button>
              </SheetClose>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-2 pb-8">
          {/* Current Theme Summary */}
          <div className="px-3 rounded-lg flex flex-col gap-4 flex-shrink-0 mb-4">
            <div className="flex gap-2 bg-muted p-4 rounded-lg items-start">
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-base text-foreground">
                  Current Theme
                </h3>
                <div className="flex flex-col items-start gap-2 mt-1">
                  <div className="flex gap-1">
                    {(() => {
                      const colors = getThemePreviewColors(themeName);
                      return (
                        <>
                          <div
                            className="w-5 h-5 rounded-full border border-border"
                            style={{ backgroundColor: colors.primary }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-border"
                            style={{ backgroundColor: colors.secondary }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-border"
                            style={{ backgroundColor: colors.accent }}
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-border"
                            style={{ backgroundColor: colors.background }}
                          />
                        </>
                      );
                    })()}
                  </div>
                  {themeName !== "custom" && (
                    <span className="text-base font-normal text-muted-foreground">
                      {activeTheme.displayName}
                    </span>
                  )}
                  {themeName === "custom" && (
                    <span className="text-base font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Custom
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-4">
            {/* Custom Theme Section */}
            <div className="space-y-2">
              <h3 className="font-medium text-base text-foreground">
                Custom Theme
              </h3>
              {customTheme ? (
                <div
                  onClick={
                    disabled ? undefined : () => handleThemeSelect("custom")
                  }
                  aria-disabled={disabled}
                  className={cn(
                    "group/theme relative p-4 rounded-lg border transition-all",
                    disabled
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:shadow-md",
                    themeName === "custom"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <h4 className="font-medium text-base text-foreground">
                        {customTheme.displayName}
                      </h4>
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Custom
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className="w-4 h-4 rounded border transition-all"
                          style={{
                            backgroundColor: customTheme.colors.primary,
                          }}
                        />
                        <div
                          className="w-4 h-4 rounded border transition-all"
                          style={{
                            backgroundColor: customTheme.colors.secondary,
                          }}
                        />
                        <div
                          className="w-4 h-4 rounded border transition-all"
                          style={{ backgroundColor: customTheme.colors.accent }}
                        />
                        <div
                          className="w-4 h-4 rounded border transition-all"
                          style={{
                            backgroundColor: customTheme.colors.background,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (themeName !== "custom") {
                          handleThemeSelect("custom");
                        }
                      }}
                      disabled={disabled || themeName === "custom"}
                      className="flex-1 text-base"
                    >
                      {themeName === "custom" ? "Current Selection" : "Select"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAdvancedMode(true);
                      }}
                      disabled={disabled}
                      className="flex-1 text-base"
                    >
                      <HugeiconsIcon icon={PreferenceHorizontalIcon} size={16} strokeWidth={2} className="mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full p-4 h-auto flex flex-col items-center gap-2 border border-dashed border-border hover:border-primary/50 bg-muted rounded-lg">
                  <span className="text-base text-muted-foreground">
                    Design your own unique theme
                  </span>
                  <Button
                    variant="default"
                    onClick={() => setIsAdvancedMode(true)}
                    disabled={disabled}
                  >
                    <HugeiconsIcon icon={PreferenceHorizontalIcon} size={16} strokeWidth={2} />
                    Create custom theme
                  </Button>
                </div>
              )}
            </div>

            {/* Available Themes Section */}
            <div className="space-y-2">
              <h3 className="font-medium text-base text-foreground">
                Available Themes
              </h3>
              <Tabs
                value={themeTab}
                onValueChange={(value) =>
                  setThemeTab(value as "light" | "dark")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 gap-2">
                  <TabsTrigger value="light" className="cursor-pointer">
                    Light Themes
                  </TabsTrigger>
                  <TabsTrigger value="dark" className="cursor-pointer">
                    Dark Themes
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="light" className="space-y-2 mt-4">
                  {lightThemes.map((theme) => (
                    <ThemeCard
                      key={theme.name}
                      theme={theme}
                      isSelected={themeName === theme.name}
                      disabled={disabled}
                      onSelect={handleThemeSelect}
                    />
                  ))}
                </TabsContent>
                <TabsContent value="dark" className="space-y-2 mt-4">
                  {darkThemes.map((theme) => (
                    <ThemeCard
                      key={theme.name}
                      theme={theme}
                      isSelected={themeName === theme.name}
                      disabled={disabled}
                      onSelect={handleThemeSelect}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* CustomThemeEditor */}
        {isAdvancedMode && (
          <div className="absolute inset-0 bg-background z-10 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Custom Theme Editor</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsAdvancedMode(false)}
                className="h-8 w-8"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
              </Button>
            </div>
            <CustomThemeEditor
              initialTheme={customTheme || activeTheme}
              availableThemes={availableThemes}
              onSave={async (theme) => {
                setCustomTheme(theme);
                // Note: setCustomTheme already sets themeName to "custom" and saves to storage
                setIsAdvancedMode(false);
              }}
              onCancel={() => setIsAdvancedMode(false)}
              onClearCustomTheme={
                customTheme
                  ? async () => {
                      setCustomTheme(null);
                      setThemeName("default" as ThemeName);
                      setIsAdvancedMode(false);
                    }
                  : undefined
              }
              onPreviewChange={handlePreviewChange}
              isSaving={false}
              disabled={disabled}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
