"use client";

import type { FontDefinition } from "@/lib/fonts";
import { ArrowDown01Icon, Cancel01Icon, TextFontIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  fontDefinitions,
  getSansSerifFonts,
  getSerifFonts,
  getMonospaceFonts,
  usePreviewFont,
} from "@/lib/preview-font-store";

// Helper function to get the correct font family name
const getFontFamilyName = (font: FontDefinition): string => {
  return font.isCustomFont ? font.displayName : font.googleFontName || font.displayName;
};

// Function to load Google Fonts dynamically
const loadGoogleFont = (fontName: string) => {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${fontName
    .replace(/ /g, "+")
    .replace(/'/g, "")}:wght@400;500;600;700&display=block`;
  link.rel = "stylesheet";

  // Check if font is already loaded
  const existingLink = document.querySelector(
    `link[href*="${fontName.replace(/ /g, "+").replace(/'/g, "")}"]`
  );
  if (!existingLink) {
    document.head.appendChild(link);
  }
};

interface FontSelectboxProps {
  title: string;
  description: string;
  fontType: "sans" | "serif" | "mono";
  currentFont: FontDefinition;
  onFontSelect: (font: FontDefinition) => void;
  onFontHover?: (fontType: "sans" | "serif" | "mono", fontName: string) => void;
  onFontHoverEnd?: () => void;
}

function FontSelectbox({
  title,
  description,
  fontType,
  currentFont,
  onFontSelect,
  onFontHover,
  onFontHoverEnd,
}: FontSelectboxProps) {
  const sansSerifFonts = getSansSerifFonts();
  const serifFonts = getSerifFonts();
  const monospaceFonts = getMonospaceFonts();

  const allFonts = useMemo(
    () => [...sansSerifFonts, ...serifFonts, ...monospaceFonts],
    [sansSerifFonts, serifFonts, monospaceFonts]
  );

  // Load Google Fonts when component mounts
  useEffect(() => {
    allFonts.forEach((font) => {
      if (
        font.googleFontName &&
        font.googleFontName !== "system-ui" &&
        font.googleFontName !== "ui-sans-serif" &&
        font.googleFontName !== "ui-serif" &&
        font.googleFontName !== "ui-monospace"
      ) {
        loadGoogleFont(font.googleFontName);
      }
    });
  }, [allFonts]);

  // Group fonts with recommended first
  const getGroupedFonts = () => {
    const categoryMap = {
      sans: "sans-serif",
      serif: "serif",
      mono: "monospace",
    } as const;

    const targetCategory = categoryMap[fontType];
    const recommended = allFonts.filter((font) => font.category === targetCategory);
    const others = allFonts.filter((font) => font.category !== targetCategory);

    return { recommended, others };
  };

  const { recommended, others } = getGroupedFonts();

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="font-medium text-sm text-foreground">{title}</h3>
        <div className="text-xs opacity-60 font-normal">{description}</div>
      </div>

      {/* Font Card */}
      <div className="bg-muted border rounded-lg p-4 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="text-base font-medium"
              style={{
                fontFamily: `"${getFontFamilyName(currentFont)}", ${currentFont.fallback}`,
              }}
            >
              {currentFont.displayName}
            </div>
            <span className="text-xs px-1.5 py-0.5 bg-muted-foreground/10 rounded-full text-muted-foreground font-medium">
              {currentFont.category === "sans-serif" ? "sans" : currentFont.category}
            </span>
          </div>
        </div>

        {/* Dropdown Trigger */}
        <DropdownMenu
          onOpenChange={(open) => {
            if (!open) onFontHoverEnd?.();
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              Change
              <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-y-auto">
            {/* Recommended Fonts Group */}
            <DropdownMenuLabel className="text-xs uppercase tracking-wider">
              Recommended {title} Fonts
            </DropdownMenuLabel>
            {recommended.map((font) => (
              <DropdownMenuItem
                key={font.name}
                className="flex items-start gap-2 py-2 cursor-pointer"
                onMouseEnter={() => onFontHover?.(fontType, font.name)}
                onMouseLeave={() => onFontHoverEnd?.()}
                onSelect={() => {
                  onFontSelect(font);
                  onFontHoverEnd?.();
                }}
              >
                <div className="flex-1 flex flex-col gap-0.5">
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: `"${getFontFamilyName(font)}", ${font.fallback}`,
                    }}
                  >
                    {font.displayName}
                  </span>
                  <span
                    className="text-xs text-muted-foreground"
                    style={{
                      fontFamily: `"${getFontFamilyName(font)}", ${font.fallback}`,
                    }}
                  >
                    {font.description}
                  </span>
                </div>
                {currentFont.name === font.name && (
                  <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} className="text-primary shrink-0 mt-0.5" />
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {/* Other Fonts Group */}
            <DropdownMenuLabel className="text-xs uppercase tracking-wider">
              Other Fonts
            </DropdownMenuLabel>
            {others.map((font) => (
              <DropdownMenuItem
                key={font.name}
                className="flex items-start gap-2 py-2 cursor-pointer"
                onMouseEnter={() => onFontHover?.(fontType, font.name)}
                onMouseLeave={() => onFontHoverEnd?.()}
                onSelect={() => {
                  onFontSelect(font);
                  onFontHoverEnd?.();
                }}
              >
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-medium"
                      style={{
                        fontFamily: `"${getFontFamilyName(font)}", ${font.fallback}`,
                      }}
                    >
                      {font.displayName}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 bg-muted-foreground/30 rounded-full text-muted-foreground font-medium">
                      {font.category === "sans-serif" ? "sans" : font.category}
                    </span>
                  </div>
                  <span
                    className="text-xs text-muted-foreground/60"
                    style={{
                      fontFamily: `"${getFontFamilyName(font)}", ${font.fallback}`,
                    }}
                  >
                    {font.description}
                  </span>
                </div>
                {currentFont.name === font.name && (
                  <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} className="text-primary shrink-0 mt-0.5" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface FontSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onThemeSelectorOpen?: () => void;
  disabled?: boolean;
}

export function FontSelector({
  isOpen,
  onOpenChange,
  onThemeSelectorOpen,
  disabled = false,
}: FontSelectorProps) {
  const { fontSet, setFontSet, setPreviewFont } = usePreviewFont();

  const handleFontHover = useCallback(
    (fontType: "sans" | "serif" | "mono", fontName: string) => {
      setPreviewFont({ family: fontType, fontName });
    },
    [setPreviewFont]
  );

  const handleFontHoverEnd = useCallback(() => {
    setPreviewFont(null);
  }, [setPreviewFont]);

  // Clear preview when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setPreviewFont(null);
    }
  }, [isOpen, setPreviewFont]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        side="right"
        showOverlay={false}
        className="w-full border sm:max-w-[400px] overflow-y-auto pb-4 top-0 bottom-0 right-0 sm:right-2 sm:top-2 sm:bottom-2 rounded-[0px] sm:rounded-lg h-[calc(100dvh-16px)] gap-1 !duration-0 !animate-none"
      >
        <SheetHeader className="relative">
          <SheetTitle className="flex items-center gap-1 text-foreground">
            <HugeiconsIcon icon={TextFontIcon} size={16} strokeWidth={2} />
            Choose Fonts
            {onThemeSelectorOpen && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onThemeSelectorOpen}
                  className="ml-auto text-sm"
                >
                  Choose Theme
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
                  </Button>
                </SheetClose>
              </>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Current Selection Summary */}
          <div className="px-3 rounded-lg flex flex-col gap-4">
            <div className="flex flex-col gap-4 bg-muted border p-4 rounded-lg">
              <h3 className="font-medium text-sm text-foreground">Current Selection</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-sans">
                  <span className="text-muted-foreground font-medium">Sans-serif:</span>
                  <span className="text-foreground">{fontSet.sans.displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Serif:</span>
                  <span className="text-foreground">{fontSet.serif.displayName}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted-foreground font-medium">Monospace:</span>
                  <span className="text-foreground">{fontSet.mono.displayName}</span>
                </div>
              </div>
            </div>
            <Separator />
          </div>

          {/* Font Selection Cards */}
          <div className="space-y-4 px-4">
            <FontSelectbox
              title="Sans-serif"
              description="Commonly used for body text and paragraphs."
              fontType="sans"
              currentFont={fontSet.sans}
              onFontSelect={
                disabled
                  ? () => {}
                  : (font) => {
                      setFontSet({ sans: font });
                    }
              }
              onFontHover={handleFontHover}
              onFontHoverEnd={handleFontHoverEnd}
            />

            <FontSelectbox
              title="Serif"
              description="Often used for titles and headings."
              fontType="serif"
              currentFont={fontSet.serif}
              onFontSelect={
                disabled
                  ? () => {}
                  : (font) => {
                      setFontSet({ serif: font });
                    }
              }
              onFontHover={handleFontHover}
              onFontHoverEnd={handleFontHoverEnd}
            />

            <FontSelectbox
              title="Monospace"
              description="Ideal for code blocks and technical content."
              fontType="mono"
              currentFont={fontSet.mono}
              onFontSelect={
                disabled
                  ? () => {}
                  : (font) => {
                      setFontSet({ mono: font });
                    }
              }
              onFontHover={handleFontHover}
              onFontHoverEnd={handleFontHoverEnd}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
