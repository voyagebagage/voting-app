"use client";

import { useEffect, useCallback } from "react";
import { TelegramUser } from "@/types";

interface LoginProps {
  onLogin: (user: TelegramUser) => void;
}

export default function Login({ onLogin }: LoginProps) {
  console.log("Login component rendered, onLogin type:", typeof onLogin);

  const handleTelegramLogin = useCallback(
    (user: TelegramUser) => {
      console.log("Handling Telegram login:", user);
      if (typeof onLogin === "function") {
        onLogin(user);
      } else {
        console.error("onLogin is not a function:", onLogin);
      }
    },
    [onLogin]
  );

  useEffect(() => {
    console.log("Login component mounted");
    console.log("onLogin is a function:", typeof onLogin === "function");

    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      console.log("Telegram WebApp is available");

      if (webApp.initDataUnsafe.user) {
        console.log("User data:", webApp.initDataUnsafe.user);
        handleTelegramLogin(webApp.initDataUnsafe.user);
      } else {
        console.log("No user data available");
      }
    } else {
      console.log("Telegram WebApp is not available");
    }
  }, [handleTelegramLogin]);

  return <div>Authenticating...</div>;
}
