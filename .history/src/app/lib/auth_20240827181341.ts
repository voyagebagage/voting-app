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
}

export function verifyTelegramAuth(authData: TelegramAuthData): boolean {
  try {
    const result = verifyTelegramLoginData(authData, BOT_TOKEN);
    return result === true;
  } catch (error) {
    console.error("Error verifying Telegram login data:", error);
    return false;
  }
}
