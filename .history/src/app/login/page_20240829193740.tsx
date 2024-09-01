"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface LoginProps {
  onLogin: (user: TelegramUser) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.onTelegramAuth = (user: TelegramUser) => {
      console.log("Telegram auth successful");
      console.log("Telegram auth successful", user);
      setIsLoading(true);
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
            onLogin(user);
            router.push("/");
          } else {
            throw new Error("No token received");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setError("Failed to authenticate. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
  }, [router, onLogin]);
  console.log("telegram login isLoading", isLoading);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Login with Telegram</h1>
      {isLoading ? (
        <div className="spinner">Loading...</div>
      ) : error ? (
        <div className="error text-red-500">{error}</div>
      ) : (
        <>
          <Script
            src="https://telegram.org/js/telegram-widget.js?22"
            strategy="afterInteractive"
          />
          <div
            id={`telegram-login-${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}`}
            data-onauth="onTelegramAuth(user)"
            data-request-access="write"></div>
        </>
      )}
    </div>
  );
}

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}
