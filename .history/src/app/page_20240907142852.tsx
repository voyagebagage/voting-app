"use client";

import { useAuth } from "@/providers/AuthContext";
import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import Login from "./login/page";
import { useTheme } from "@/providers/ThemeContext";
import VotingApp from "@/components/VotingApp";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { bgClass, textClass, buttonBgClass, buttonTextClass, theme } =
    useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // console.log(["Home component mounted"]);
    WebApp.ready();
    console.log(["WebApp ready :" + WebApp.themeParams]);

    setIsReady(true);
  }, []);

  console.log(["User STATE HOME:", user, bgClass, textClass]);

  if (!isReady) {
    if (!user) {
      return (
        <div className="text-tg-theme-text-color">
          <Login />
        </div>
      );
    }
    if (!isAuthenticated) {
      return (
        <main className={`min-h-screen p-4 ${bgClass} ${textClass}`}>
          <div className="flex justify-center items-center h-screen">
            auth Page Loading...
          </div>
        </main>
      );
    }
  }
  return (
    <main className={`min-h-screen p-4 ${bgClass} ${textClass} ${theme}`}>
      <header>Welcome, {user?.first_name}!</header>
      <div className="max-w-md mx-auto"></div>
      <VotingApp />
    </main>
  );
}
