"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramAuthData) => void;
  }
}

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    window.onTelegramAuth = function (user: TelegramAuthData) {
      console.log(
        "Logged in as " +
          user.first_name +
          " " +
          (user.last_name || "") +
          " (" +
          user.id +
          (user.username ? ", @" + user.username : "") +
          ")"
      );

      fetch("/api/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            router.push("/");
          }
        })
        .catch((error) => console.error("Error:", error));
    };
  }, [router]);

  return (
    <div>
      <h1>Login with Telegram</h1>
      <div
        id={`telegram-login-${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}`}></div>
    </div>
  );
}
