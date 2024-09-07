// src/telegram.d.ts

import { TelegramUser } from "./types";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
}
interface ThemeParams {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
}
interface ThemeParams {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
}

interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date: string;
    hash: string;
    query_id?: string;
  };
  initData: string;
  colorScheme: "light" | "dark";
  themeParams: ThemeParams;
  // colorScheme: "light" | "dark";
  // themeParams: ThemeParams;
  ready: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
declare module "@twa-dev/sdk" {
  const WebApp: TelegramWebApp;
  export default WebApp;
}
