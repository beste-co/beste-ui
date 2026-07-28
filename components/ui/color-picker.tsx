"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

// Convert hex to rgba
const hexToRgba = (hex: string | undefined, alpha = 1) => {
  if (!hex) return "";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface ColorPickerProps {
  color: string | undefined;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker = ({ color, onChange, className }: ColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState(color || "#ffffff");
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedOnChange = useCallback(
    (newColor: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onChange(newColor);
      }, 50);
    },
    [onChange]
  );

  const handleColorChange = useCallback(
    (newColor: string) => {
      setCurrentColor(newColor);
      debouncedOnChange(newColor);
    },
    [debouncedOnChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;
      setCurrentColor(newColor);
      debouncedOnChange(newColor);
    },
    [debouncedOnChange]
  );

  const handleInputBlur = useCallback(() => {
    if (currentColor) {
      onChange(currentColor);
    }
  }, [currentColor, onChange]);

  const rgbaValue = useMemo(() => hexToRgba(currentColor), [currentColor]);

  return (
    <div className={`p-4 space-y-3 ${className || ""}`} onClick={(e) => e.stopPropagation()}>
      <HexColorPicker
        color={currentColor}
        onChange={handleColorChange}
        style={{ width: "200px", height: "150px" }}
      />
      <div className="space-y-1">
        <input
          type="text"
          value={currentColor}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="w-full px-2 py-1 text-xs border rounded"
          placeholder="#ffffff"
        />
        <div className="text-xs text-muted-foreground">{rgbaValue}</div>
      </div>
    </div>
  );
};
