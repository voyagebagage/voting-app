// src/telegram-login.d.ts
// src/telegram.d.ts

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe: {
          user?: TelegramUser;
          auth_date: string;
          hash: string;
          query_id?: string;
        };
        initData: string;
        ready: () => void;
      };
    };
  }
}
interface Window {
  onTelegramAuth: (user: TelegramUser) => void;
}
