// src/context/ThemeContext.tsx
"use client";

import WebApp from "@/app/lib/twa-sdk";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

type Theme = {
  colorScheme: string;
  [key: string]: string;
};

type ThemeContextType = {
  theme: Theme;
  bgClass: string;
  textClass: string;
  buttonBgClass: string;
  buttonTextClass: string;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: { colorScheme: "dark" },
  bgClass: "",
  textClass: "",
  buttonBgClass: "",
  buttonTextClass: "",
});

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
  const [theme, setTheme] = useState<Theme>({ colorScheme: "dark" });

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
  // console.table(Object.entries(themeClasses));
  // console.table(Object.entries(theme));

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`${themeClasses.bgClass} ${themeClasses.textClass}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
