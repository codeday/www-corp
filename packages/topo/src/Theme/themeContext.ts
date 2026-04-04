import { createContext, useContext } from "react";

export interface ThemeData {
  colors: Record<string, any>;
  fonts: Record<string, string>;
  fontSizes: Record<string, string>;
  cognito: { id: string };
  strings: Record<string, string>;
  visibility: string;
  programWebname?: string;
  config?: Record<string, any>;
  [key: string]: any;
}

const defaultFontSizes: Record<string, string> = {
  "2xs": "0.625rem",
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",
};

const ThemeDataContext = createContext<ThemeData>({
  colors: {},
  fonts: {},
  fontSizes: defaultFontSizes,
  cognito: { id: "7hYXr3TPxk6yIpJxjqVoFQ" },
  strings: {},
  visibility: "Public",
});

export { defaultFontSizes };
export const ThemeDataProvider = ThemeDataContext.Provider;
export const useThemeData = (): ThemeData => useContext(ThemeDataContext);
