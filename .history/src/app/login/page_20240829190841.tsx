"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [debugInfo, setDebugInfo] = useState("");

  const handleTelegramAuth = useCallback(
    async (user: TelegramUser) => {
      console.log("Logged in as ", user);
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        console.log("Auth response:", data);
        if (data.token) {
          localStorage.setItem("token", data.token);
          onLogin(user);
          router.push("/");
        } else {
          throw new Error("No token received");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to authenticate. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [onLogin, router]
  );

  useEffect(() => {
    setDebugInfo(
      `Bot Name: ${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "Unknown"}`
    );

    // Define the global callback function
    window.onTelegramAuth = handleTelegramAuth;

    console.log("TelegramLoginWidget setup complete");
    console.log("Is onTelegramAuth defined?", !!window.onTelegramAuth);

    // Cleanup function
    return () => {
      delete window.onTelegramAuth;
    };
  }, [handleTelegramAuth]);

  console.log(
    "Is Loading:",
    isLoading,
    "Error:",
    error,
    "Debug Info:",
    debugInfo
  );

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
          <div>Debug Info: {debugInfo}</div>
        </>
      )}
    </div>
  );
}

// Add this type declaration at the end of your file
declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}
