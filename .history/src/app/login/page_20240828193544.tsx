"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Corrected import
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

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    setDebugInfo(
      `Bot Name: ${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "Unknown"}`
    );

    window.TelegramLoginWidget = {
      dataOnauth: (user) => {
        console.log("Logged in as ", user);
        setUser(user);
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
      },
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Login with Telegram</h1>
      {isLoading ? (
        <div className="spinner">Loading...</div>
      ) : error ? (
        <div className="error text-red-500">{error}</div>
      ) : user ? (
        <div>Authenticated as: {user.first_name}</div>
      ) : (
        <>
          <Script
            src="https://telegram.org/js/telegram-widget.js?22"
            strategy="afterInteractive"
          />
          <div
            id={`telegram-login-${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}`}
            data-onauth="TelegramLoginWidget.dataOnauth"
            data-request-access="write"></div>
          <div>Debug Info: {debugInfo}</div>
        </>
      )}
    </div>
  );
}
