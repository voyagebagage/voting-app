"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Login from "./login/page";
import { verifyTokenAndGetUser } from "./lib/auth";
// import { verifyTokenAndGetUser } from "@/lib/auth"; // Adjust this import path as needed

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (token) {
      verifyTokenAndGetUser(token)
        .then((userData: TelegramUser) => {
          console.log("User data:", userData);
          setUser(userData);
        })
        .catch((error: any) => {
          console.error("Token verification error:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  console.log("User:", user);
  console.log("isLoading:", isLoading);

  if (isLoading) {
    return <div className="spinner">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={(user) => setUser(user)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Welcome, {user.first_name}!</h1>
      {/* Your app content goes here */}
    </div>
  );
}
