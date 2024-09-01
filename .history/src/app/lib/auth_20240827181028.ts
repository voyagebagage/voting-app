import verifyTelegramLoginData from "telegram-login-button";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  botName: string;
}

export function verifyTelegramAuth(authData: TelegramAuthData): boolean {
  return verifyTelegramLoginData(authData, BOT_TOKEN);
}
