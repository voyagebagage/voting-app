/** @type {import('tailwindcss').Config} */
import { Config } from "tailwindcss/types";
// module.exports = {
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tg-theme-bg-color": "var(--tg-theme-bg-color)",
        "tg-theme-text-color": "var(--tg-theme-text-color)",
        "tg-theme-hint-color": "var(--tg-theme-hint-color)",
        "tg-theme-link-color": "var(--tg-theme-link-color)",
        "tg-theme-button-color": "var(--tg-theme-button-color)",
        "tg-theme-button-text-color": "var(--tg-theme-button-text-color)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /^(bg|text)-\[rgb\(.*\)\]$/,
    },
  ],
};
export default config;
