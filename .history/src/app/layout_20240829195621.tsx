"use client";

import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (window.Telegram) {
      Telegram.WebApp.ready();
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-webapp.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (window.Telegram) {
              Telegram.WebApp.ready();
            }
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
