"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface LoginProps {
  onLogin: (user: TelegramUser) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe: {
          user?: TelegramUser;
        };
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
    // Ensure the Telegram WebApp object is available
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready(); // Notify Telegram that the WebApp is ready

      // Check if user data is available
      if (webApp.initDataUnsafe.user) {
        const tUser = webApp.initDataUnsafe.user;
        console.log("Telegram user data:", JSON.stringify(tUser, null, 2));

        // Authenticate with your backend
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tUser),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.token) {
              localStorage.setItem("token", data.token);
              onLogin(tUser);
              router.push("/");
            } else {
              throw new Error("No token received");
            }
          })
          .catch((error) => {
            console.error("Authentication error:", error);
            setError("Failed to authenticate. Please try again.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        console.error("User data is not available.");
        setError(
          "User data is not available. Please open this app from Telegram."
        );
        setIsLoading(false);
      }
    } else {
      console.error("Telegram WebApp is not initialized.");
      setError(
        "Telegram WebApp is not initialized. Please open this app from Telegram."
      );
      setIsLoading(false);
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
