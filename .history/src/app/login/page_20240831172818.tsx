"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LoginProps {
  onLogin: (user: TelegramUser) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date: number;
          hash: string;
          query_id?: string;
        };
        initData: string;
        ready: () => void;
      };
    };
  }
}

export default function Login({ onLogin }: LoginProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      const initDataUnsafe = webApp.initDataUnsafe;
      const initData = webApp.initData as string;

      console.log("Init Data Unsafe:", initDataUnsafe);
      console.log("Init Data:", initData);

      if (initDataUnsafe.user) {
        // Send the raw initData string instead of parsed object
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initData }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.token) {
              localStorage.setItem("token", data.token);
              onLogin(initDataUnsafe.user as TelegramUser);
              router.push("/");
            } else {
              throw new Error("No token received");
            }
          })
          .catch((error) => {
            console.error("Authentication error:", error);
            setError("Failed to authenticate. Please try again.");
          });
      }
    }
  }, [onLogin, router]);

  if (isLoading) {
    return <div className="spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Login with Telegram</h1>
      <p>Please wait while we authenticate you...</p>
    </div>
  );
}
