"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { TelegramUser } from "../lib/auth";
// import { TelegramUser } from "@/lib/auth";

interface LoginProps {
  onLogin: (user: TelegramUser) => void;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

export default function Login({ onLogin }: LoginProps) {
  const router = useRouter();
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
            console.log("Auth response:", data);
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
      },
    };
    console.log("TelegramLoginWidget:", window.TelegramLoginWidget);
  }, [router, onLogin]);
  console.log("Is Loading:", isLoading + " " + error + "error " + debugInfo);

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
            data-onauth="TelegramLoginWidget.dataOnauth"
            data-request-access="write"></div>
          <div>Debug Info: {debugInfo}</div>
        </>
      )}
    </div>
  );
}
