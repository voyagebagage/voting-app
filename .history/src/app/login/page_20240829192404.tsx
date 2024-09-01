"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface LoginProps {
  onLogin: (user: TelegramUser) => void;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        initDataUnsafe: {
          user?: TelegramUser;
        };
      };
    };
  }
}

export default function Login({ onLogin }: LoginProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      const user = webApp.initDataUnsafe.user;
      if (user) {
        console.log("User data:", user);
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
      } else {
        setError("No user data available. Please open this app from Telegram.");
        setIsLoading(false);
      }
    } else {
      setError(
        "Telegram WebApp is not available. Please open this app from Telegram."
      );
      setIsLoading(false);
    }
  }, [router, onLogin]);

  if (isLoading) {
    return <div className="spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Login with Telegram</h1>
      <p>Authenticating...</p>
    </div>
  );
}
