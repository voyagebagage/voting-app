"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import WebApp from "../lib/twa-sdk";
import CenteredSpinner from "@/components/ui/CenteredSpinner";
// import WebApp from "@twa-dev/sdk";

export default function Login() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // console.log(["Login component mounted"]);
    const initData = WebApp?.initData;

    // console.log(["Init Data:", initData]);
    if (initData) {
      fetch("/api/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData }),
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success && data.user && !user) {
            console.log("Login successful, user data:", data.user);
            login(data.user);
            console.log(["~~~Login successful~~~"]);

            history.pushState({}, "", "/");
            router.push("/");
          } else {
            throw new Error("Authentication failed");
          }
        })
        .catch((error) => {
          console.error("Authentication error:", error);
          setError(`Failed to authenticate. ${error.message}`);
        });
    } else {
      setError("No init data available. Please open this app from Telegram.");
    }
    //  else {
    //   setError(
    //     "Telegram WebApp is not available. Please open this app from Telegram."
    //   );
    // }
  }, [login, router]);

  if (error) {
    return <div>{error}</div>;
  }
  //create a light blue spinner and center the div
  return <CenteredSpinner />;
}
