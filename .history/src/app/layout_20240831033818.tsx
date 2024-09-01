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
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");

  useEffect(() => {
    setDebugInfo(
      (prev) =>
        `${prev}\nWindow object available: ${typeof window !== "undefined"}`
    );

    if (typeof window !== "undefined") {
      setDebugInfo(
        (prev) => `${prev}\nTelegram object exists: ${!!window.Telegram}`
      );

      if (window.Telegram) {
        setDebugInfo(
          (prev) =>
            `${prev}\nTelegram.WebApp exists: ${!!window.Telegram.WebApp}`
        );

        if (window.Telegram.WebApp) {
          window.Telegram.WebApp.ready();
          const initData = window.Telegram.WebApp.initData;
          setDebugInfo((prev) => `${prev}\nInit Data: ${initData}`);

          if (initData) {
            axios
              .post("/api/validate-hash", { hash: initData })
              .then((response) => {
                setDebugInfo(
                  (prev) =>
                    `${prev}\nHash validation response: ${JSON.stringify(
                      response.data
                    )}`
                );
              })
              .catch((error) => {
                setDebugInfo(
                  (prev) => `${prev}\nHash validation error: ${error.message}`
                );
              });
          } else {
            setDebugInfo((prev) => `${prev}\nNo init data available`);
          }
        }
      }
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <div>
          <h1>Debug Information</h1>
          <pre>{debugInfo}</pre>
        </div>
        {children}
      </body>
    </html>
  );
}
