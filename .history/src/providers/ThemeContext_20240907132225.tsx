// src/context/ThemeContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import WebApp from "@twa-dev/sdk";

type Theme = {
  colorScheme: string;
  [key: string]: string;
};

type ThemeContextType = {
  theme: Theme | null;
  bgClass: string;
  textClass: string;
  buttonBgClass: string;
  buttonTextClass: string;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const getColorClass = (color: string | undefined, prefix: string): string => {
  if (!color) return "";

  // Convert hex to RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `${prefix}-[rgb(${r},${g},${b})]`;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const updateTheme = () => {
      setTheme({
        colorScheme: WebApp.colorScheme,
        ...WebApp.themeParams,
      });
    };

    updateTheme();
    WebApp.onEvent("themeChanged", updateTheme);

    return () => {
      WebApp.offEvent("themeChanged", updateTheme);
    };
  }, []);

  const themeClasses = useMemo(() => {
    if (!theme)
      return {
        bgClass: "",
        textClass: "",
        buttonBgClass: "",
        buttonTextClass: "",
      };
    return {
      bgClass: getColorClass(theme.bg_color, "bg"),
      textClass: getColorClass(theme.text_color, "text"),
      buttonBgClass: getColorClass(theme.button_color, "bg"),
      buttonTextClass: getColorClass(theme.button_text_color, "text"),
    };
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      ...themeClasses,
    }),
    [theme, themeClasses]
  );

  if (!theme) return null;

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`${themeClasses.bgClass} ${themeClasses.textClass}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
