"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TelegramUser } from "@/types";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      if (webApp.initDataUnsafe.user) {
        const user = webApp.initDataUnsafe.user as TelegramUser;
        console.log("User data:", user);
        login(user);
        router.push("/");
      } else {
        console.log("No user data available");
      }
    } else {
      console.log("Telegram WebApp is not available");
    }
  }, [login, router]);

  return <div>Authenticating with Telegram...</div>;
}
