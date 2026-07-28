"use client";

import type { Theme } from "@/lib/themes";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

interface TweakCNImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParse: (css: string) => {
    root: Partial<Theme> | null;
    dark: Partial<Theme> | null;
  };
  onSelectTheme: (theme: Partial<Theme>) => void;
}

export function TweakCNImportDialog({
  open,
  onOpenChange,
  onParse,
  onSelectTheme,
}: TweakCNImportDialogProps) {
  const [importCSS, setImportCSS] = useState("");
  const [showThemeSelection, setShowThemeSelection] = useState(false);
  const [parsedThemes, setParsedThemes] = useState<{
    root: Partial<Theme> | null;
    dark: Partial<Theme> | null;
  }>({ root: null, dark: null });
  const [selectedThemeType, setSelectedThemeType] = useState<"root" | "dark">(
    "root"
  );
  const [parseError, setParseError] = useState<string | null>(null);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setImportCSS("");
      setParseError(null);
    }
    onOpenChange(open);
  };

  const handleImportCSS = () => {
    if (!importCSS.trim()) return;

    setParseError(null);
    const parsed = onParse(importCSS);

    if (!parsed.root && !parsed.dark) {
      setParseError("Could not parse CSS. Please check your CSS code.");
      return;
    }

    setParsedThemes(parsed);

    // If both root and dark exist, show selection dialog
    if (parsed.root && parsed.dark) {
      setShowThemeSelection(true);
      handleDialogClose(false);
    } else {
      // Use whatever is available
      const themeToUse = parsed.root || parsed.dark;
      if (themeToUse) {
        onSelectTheme(themeToUse);
        handleDialogClose(false);
        setImportCSS("");
        setParseError(null);
      }
    }
  };

  const handleThemeSelection = () => {
    const themeToUse =
      selectedThemeType === "root" ? parsedThemes.root : parsedThemes.dark;

    if (themeToUse) {
      onSelectTheme(themeToUse);
    }

    setShowThemeSelection(false);
    setImportCSS("");
    setParsedThemes({ root: null, dark: null });
    setSelectedThemeType("root");
    handleDialogClose(false);
  };

  return (
    <>
      {/* Import Dialog */}
      <Dialog
        open={open && !showThemeSelection}
        onOpenChange={handleDialogClose}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          showCloseButton={false}
        >
          <DialogClose asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-4 h-8 w-8"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
            </Button>
          </DialogClose>
          <DialogHeader className="flex-shrink-0 flex items-start justify-start">
            <DialogTitle>Import Theme from tweakcn.com</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-base text-muted-foreground">
              Visit{" "}
              <a
                href="https://tweakcn.com/editor/theme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 underline font-semibold"
              >
                tweakcn
              </a>
              , create your theme, then click the <strong>Code</strong> button
              in the top right corner. In the code dialog, select{" "}
              <strong>Tailwind 4</strong> and <strong>OKLCH</strong>, then paste
              the complete code here without any omissions.
            </p>
            <div className="space-y-2">
              <Label className="font-medium text-base text-foreground">
                CSS Code
              </Label>
              <Textarea
                rows={15}
                value={importCSS}
                onChange={(e) => {
                  setImportCSS(e.target.value);
                  setParseError(null);
                }}
                placeholder="Paste your CSS code here..."
                className={`text-sm h-[160px] resize-none overflow-y-auto ${
                  parseError
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {parseError && (
                <p className="text-sm text-destructive">{parseError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                handleDialogClose(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleImportCSS} disabled={!importCSS.trim()}>
              Parse CSS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Theme Selection Dialog */}
      <Dialog open={showThemeSelection} onOpenChange={setShowThemeSelection}>
        <DialogContent
          className="sm:max-w-md max-h-[90vh] overflow-y-auto"
          showCloseButton={false}
        >
          <DialogClose asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-4 h-8 w-8"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
            </Button>
          </DialogClose>
          <DialogHeader className="flex-shrink-0 flex items-start justify-start">
            <DialogTitle>Select Theme Variant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-base text-muted-foreground">
              Your CSS contains both{" "}
              <strong>
                <i>:root</i>
              </strong>{" "}
              and{" "}
              <strong>
                <i>.dark</i>
              </strong>{" "}
              variants. Since we don't support light/dark mode switching, please
              select which variant you want to use. Only one will be applied.
            </p>
            <div className="space-y-1">
              <div className="flex bg-muted p-3 rounded-md items-center justify-between">
                <Label htmlFor="root" className="flex gap-1 cursor-pointer">
                  Use{" "}
                  <strong>
                    <i>:root</i>
                  </strong>{" "}
                  theme
                </Label>
                <Switch
                  checked={selectedThemeType === "root"}
                  onCheckedChange={(checked) => {
                    setSelectedThemeType(checked ? "root" : "dark");
                  }}
                />
              </div>
              <div className="flex bg-muted p-3 rounded-md items-center justify-between">
                <Label htmlFor="dark" className="flex gap-1 cursor-pointer">
                  Use{" "}
                  <strong>
                    <i>.dark</i>
                  </strong>{" "}
                  theme
                </Label>
                <Switch
                  checked={selectedThemeType === "dark"}
                  onCheckedChange={(checked) => {
                    setSelectedThemeType(checked ? "dark" : "root");
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowThemeSelection(false);
                setImportCSS("");
                setParsedThemes({ root: null, dark: null });
                setSelectedThemeType("root");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleThemeSelection}>Apply Theme</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
