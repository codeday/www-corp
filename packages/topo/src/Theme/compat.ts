import { useTheme } from "@wrksz/themes/client";
import React from "react";

/**
 * Compatibility layer for Chakra UI v2 color mode hooks.
 * In v3, color mode is managed by next-themes.
 */

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = (
    (resolvedTheme ?? "light") === "dark" ? "dark" : "light"
  ) as "light" | "dark";
  return {
    colorMode,
    setColorMode: setTheme,
    toggleColorMode: () => setTheme(colorMode === "dark" ? "light" : "dark"),
  };
}

export function useColorModeValue<L, D>(lightValue: L, darkValue: D): L | D {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? darkValue : lightValue;
}

/**
 * No-op replacement for ColorModeScript.
 * In v3 with next-themes, FOUC prevention is handled automatically by the ThemeProvider.
 */
export const ColorModeScript: React.FC<{
  type?: string;
  initialColorMode?: string;
}> = () => null;
ColorModeScript.displayName = "ColorModeScript";
