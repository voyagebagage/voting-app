"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState<TelegramUser | null>(null);
  useEffect(() => {
    window.onTelegramAuth = function (user: TelegramUser) {
      console.log("Logged in as ", user);
      setUser(user);
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Login with Telegram</h1>
      <div>{JSON.stringify(user)}</div>
      <Script
        src="https://telegram.org/js/telegram-widget.js?22"
        strategy="afterInteractive"
      />
      <div
        id={`telegram-login-${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}`}
        data-auth-url={`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/telegram`}
        data-request-access="write"></div>
    </div>
  );
}
