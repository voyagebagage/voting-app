"use client";

import { useState, useEffect } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe: {
          user?: TelegramUser;
        };
        ready: () => void;
        initData: string;
        initDataUnsafe: any;
      };
    };
  }
}

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    let info = "";

    if (typeof window !== "undefined") {
      info += "Window object is available.\n";

      if (window.Telegram) {
        info += "Telegram object is available.\n";

        if (window.Telegram.WebApp) {
          info += "WebApp object is available.\n";
          info += `initData: ${window.Telegram.WebApp.initData}\n`;
          info += `initDataUnsafe: ${JSON.stringify(
            window.Telegram.WebApp.initDataUnsafe,
            null,
            2
          )}\n`;

          window.Telegram.WebApp.ready();

          if (
            window.Telegram.WebApp.initDataUnsafe &&
            window.Telegram.WebApp.initDataUnsafe.user
          ) {
            const tUser = window.Telegram.WebApp.initDataUnsafe.user;
            setUser(tUser);
            info += `User data: ${JSON.stringify(tUser, null, 2)}\n`;
          } else {
            info += "User data is not available in initDataUnsafe.\n";
          }
        } else {
          info += "WebApp object is not available.\n";
        }
      } else {
        info += "Telegram object is not available.\n";
      }
    } else {
      info += "Window object is not available (server-side rendering).\n";
    }

    setDebugInfo(info);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Telegram WebApp Debug</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.first_name}!</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <div>No user data available</div>
      )}
      <h3>Debug Information:</h3>
      <pre>{debugInfo}</pre>
    </div>
  );
}
