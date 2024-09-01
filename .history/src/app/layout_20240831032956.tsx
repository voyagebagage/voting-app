"use client";

import { useEffect, useState } from "react";
import axios from "axios";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: any;
        ready: () => void;
      };
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHashValid, setIsHashValid] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.Telegram?.WebApp) {
        setDebugInfo("Telegram WebApp is available");
        window.Telegram.WebApp.ready();

        const initData = window.Telegram.WebApp.initData;
        setDebugInfo((prev) => `${prev}\nInit Data: ${initData}`);

        axios
          .post("/api/validate-hash", { hash: initData })
          .then((response) => {
            setIsHashValid(response.data.valid);
            setDebugInfo(
              (prev) =>
                `${prev}\nHash validation response: ${JSON.stringify(
                  response.data
                )}`
            );
          })
          .catch((error) => {
            console.error("Hash validation error:", error);
            setIsHashValid(false);
            setDebugInfo(
              (prev) => `${prev}\nHash validation error: ${error.message}`
            );
          });
      } else {
        setDebugInfo("Telegram WebApp is not available");
        setIsHashValid(false);
      }
    }
  }, []);

  return (
    <html lang="en">
      <body>
        {isHashValid ? (
          children
        ) : (
          <div>
            <h1>Debug Information</h1>
            <pre>{debugInfo}</pre>
          </div>
        )}
      </body>
    </html>
  );
}
