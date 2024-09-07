// src/hooks/useTelegramTheme.ts
import { useTheme } from "@/context/ThemeProvider";

function useTelegramTheme() {
  const theme = useTheme();

  const getColorClass = (color: string | undefined, prefix: string): string => {
    if (!color) return "";

    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return `${prefix}-[rgb(${r},${g},${b})]`;
  };

  return {
    bgClass: getColorClass(theme?.bg_color, "bg"),
    textClass: getColorClass(theme?.text_color, "text"),
    buttonBgClass: getColorClass(theme?.button_color, "bg"),
    buttonTextClass: getColorClass(theme?.button_text_color, "text"),
  };
}

export default useTelegramTheme;
