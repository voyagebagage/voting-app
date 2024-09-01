import { useEffect, useState } from "react";

interface TelegramWebAppInitData {
  [key: string]: any;
}

function useTelegramInitData() {
  const [data, setData] = useState<TelegramWebAppInitData>({});

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const firstLayerInitData = Object.fromEntries(
        new URLSearchParams(window.Telegram.WebApp.initData)
      );

      const initData: Record<string, any> = {};

      for (const key in firstLayerInitData) {
        try {
          initData[key] = JSON.parse(firstLayerInitData[key]);
        } catch {
          initData[key] = firstLayerInitData[key];
        }
      }

      setData(initData);
    }
  }, []);

  return data;
}

export default useTelegramInitData;
