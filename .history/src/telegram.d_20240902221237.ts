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

interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date: string;
    hash: string;
    query_id?: string;
  };
  initData: string;
  colorScheme: "light" | "dark";
  ready: () => void;
  onEvent: (eventType: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
