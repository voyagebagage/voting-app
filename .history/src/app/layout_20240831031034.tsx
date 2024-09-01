"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHashValid, setIsHashValid] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      axios
        .post("/api/validate-hash", { hash: window.Telegram.WebApp.initData })
        .then((response) => setIsHashValid(response.status === 200))
        .catch((error) => {
          console.error("Hash validation error:", error);
          setIsHashValid(false);
        });
    } else {
      console.error("Telegram WebApp is not available");
      setIsHashValid(false);
    }
  }, []);

  if (!isHashValid) {
    return null;
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
