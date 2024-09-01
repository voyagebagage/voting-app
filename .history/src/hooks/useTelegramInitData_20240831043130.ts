// src/hooks/useTelegramInitData.ts

import { useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface InitData {
  user?: TelegramUser;
  auth_date: number;
  hash: string;
}

export function useTelegramInitData() {
  const [initData, setInitData] = useState<InitData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      setInitData(window.Telegram.WebApp.initDataUnsafe);
    }
  }, []);

  return initData;
}
