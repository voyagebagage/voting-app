"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyTokenAndGetUser } from "@/app/lib/auth";
import { TelegramUser } from "@/types";
import Login from "./login/page";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyTokenAndGetUser(token)
        .then((userData) => {
          if (userData) {
            setUser(userData);
          } else {
            setError("Failed to get user data");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          setError("Error verifying token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (user: TelegramUser) => {
    console.log("User logged in:", user);

    setUser(user);
    // setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <Login onLogin={() => handleLogin(user: TelegramUser)} />;
  }

  return (
    <div>
      <h1>Welcome, {user.first_name}!</h1>
      {/* Your app content */}
    </div>
  );
}
