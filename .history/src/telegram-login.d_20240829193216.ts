// src/telegram-login.d.ts

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface Window {
  onTelegramAuth: (user: TelegramUser) => void;
}
