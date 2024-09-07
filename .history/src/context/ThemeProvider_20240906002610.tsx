// src/components/ThemeProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

type Theme = {
  colorScheme: string;
  [key: string]: string;
};

const ThemeContext = createContext<Theme | null>(null);

export const useTheme = () => useContext(ThemeContext);

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

  if (!theme) return null;

  return (
    <ThemeContext.Provider value={theme}>
      <div
        style={{
          backgroundColor: theme.bg_color,
          color: theme.text_color,
        }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
