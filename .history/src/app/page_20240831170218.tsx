"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegramInitData } from "../hooks/useTelegramInitData";

export default function Home() {
  const router = useRouter();
  const initData = useTelegramInitData();

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  useEffect(() => {
    if (initData?.user) {
      console.log("User data:", initData.user);
      // You can perform actions with the user data here
    } else if (initData !== null) {
      // No user data, you might want to handle this case
      console.log("No user data available");
    }
  }, [initData]);

  if (!initData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the Voting App</h1>
      {initData.user && <p>Hello, {initData.user.first_name}!</p>}
      {/* Rest of your app content */}
    </div>
  );
}
