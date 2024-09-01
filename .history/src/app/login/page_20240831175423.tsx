"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
  initData: string;
}

interface LoginProps {
  onLogin: (user: TelegramUser) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      const initData = webApp.initData;

      console.log("Init Data:", initData);

      if (initData) {
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initData }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            if (data.token) {
              localStorage.setItem("token", data.token);
              const user = JSON.parse(
                new URLSearchParams(initData).get("user") || "{}"
              );
              onLogin(user);
              router.push("/");
            } else {
              throw new Error("No token received");
            }
          })
          .catch((error) => {
            console.error("Authentication error:", error);
            setError(`Failed to authenticate. ${error.message}`);
          });
      } else {
        setError("No init data available. Please open this app from Telegram.");
      }
    } else {
      setError(
        "Telegram WebApp is not available. Please open this app from Telegram."
      );
    }
  }, [onLogin, router]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Authenticating...</div>;
}
