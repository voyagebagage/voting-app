import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

export default function Login({ onLogin }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.Telegram.WebApp.onEvent('auth', (user) => {
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
    });
  }, [router, on
