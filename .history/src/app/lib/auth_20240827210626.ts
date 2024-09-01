import verifyTelegramLoginData from "telegram-login-button";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const BOT_NAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME as string;

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set in environment variables");
}

if (!BOT_NAME) {
  throw new Error(
    "NEXT_PUBLIC_TELEGRAM_BOT_NAME is not set in environment variables"
  );
}

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
    const dataWithBotName = { ...authData, botName: BOT_NAME };
    const result = verifyTelegramLoginData(dataWithBotName, BOT_TOKEN);
    return result === true;
  } catch (error) {
    console.error("Error verifying Telegram login data:", error);
    return false;
  }
}
