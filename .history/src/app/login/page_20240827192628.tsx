"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Define the global function that Telegram will call
    window.onTelegramAuth = function (user: any) {
      console.log("Logged in as ", user);

      // Send the user data to your backend for verification
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
            router.push("/"); // Redirect to home page after successful login
          }
        })
        .catch((error) => console.error("Error:", error));
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Login with Telegram</h1>
      <Script
        src="https://telegram.org/js/telegram-widget.js?22"
        strategy="afterInteractive"
        onLoad={() => {
          (window as any).TelegramLoginWidget = {
            dataOnauth: (user: any) => window.onTelegramAuth(user),
          };
        }}
      />
      <div id="telegram-login-widget" className="mt-4"></div>
    </div>
  );
}
