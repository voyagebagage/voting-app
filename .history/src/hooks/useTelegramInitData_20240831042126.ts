import { useEffect, useState } from "react";

interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramWebAppUser;
  auth_date: number;
  hash: string;
}

function useTelegramInitData() {
  const [data, setData] = useState<TelegramWebAppInitData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window?.Telegram.WebApp) {
      setData(window?.Telegram.WebApp.initDataUnsafe);
    }
  }, []);

  return data;
}

export default useTelegramInitData;
