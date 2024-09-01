"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { verifyTokenAndGetUser } from "@/app/auth/auth";
import Login from "./login/page";
import { verifyTokenAndGetUser } from "./api/auth/auth";

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
    if (token) {
      verifyTokenAndGetUser(token)
        .then((userData) => {
          setUser(userData);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="spinner">Loading...</div>; // Replace with your preferred spinner component
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Welcome, {user.first_name}!</h1>
      {/* Your app content goes here */}
    </div>
  );
}
