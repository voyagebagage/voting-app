"use client";

import { useAuth } from "@/providers/AuthContext";
import { useEffect, useState } from "react";
import Login from "./login/page";
import { useTheme } from "@/providers/ThemeContext";
import VotingApp from "@/components/VotingApp";
import WebApp from "./lib/twa-sdk";
import StartupPopup from "@/components/StartupPopUp";
import CenteredSpinner from "@/components/ui/CenteredSpinner";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { bgClass, textClass, buttonBgClass, buttonTextClass, theme } =
    useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // console.log(["Home component mounted"]);
    WebApp?.ready();
    setIsReady(true);
  }, []);

  console.log(["theme light or dark", theme?.colorScheme]);

  if (!isReady) {
    if (!user) return <Login />;
    if (!isAuthenticated) return <CenteredSpinner />;
  }
  return (
    <div
      className={`min-h-screen p-4  ${
        theme.colorScheme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-white text-black"
      }`}>
      <header>Welcome, {user?.first_name}!</header>
      <div className="max-w-md mx-auto">
        <StartupPopup />
        <VotingApp />
      </div>
    </div>
  );
}
