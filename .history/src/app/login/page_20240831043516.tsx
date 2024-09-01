// src/app/login/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTelegramInitData } from "@/hooks/useTelegramInitData";

export default function LoginPage() {
  const router = useRouter();
  const initData = useTelegramInitData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const { user, auth_date, hash } = window.Telegram.WebApp.initDataUnsafe;

      if (user && auth_date && hash) {
        // Send data to server for verification
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              auth_date,
            },
            hash,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              localStorage.setItem("token", data.token);
              router.push("/");
            } else {
              setError("Authentication failed. Please try again.");
            }
          })
          .catch((err) => {
            console.error("Authentication error:", err);
            setError("Failed to authenticate. Please try again.");
          })
          .finally(() => setIsLoading(false));
      } else {
        setError(
          "User data is not available. Please open this app from Telegram."
        );
        setIsLoading(false);
      }
    } else {
      setError(
        "Telegram WebApp is not initialized. Please open this app from Telegram."
      );
      setIsLoading(false);
    }
  }, [initData, router]);

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
