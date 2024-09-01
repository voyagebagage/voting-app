// src/globals.d.ts

interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebAppInitData {
  user?: TelegramWebAppUser;
  auth_date: number;
  hash: string;
  query_id?: string;
}

interface TelegramWebApp {
  initDataUnsafe: TelegramWebAppInitData;
  ready: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}
