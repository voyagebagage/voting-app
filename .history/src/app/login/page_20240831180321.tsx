"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TelegramUser from "@/app/types";

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
              const userParams = new URLSearchParams(initData).get("user");
              if (userParams) {
                const user: TelegramUser = {
                  ...JSON.parse(userParams),
                  auth_date: Number(
                    new URLSearchParams(initData).get("auth_date")
                  ),
                  hash: new URLSearchParams(initData).get("hash") || "",
                };
                onLogin(user);
                router.push("/");
              } else {
                throw new Error("User data not found");
              }
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
